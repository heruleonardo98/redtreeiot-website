# RedTree IoT website

Company-profile site for RedTree IoT, an IoT & automation solutions, training and consultation business in Medan, North Sumatra. Live at https://redtreeiot.netlify.app. Netlify deploys the `site/` folder automatically when `main` changes.

## Structure
- `site/index.html` – single page. Indonesian text is written in the HTML; English lives in `site/i18n-en.js`, keyed by `data-i18n="key"` (text) and `data-i18n-alt|placeholder|arialabel="key"` (attributes). Every new piece of visible text needs a key and an English entry.
- `site/styles.css` – all styling; tokens in `:root`. Breakpoints: ≥1024 desktop, 700–1023 tablet, <700 phone, <360 small phone.
- `site/script.js` – ES module: language toggle (stored in localStorage `rt-lang`), mobile menu, estate map setup, WhatsApp message builder, service worker registration.
- `site/sitemap.xml`, `site/robots.txt`, JSON-LD in `<head>` – update the sitemap `lastmod` and add new URLs when adding pages.
- `site/estate.js` – hero estate map (simulated stories); `site/pages.css`/`pages.js` – landing pages.
- PWA: `site/manifest.webmanifest`, `site/sw.js` (network-first pages/CSS/JS, cache-first images), `site/offline.html`, `site/icons/`. Bump `VERSION` in `sw.js` when its precache list changes.
- Photos: every `assets/NAME.jpg` has `NAME-480.webp` and `NAME-960.webp`, used via `srcset`/`sizes`. Make both for any new photo.
- `brand/` – logo SVGs and photo credits (`photo-credits.json`, Wikimedia Commons; credits are also listed in the site footer).

## Design rules
- Bright design from Figma file "RedTree IoT – Website (Bright)": white ground, red `#E0301E` accent, ink `#1F2328`, tint `#FFF3F1`, grey `#F6F7F9`; font Plus Jakarta Sans (Google Fonts); rounded cards, pill buttons.
- Must work from 320px to 2560px with no horizontal scroll; test both languages.
- Accessibility: WCAG AA contrast, touch targets ≥44px on touch/small screens, respect reduced motion.
- Plain static HTML/CSS/JS – no build step, no frameworks.

## Content rules
- Facts that are true: Medan location; WhatsApp +62 822-7222-6678 (`https://wa.me/6282272226678`); prices negotiable (never show prices); training courses "coming soon".
- Never invent clients, testimonials, statistics, certifications, addresses or emails.
- The photos are openly licensed Wikimedia images, not RedTree's own projects – never caption them as RedTree's work; credit any new photo in the footer list and `brand/photo-credits.json`.
- Primary language Indonesian (target: Medan / North Sumatra). Keep copy plain and local.

## Workflow
- Work on a branch and open a pull request; merging to `main` deploys.
- Check every page at phone and desktop widths before opening the PR.
