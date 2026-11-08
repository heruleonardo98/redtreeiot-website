// RedTree IoT · floating WhatsApp button: appears once the hero (with its own WhatsApp
// button) is scrolled past, and hides again while the contact band or footer is on screen.
(() => {
  const btn = document.querySelector('.wa-float');
  const hero = document.querySelector('.hero');
  const ends = [document.getElementById('kontak'), document.querySelector('.footer')].filter(Boolean);
  if (!btn || !hero || !('IntersectionObserver' in window)) return;

  const seen = new Map([[hero, true], ...ends.map((el) => [el, false])]);
  const update = () => {
    const show = !seen.get(hero) && !ends.some((el) => seen.get(el));
    btn.classList.toggle('show', show);
    if (show) btn.removeAttribute('tabindex'); else btn.setAttribute('tabindex', '-1');
    btn.setAttribute('aria-hidden', String(!show));
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => seen.set(e.target, e.isIntersecting));
    update();
  });
  [hero, ...ends].forEach((el) => io.observe(el));
  update();
})();
