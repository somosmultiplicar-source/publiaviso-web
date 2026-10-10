/* Nuestra Historia: línea de tiempo con GSAP + ScrollTrigger.
   - Pantallas amplias: la línea de tiempo se fija y el scroll vertical la desplaza en horizontal.
   - Móvil: lista vertical; la línea lateral se dibuja con el scroll.
   - Movimiento reducido o sin GSAP: lista vertical estática (la del CSS base). */
(function () {
  var ht = document.querySelector(".ht");
  if (!ht || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // El scroll suave por CSS falsea las mediciones de ScrollTrigger: mientras el recorrido está activo
  // se desactiva y los enlaces internos (#seccion) se desplazan con suavidad por JS.
  var root = document.documentElement;
  function smoothLinks(e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'), id = a && a.getAttribute("href");
    var el = id && id.length > 1 && document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
    if (history.pushState) history.pushState(null, "", id);
  }

  var pin = ht,
      track = ht.querySelector(".ht-track"),
      prog = ht.querySelector(".ht-progress"),
      items = gsap.utils.toArray(".ht-list > li", ht);

  // Marca los hitos alcanzados y el actual
  function mark(isReached) {
    var cur = -1;
    items.forEach(function (li, i) { var on = isReached(li); li.classList.toggle("is-past", on); if (on) cur = i });
    items.forEach(function (li, i) { li.classList.toggle("is-current", i === cur) });
  }

  // Entrada de cada hito: foto, año y texto con un leve escalonado
  function intro(li) {
    var meta = li.querySelector(".ht-meta");
    return gsap.timeline({ paused: true, defaults: { ease: "power2.out" } })
      .from(li.querySelector(".ht-fig"), { autoAlpha: 0, y: 30, duration: .9 })
      .from(meta.querySelector(".ht-year, .ht-name"), { autoAlpha: 0, duration: .7 }, .15)
      .from(meta.querySelectorAll("strong, p, .ht-kicker, .ht-dates"), { autoAlpha: 0, y: 10, duration: .6, stagger: .08 }, .25);
  }

  var mm = gsap.matchMedia();

  mm.add({
    wide: "(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
    narrow: "(max-width: 767px) and (prefers-reduced-motion: no-preference), (max-height: 599px) and (prefers-reduced-motion: no-preference)"
  }, function (ctx) {
    ht.classList.add("is-live");
    root.style.scrollBehavior = "auto";
    document.addEventListener("click", smoothLinks);

    if (ctx.conditions.wide) {
      ht.classList.add("is-h");
      var vw = function () { return document.documentElement.clientWidth },
          dist = function () { return Math.max(0, track.scrollWidth - vw()) },
          // Solo la línea de tiempo se fija, justo bajo el header (el encabezado sale de pantalla y deja todo el alto a las fotos)
          header = document.querySelector("header"),
          // Alto real del contenido (mientras está fijado, GSAP congela el alto del contenedor)
          contentH = function () { var cs = getComputedStyle(ht); return track.getBoundingClientRect().height + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) },
          pinTop = function () {
            var hh = header ? header.offsetHeight : 0;
            return Math.round(hh + Math.max(0, Math.min(24, (window.innerHeight - hh - contentH()) / 2)));
          },
          // Si el bloque no cabe en pantalla (textos largos, pantallas bajas), reduce la altura de las fotos para evitar recortes
          fit = function () {
            ht.style.removeProperty("--fh");
            var hh = header ? header.offsetHeight : 0,
                over = contentH() - (window.innerHeight - hh - 16);
            if (over > 0) ht.style.setProperty("--fh", Math.max(140, ht.querySelector(".ht-fig").offsetHeight - over) + "px");
          },
          // La punta de la línea activa recorre el viewport de 18% a 82% mientras avanza el contenido
          tip = function (p) { return p * dist() + vw() * (.18 + .64 * p) };

      fit();
      ScrollTrigger.addEventListener("refreshInit", fit);

      var horiz = gsap.to(track, {
        x: function () { return -dist() }, ease: "none",
        scrollTrigger: {
          trigger: pin, start: function () { return "top " + pinTop() + "px" }, end: function () { return "+=" + Math.round(dist() * .8) }, // 0,8 px de scroll por px horizontal: recorrido más corto
          pin: pin, scrub: .5, anticipatePin: 1, invalidateOnRefresh: true
        },
        onUpdate: function () {
          var t = tip(this.progress());
          gsap.set(prog, { scaleX: Math.min(1, t / track.scrollWidth) });
          mark(function (li) { return li.offsetLeft <= t });
        }
      });
      gsap.set(prog, { scaleX: tip(0) / track.scrollWidth });
      mark(function (li) { return li.offsetLeft <= tip(0) });

      // Los hitos visibles al llegar entran juntos; el resto, al aparecer por la derecha
      items.forEach(function (li, i) {
        var a = intro(li);
        if (li.offsetLeft < vw() * .85) {
          ScrollTrigger.create({ trigger: ht, start: "top 85%", once: true, onEnter: function () { gsap.delayedCall(i * .12, function () { a.play() }) } });
        } else {
          ScrollTrigger.create({ trigger: li, containerAnimation: horiz, start: "left 88%", once: true, onEnter: function () { a.play() } });
        }
      });
    } else {
      gsap.fromTo(prog, { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: track, start: "top 65%", end: "bottom 65%", scrub: .4 }
      });
      items.forEach(function (li) {
        var a = intro(li);
        ScrollTrigger.create({ trigger: li, start: "top 85%", once: true, onEnter: function () { a.play() } });
        ScrollTrigger.create({ trigger: li, start: "top 65%", onToggle: function () { mark(function (el) { return el.getBoundingClientRect().top <= innerHeight * .65 }) } });
      });
    }

    return function () {
      if (fit) { ScrollTrigger.removeEventListener("refreshInit", fit); ht.style.removeProperty("--fh") }
      ht.classList.remove("is-live", "is-h");
      root.style.scrollBehavior = "";
      document.removeEventListener("click", smoothLinks);
      items.forEach(function (li) { li.classList.remove("is-past", "is-current") });
    };
  });

  // Recalcula cuando terminan de cargar las fotos y las fuentes (cambian anchos y alturas)
  window.addEventListener("load", function () { ScrollTrigger.refresh() });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh() });
})();
