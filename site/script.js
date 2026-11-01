// RedTree IoT · language, menu, entrances, WhatsApp message builder
(() => {
  const WA = 'https://wa.me/6282272226678';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const EN = window.RT_EN || {};
  // Indonesian is the page's own text; these are the strings that only live in script
  const ID = {
    'menu.open': 'Menu', 'menu.close': 'Tutup menu',
    'wa.hello': 'Halo RedTree IoT, saya tertarik dengan {need}.',
    'wa.project': ' Sektor atau proyek saya: {project}.',
    'wa.ask': ' Boleh minta penawarannya?',
    'wa.train': 'Halo RedTree IoT, saya ingin mendaftarkan minat untuk pelatihan.',
    'need.iot': 'solusi IoT', 'need.auto': 'otomasi', 'need.train': 'pelatihan', 'need.cons': 'konsultasi',
  };
  const t = (key) => (root.lang === 'en' ? EN[key] : ID[key]) || ID[key] || key;

  // Language: Indonesian lives in the HTML, English comes from i18n-en.js
  const metaDesc = document.querySelector('meta[name="description"]');
  const base = { title: document.title, desc: metaDesc.content };
  const attrs = { alt: 'alt', placeholder: 'placeholder', arialabel: 'aria-label' };
  const menu = document.querySelector('.menu');
  const nav = document.getElementById('site-nav');
  const trainWa = document.getElementById('train-wa');

  const setLang = (lang) => {
    const en = lang === 'en';
    root.lang = en ? 'en' : 'id';
    root.removeAttribute('data-lang-pending');
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      if (el.dataset.base === undefined) el.dataset.base = el.innerHTML;
      const v = EN[el.dataset.i18n];
      el.innerHTML = en && v ? v : el.dataset.base;
    });
    Object.entries(attrs).forEach(([k, name]) => {
      document.querySelectorAll(`[data-i18n-${k}]`).forEach((el) => {
        const store = `data-base-${k}`;
        if (!el.hasAttribute(store)) el.setAttribute(store, el.getAttribute(name) || '');
        const v = EN[el.getAttribute(`data-i18n-${k}`)];
        el.setAttribute(name, en && v ? v : el.getAttribute(store));
      });
    });
    document.title = en && EN['meta.title'] ? EN['meta.title'] : base.title;
    metaDesc.content = en && EN['meta.desc'] ? EN['meta.desc'] : base.desc;
    menu.setAttribute('aria-label', t(menu.getAttribute('aria-expanded') === 'true' ? 'menu.close' : 'menu.open'));
    trainWa.href = `${WA}?text=${encodeURIComponent(t('wa.train'))}`;
    try { localStorage.setItem('rt-lang', root.lang); } catch (e) { /* private mode */ }
  };
  setLang(root.getAttribute('data-lang-pending') === 'en' ? 'en' : 'id');
  document.querySelector('.lang').addEventListener('click', () => setLang(root.lang === 'id' ? 'en' : 'id'));

  // Menu (tablet and phone)
  const setMenu = (open) => {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
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

  // Entrances, once each
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  }

  // WhatsApp message builder
  const form = document.querySelector('.wa-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const project = form.text.value.trim();
    let msg = t('wa.hello').replace('{need}', t('need.' + form.need.value));
    if (project) msg += t('wa.project').replace('{project}', project);
    msg += t('wa.ask');
    window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
})();
