// RedTree IoT · landing pages: mobile menu only
(() => {
  const menu = document.querySelector('.menu');
  const nav = document.getElementById('site-nav');
  if (!menu || !nav) return;
  const setMenu = (open) => {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Tutup menu' : 'Menu');
    nav.classList.toggle('open', open);
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (menu.getAttribute('aria-expanded') === 'true' && !e.target.closest('.nav')) setMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
})();
