(() => {
  const tabs = [...document.querySelectorAll('.cap-tile')];
  const panels = [...document.querySelectorAll('.cap-tabpanel')];
  let timer;
  function select(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => { clearTimeout(timer); select(i); });
    tab.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(timer);
      timer = setTimeout(() => select(i), 160);
    });
    tab.addEventListener('pointerleave', () => clearTimeout(timer));
    tab.addEventListener('keydown', event => {
      const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      clearTimeout(timer);
      let next = i;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else next = (i + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
      select(next, true);
    });
  });
})();
