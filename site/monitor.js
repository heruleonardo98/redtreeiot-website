// RedTree IoT · hero "live monitor": a simulated sensor → gateway → dashboard view.
// All numbers are generated here for illustration; the panel says so on screen.

/** Indonesian strings for the monitor; English lives in i18n-en.js under the same keys. */
const MON_ID = {
  'mon.gw': 'Gateway', 'mon.db': 'Dashboard',
  'mon.ok': 'Normal', 'mon.alarm': 'Di atas batas', 'mon.low': 'Di bawah batas',
  'mon.k.n0': 'Blok A', 'mon.k.n1': 'Blok B', 'mon.k.n2': 'Parit utama', 'mon.k.n3': 'Stasiun cuaca',
  'mon.k.r0': 'Kelembapan tanah', 'mon.k.r1': 'Muka air parit', 'mon.k.r2': 'Hujan hari ini',
  'mon.p.n0': 'Tangki CPO', 'mon.p.n1': 'Pompa umpan', 'mon.p.n2': 'Rebusan', 'mon.p.n3': 'Press',
  'mon.p.r0': 'Level tangki CPO', 'mon.p.r1': 'Arus motor pompa', 'mon.p.r2': 'Getaran press',
  'mon.g.n0': 'Tangki atap', 'mon.g.n1': 'Pompa air', 'mon.g.n2': 'Panel utama', 'mon.g.n3': 'Ruang server',
  'mon.g.r0': 'Level tangki atap', 'mon.g.r1': 'Daya listrik', 'mon.g.r2': 'Suhu ruang server',
};

/**
 * @typedef {object} Reading
 * @property {number} node   index of the sensor node it comes from
 * @property {string} unit
 * @property {number} base   centre value
 * @property {number} amp    slow swing around the centre
 * @property {number} period seconds for one swing
 * @property {number} noise  random jitter per sample
 * @property {number} dec    decimals shown
 * @property {number | null} limit
 * @property {'above' | 'below'} dir which side of the limit raises the alarm
 */

/** @type {Record<string, { key: string, reads: Reading[] }>} */
const SCENES = {
  kebun: { key: 'k', reads: [
    { node: 0, unit: '%', base: 41, amp: 5, period: 40, noise: 0.6, dec: 0, limit: 30, dir: 'below' },
    { node: 2, unit: 'cm', base: 52, amp: 13, period: 26, noise: 0.8, dec: 0, limit: 62, dir: 'above' },
    { node: 3, unit: 'mm', base: 12, amp: 3, period: 60, noise: 0.1, dec: 1, limit: null, dir: 'above' },
  ] },
  pabrik: { key: 'p', reads: [
    { node: 0, unit: '%', base: 66, amp: 10, period: 50, noise: 0.4, dec: 0, limit: 90, dir: 'above' },
    { node: 1, unit: 'A', base: 18, amp: 3.6, period: 24, noise: 0.3, dec: 1, limit: 21, dir: 'above' },
    { node: 3, unit: 'mm/s', base: 3.1, amp: 0.5, period: 33, noise: 0.15, dec: 1, limit: 4.5, dir: 'above' },
  ] },
  gedung: { key: 'g', reads: [
    { node: 0, unit: '%', base: 46, amp: 24, period: 28, noise: 0.6, dec: 0, limit: 25, dir: 'below' },
    { node: 2, unit: 'kW', base: 42, amp: 7, period: 37, noise: 1, dec: 0, limit: 60, dir: 'above' },
    { node: 3, unit: '°C', base: 24, amp: 1.4, period: 45, noise: 0.1, dec: 1, limit: 27, dir: 'above' },
  ] },
};

const TICK_MS = 1200;
const HISTORY = 32;
const PACKET_MS = 900;
const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Value of a reading at time `sec` (deterministic swing plus a little noise).
 * @param {Reading} r
 * @param {number} sec
 * @param {number} phase
 */
const sample = (r, sec, phase) =>
  r.base + r.amp * Math.sin((2 * Math.PI * sec) / r.period + phase) + (Math.random() - 0.5) * 2 * r.noise;

/** @param {Reading} r @param {number} v */
const inAlarm = (r, v) => r.limit !== null && (r.dir === 'above' ? v > r.limit : v < r.limit);

/**
 * Wire up the monitor panel.
 * @param {HTMLElement} el the [data-monitor] element
 * @param {(key: string, extra?: Record<string, string>) => string} t translator from script.js
 */
