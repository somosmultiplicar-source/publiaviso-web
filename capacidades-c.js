/* Capacidades — opción C: al llegar la siguiente tarjeta, la anterior se reduce levemente.
   No intercepta el scroll; sin GSAP o con prefers-reduced-motion, las tarjetas solo se apilan. */
(function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add("(min-width: 960px) and (min-height: 700px)", function () {
    var cards = [].slice.call(document.querySelectorAll(".stc-card"));
    var top = (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) || 72) + 12;
    cards.forEach(function (card, i) {
      if (i === cards.length - 1) return;
      gsap.to(card.querySelector(".stc-inner"), {
        scale: .96, ease: "none",
        scrollTrigger: { trigger: cards[i + 1], start: "top 85%", end: "top " + top + "px", scrub: true }
      });
    });
  });
})();
