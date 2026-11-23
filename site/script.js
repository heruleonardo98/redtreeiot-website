// RedTree IoT · language, menu, live monitor, WhatsApp message builder (ES module)
import { initEstate } from './estate.js';

const WA = 'https://wa.me/6282272226678';
const root = document.documentElement;
const EN = window.RT_EN ?? {};

// Indonesian is the page's own text; these are the strings that only live in script
const ID = {
  'menu.open': 'Menu', 'menu.close': 'Tutup menu',
  'wa.hello': 'Halo RedTree IoT, saya tertarik dengan {need}.',
  'wa.project': ' Sektor atau proyek saya: {project}.',
  'wa.ask': ' Boleh minta penawarannya?',
  'wa.train': 'Halo RedTree IoT, saya ingin mendaftarkan minat untuk pelatihan.',
  // TODO-PEMILIK: teks awal WhatsApp berikut usulan sementara; teks final menunggu pemilik (tanpa harga, tanpa janji waktu balas).
  'wa.hero': 'Halo RedTree IoT, saya ingin bertanya tentang layanan Anda.', // TODO-PEMILIK: teks final (hero, nav, tombol melayang)
  'wa.faq': 'Halo RedTree IoT, saya punya pertanyaan yang belum terjawab di situs.', // TODO-PEMILIK: teks final
  'wa.proses': 'Halo RedTree IoT, kebutuhan saya: ', // TODO-PEMILIK: teks final (pengunjung melengkapi di akhir)
  'ct.copied': 'Nomor disalin',
  'need.iot': 'solusi IoT', 'need.auto': 'otomasi', 'need.train': 'pelatihan', 'need.cons': 'konsultasi',
};

/**
 * Look up a script-only string in the current language.
 * @param {string} key
 * @param {Record<string, string>} [extra] Indonesian strings owned by another module
 * @returns {string}
 */
export const t = (key, extra = {}) => {
  const id = ID[key] ?? extra[key];
  return (root.lang === 'en' ? EN[key] : id) ?? id ?? key;
};

const metaDesc = document.querySelector('meta[name="description"]');
const base = { title: document.title, desc: metaDesc?.content ?? '' };
const attrs = { alt: 'alt', placeholder: 'placeholder', arialabel: 'aria-label' };
const menu = document.querySelector('.menu');
const nav = document.getElementById('site-nav');
const trainWa = document.getElementById('train-wa');

/** @param {'id' | 'en'} lang */
const setLang = (lang) => {
  const en = lang === 'en';
  root.lang = en ? 'en' : 'id';
  root.removeAttribute('data-lang-pending');
  for (const el of document.querySelectorAll('[data-i18n]')) {
    el.dataset.base ??= el.innerHTML;
    const v = EN[el.dataset.i18n];
    el.innerHTML = en && v ? v : el.dataset.base;
  }
  for (const [k, name] of Object.entries(attrs)) {
    for (const el of document.querySelectorAll(`[data-i18n-${k}]`)) {
      const store = `data-base-${k}`;
      if (!el.hasAttribute(store)) el.setAttribute(store, el.getAttribute(name) ?? '');
      const v = EN[el.getAttribute(`data-i18n-${k}`)];
      el.setAttribute(name, en && v ? v : el.getAttribute(store));
    }
  }
  document.title = en && EN['meta.title'] ? EN['meta.title'] : base.title;
  if (metaDesc) metaDesc.content = en && EN['meta.desc'] ? EN['meta.desc'] : base.desc;
  menu?.setAttribute('aria-label', t(menu.getAttribute('aria-expanded') === 'true' ? 'menu.close' : 'menu.open'));
  for (const a of document.querySelectorAll('[data-wa]')) {
    const ctx = a.dataset.wa === 'nav' || a.dataset.wa === 'float' ? 'hero' : a.dataset.wa;
    a.href = `${WA}?text=${encodeURIComponent(t(`wa.${ctx}`))}`;
  }
  if (trainWa) trainWa.href = `${WA}?text=${encodeURIComponent(t('wa.train'))}`;
  try { localStorage.setItem('rt-lang', root.lang); } catch { /* private mode */ }
  document.dispatchEvent(new CustomEvent('rt:lang', { detail: root.lang }));
};

// Menu (tablet and phone)
/** @param {boolean} open */
const setMenu = (open) => {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', t(open ? 'menu.close' : 'menu.open'));
  nav.classList.toggle('open', open);
};
if (menu && nav) {
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
  });
  document.addEventListener('click', (e) => {
    if (menu.getAttribute('aria-expanded') === 'true' && !e.target.closest('.nav')) setMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
}

// Nav gets a hairline shadow once the page scrolls
const navBar = document.querySelector('.nav');
const sentinel = document.querySelector('.hero');
if (navBar && sentinel && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => navBar.classList.toggle('scrolled', entry.boundingClientRect.top < 0),
    { threshold: [0, 1], rootMargin: '-1px 0px 0px 0px' }).observe(sentinel);
}

// Estate map in the hero: set up before the first setLang so it renders in the right language
const estateEl = document.querySelector('[data-estate]');
if (estateEl) initEstate(estateEl, t);

setLang(root.getAttribute('data-lang-pending') === 'en' ? 'en' : 'id');
document.querySelector('.lang')?.addEventListener('click', () => setLang(root.lang === 'id' ? 'en' : 'id'));

// Flow story: mark the stage whose text is at the middle of the screen (desktop styles only dim the others)
const flowFig = document.querySelector('.flow-fig');
if (flowFig && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) flowFig.dataset.active = e.target.dataset.step;
  }, { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('.flow-steps [data-step]').forEach((li) => io.observe(li));
}

// Copy phone number: feedback is a text change next to the button
for (const btn of document.querySelectorAll('[data-copy]')) {
  const status = btn.nextElementSibling;
  btn.addEventListener('click', async () => {
    let msg;
    try { await navigator.clipboard.writeText(btn.dataset.copy); msg = t('ct.copied'); } catch { msg = btn.dataset.copy; }
    if (status) {
      status.textContent = msg;
      setTimeout(() => { status.textContent = ''; }, 4000);
    }
  });
}

// WhatsApp message builder
const form = document.querySelector('.wa-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const project = form.text.value.trim();
  let msg = t('wa.hello').replace('{need}', t(`need.${form.need.value}`));
  if (project) msg += t('wa.project').replace('{project}', project);
  msg += t('wa.ask');
  window.open(`${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

// Projects: on phones show the first four, the rest open with a button (all visible without JS)
const projList = document.getElementById('proj-list');
const projMore = document.querySelector('.proj-more');
if (projList && projMore) {
  const phone = window.matchMedia('(max-width: 699px)');
  let opened = false;
  const sync = () => {
    projMore.hidden = !phone.matches || opened;
    if (phone.matches && !opened) projList.setAttribute('data-collapsed', ''); else projList.removeAttribute('data-collapsed');
  };
  projMore.addEventListener('click', () => {
    opened = true;
    projMore.setAttribute('aria-expanded', 'true');
    sync();
    projList.querySelector('.proj-x h3')?.focus?.();
  });
  phone.addEventListener('change', sync);
  sync();
}

// Offline support and faster repeat visits (see sw.js)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => console.warn('Service worker not registered:', err));
  });
}