export function initMonitor(el, t) {
  const tr = (key) => t(key, MON_ID);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const list = el.querySelector('.mon-read');
  const nodes = [...el.querySelectorAll('.node')];
  const links = [...el.querySelectorAll('.mon-links path')];
  const packetLayer = el.querySelector('.mon-packets');
  const tabs = [...el.querySelectorAll('[data-scene]')];

  let scene = 'kebun';
  /** @type {{ phase: number, values: number[] }[]} */
  let state = [];
  let clock = 0; // simulated seconds
  let timer = null;
  let raf = 0;
  /** @type {{ path: SVGPathElement, dot: SVGCircleElement, start: number, next: boolean }[]} */
  let packets = [];
  let visible = true;

  const build = () => {
    const { reads } = SCENES[scene];
    clock = Math.random() * 60;
    state = reads.map((r) => {
      const phase = Math.random() * Math.PI * 2;
      const values = Array.from({ length: HISTORY }, (_, i) => sample(r, clock - (HISTORY - i) * (TICK_MS / 1000), phase));
      return { phase, values };
    });
    list.innerHTML = reads.map(() => `
      <li class="read">
        <span class="r-label"></span>
        <span class="r-val"><b></b> <small></small></span>
        <svg class="spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><line class="spark-limit" x1="0" x2="100"/><polyline/></svg>
        <span class="r-state"></span>
      </li>`).join('');
    labels();
    render();
  };

  const labels = () => {
    const { key, reads } = SCENES[scene];
    nodes.forEach((g, i) => { g.querySelector('text').textContent = tr(`mon.${key}.n${i}`); });
    for (const txt of el.querySelectorAll('[data-mon]')) txt.textContent = tr(`mon.${txt.dataset.mon}`);
    [...list.children].forEach((li, i) => {
      li.querySelector('.r-label').textContent = tr(`mon.${key}.r${i}`);
      li.querySelector('small').textContent = reads[i].unit;
    });
    render();
  };

  const render = () => {
    const { reads } = SCENES[scene];
    const alarmNodes = new Set();
    [...list.children].forEach((li, i) => {
      const r = reads[i];
      const { values } = state[i];
      const v = values.at(-1);
      const alarm = inAlarm(r, v);
      if (alarm) alarmNodes.add(r.node);
      li.classList.toggle('alarm', alarm);
      li.querySelector('b').textContent = v.toLocaleString(document.documentElement.lang === 'en' ? 'en-US' : 'id-ID',
        { minimumFractionDigits: r.dec, maximumFractionDigits: r.dec });
      li.querySelector('.r-state').textContent = alarm ? tr(r.dir === 'above' ? 'mon.alarm' : 'mon.low') : tr('mon.ok');
      // sparkline scaled to the swing range (and the limit, when it is near)
      const lo = r.base - r.amp - r.noise * 2;
      const hi = r.base + r.amp + r.noise * 2;
      const y = (val) => 28 - ((Math.min(Math.max(val, lo), hi) - lo) / (hi - lo)) * 26;
      li.querySelector('polyline').setAttribute('points',
        values.map((val, j) => `${((j / (HISTORY - 1)) * 100).toFixed(1)},${y(val).toFixed(1)}`).join(' '));
      const limitLine = li.querySelector('.spark-limit');
      const showLimit = r.limit !== null && r.limit >= lo && r.limit <= hi;
      limitLine.style.display = showLimit ? '' : 'none';
      if (showLimit) { limitLine.setAttribute('y1', y(r.limit)); limitLine.setAttribute('y2', y(r.limit)); }
    });
    nodes.forEach((g, i) => g.classList.toggle('alarm', alarmNodes.has(i)));
  };

  const tick = () => {
    clock += TICK_MS / 1000;
    const { reads } = SCENES[scene];
    state.forEach((s, i) => {
      s.values.push(sample(reads[i], clock, s.phase));
      s.values.shift();
    });
    render();
    // one packet per tick from a sensor towards the gateway
    sendPacket(links[Math.floor(Math.random() * 4)], true);
  };

  /** @param {SVGPathElement} path @param {boolean} next whether to continue up to the dashboard */
  const sendPacket = (path, next) => {
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('r', '3.2');
    dot.setAttribute('class', 'packet');
    const start = path.getPointAtLength(0);
    dot.setAttribute('cx', start.x.toFixed(1));
    dot.setAttribute('cy', start.y.toFixed(1));
    packetLayer.append(dot);
    packets.push({ path, dot, start: performance.now(), next });
    if (!raf) raf = requestAnimationFrame(frame);
  };

  /** @param {number} now */
  const frame = (now) => {
    packets = packets.filter((p) => {
      const k = Math.min((now - p.start) / PACKET_MS, 1);
      const ease = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const pt = p.path.getPointAtLength(p.path.getTotalLength() * ease);
      p.dot.setAttribute('cx', pt.x.toFixed(1));
      p.dot.setAttribute('cy', pt.y.toFixed(1));
      if (k < 1) return true;
      p.dot.remove();
      if (p.next) sendPacket(links[4], false);
      return false;
    });
    raf = packets.length ? requestAnimationFrame(frame) : 0;
  };

  const running = () => visible && !document.hidden && !reduce.matches;
  const sync = () => {
    if (running() && !timer) timer = setInterval(tick, TICK_MS);
    if (!running() && timer) { clearInterval(timer); timer = null; }
    el.classList.toggle('is-live', running());
  };

  tabs.forEach((btn) => btn.addEventListener('click', () => {
    if (btn.dataset.scene === scene) return;
    scene = btn.dataset.scene;
    tabs.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    packets.forEach((p) => p.dot.remove());
    packets = [];
    build();
    list.classList.remove('swap');
    void list.offsetWidth; // restart the swap animation
    list.classList.add('swap');
  }));

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(el);
  }
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  document.addEventListener('rt:lang', labels);

  build();
  sync();
}
