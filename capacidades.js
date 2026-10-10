/* Nuestras capacidades: tarjetas con ficha técnica.
   - Ratón (escritorio): el hover muestra una vista previa; el clic la fija. Al cerrar con el
     cursor encima, la vista previa no reaparece hasta salir de la tarjeta.
   - Táctil y teclado: el toque, Enter o Espacio abren y cierran; Escape cierra la ficha fijada.
   - Para lectores de pantalla solo existe la ficha fijada (aria-expanded + inert). */
(() => {
  const wrap = document.querySelector('.cap-cards');
  if (!wrap) return;
  const cards = [...wrap.querySelectorAll('.cap-card')];
  const overlay = matchMedia('(min-width: 760px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const state = new Map(cards.map(c => [c, { pinned: false, preview: false, suppress: false }]));

  function render(card) {
    const s = state.get(card), open = s.pinned || s.preview;
    card.classList.toggle('is-open', open);
    card.classList.toggle('is-pinned', s.pinned);
    card.querySelector('.cap-toggle').setAttribute('aria-expanded', String(s.pinned));
    const sheet = card.querySelector('.cap-sheet');
    sheet.inert = !s.pinned;
    if (s.pinned) sheet.removeAttribute('aria-hidden'); else sheet.setAttribute('aria-hidden', 'true');
  }
  function pin(card, value) {
    // Con la ficha dentro de la tarjeta, solo una fijada a la vez; en la columna única pueden convivir (evita saltos de scroll)
    if (value && overlay.matches) cards.forEach(o => { if (o !== card && state.get(o).pinned) { state.get(o).pinned = false; render(o) } });
    const s = state.get(card);
    s.pinned = value;
    if (!value) { s.preview = false; s.suppress = true }
    render(card);
  }

  cards.forEach(card => {
    const s = state.get(card);
    card.addEventListener('pointerenter', e => {
      if (e.pointerType !== 'mouse' || !overlay.matches || !finePointer.matches || s.suppress) return;
      s.preview = true; render(card);
    });
    card.addEventListener('pointerleave', e => {
      if (e.pointerType !== 'mouse') return;
      s.preview = false; s.suppress = false; render(card);
    });
    card.addEventListener('click', e => {
      const onToggle = e.target.closest('.cap-toggle');
      if (!onToggle && e.target.closest('.cap-sheet')) return; // leer o seleccionar texto en la ficha no la cierra
      if (!onToggle && !overlay.matches && !e.target.closest('.cap-cover')) return;
      pin(card, !s.pinned);
    });
    card.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || !s.pinned) return;
      pin(card, false);
      s.suppress = false;
      card.querySelector('.cap-toggle').focus();
    });
  });
  overlay.addEventListener('change', () => cards.forEach(c => { state.get(c).preview = false; render(c) }));

  cards.forEach(render);
  wrap.classList.add('is-js');
})();
