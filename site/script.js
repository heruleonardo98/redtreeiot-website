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
