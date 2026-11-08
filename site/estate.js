// RedTree IoT · hero estate map: three short stories told on an illustrated oil palm estate.
// Every number here is simulated for illustration; the figure caption says so on screen.

/** Indonesian strings that only live in script; English is in i18n-en.js under the same keys. */
const MAP_ID = {
  'map.pause': 'Jeda', 'map.play': 'Putar', 'map.replay': 'Putar ulang',
  'map.step.measure': 'Sensor mengukur', 'map.step.send': 'Data dikirim',
  'map.step.alarm': 'Alarm masuk ke HP', 'map.step.act': 'Tim bertindak',
  'map.hujan.0': 'Hujan deras',
  'map.hujan.alarm': 'Air parit melewati batas',
  'map.hujan.alarmBody': 'Parit antara blok A dan B: {v}',
  'map.hujan.act': 'Pintu air dibuka, air mulai turun',
  'map.kemarau.0': 'Kemarau panjang',
  'map.kemarau.alarm': 'Blok B2 mulai kering',
  'map.kemarau.alarmBody': 'Kelembapan tanah blok B2 {v}',
  'map.kemarau.act': 'Pintu air ditutup untuk menahan air',
  'map.tangki.0': 'Pabrik sedang produksi',
  'map.tangki.alarm': 'Tangki CPO hampir penuh',
  'map.tangki.alarmBody': 'Level tangki 2 {v}',
  'map.tangki.act': 'Operator memindahkan isi tangki',
};

/** @typedef {[number, number][]} Track time (s) → value keyframes, linear in between */

/**
 * @typedef {object} Story
 * @property {number} dur seconds
 * @property {'rain' | 'canal' | 'soil' | 'tank'} sensor the sensor that raises the alarm
 * @property {string[]} show callouts visible in this story
 * @property {Record<string, Track>} tracks
 * @property {{ send: number, alarm: number, act: number }} at event times
 */

/** @type {Record<string, Story>} */
const STORIES = {
  hujan: {
    dur: 14, sensor: 'canal', show: ['rain', 'canal'],
    tracks: {
      rain: [[0, 0], [0.6, 1], [7, 1], [8.2, 0]],
      mm: [[0, 0], [7, 46]],
      water: [[0, 0.42], [2, 0.42], [6, 0.84], [8.6, 0.86], [11.5, 0.5], [14, 0.46]],
      gate: [[0, 0], [8.6, 0], [9.4, 1], [13, 1], [14, 0]],
    },
    at: { send: 5.2, alarm: 6.8, act: 8.6 },
  },
  kemarau: {
    dur: 14, sensor: 'soil', show: ['soil', 'canal'],
    tracks: {
      sun: [[0, 0], [1, 1], [12, 1], [13.5, 0]],
      soil: [[0, 46], [6, 22], [9, 23], [14, 34]],
      water: [[0, 0.45], [6, 0.13], [9, 0.13], [13, 0.34], [14, 0.36]],
    },
    at: { send: 4.6, alarm: 6.2, act: 8.4 },
  },
  tangki: {
    dur: 14, sensor: 'tank', show: ['tank'],
    tracks: {
      tank: [[0, 0.55], [6, 0.94], [8.6, 0.94], [12.5, 0.6], [14, 0.58]],
      tank1: [[0, 0.3], [8.6, 0.3], [12.5, 0.64], [14, 0.64]],
    },
    at: { send: 5.4, alarm: 6.6, act: 8.6 },
  },
};
const ORDER = ['hujan', 'kemarau', 'tangki'];
const DEFAULTS = { rain: 0, sun: 0, mm: 0, water: 0.45, soil: 44, tank: 0.55, tank1: 0.3, gate: 0 };
const PACKET_MS = 1100;
const SVG_NS = 'http://www.w3.org/2000/svg';

/** @param {Track | undefined} track @param {number} t @param {number} fallback */
const valueAt = (track, t, fallback) => {
  if (!track) return fallback;
  if (t <= track[0][0]) return track[0][1];
  for (let i = 1; i < track.length; i++) {
    const [t1, v1] = track[i];
    if (t <= t1) {
      const [t0, v0] = track[i - 1];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return track.at(-1)[1];
};

/** Water level 0..1 shown in centimetres on the drain sensor. */
const cm = (w) => Math.round(20 + 60 * w);

/**
 * @param {HTMLElement} el the [data-estate] figure
 * @param {(key: string, extra?: Record<string, string>) => string} t translator from script.js
 */
export function initEstate(el, t) {
  const tr = (key) => t(key, MAP_ID);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (sel) => el.querySelector(sel);
  const svg = $('.estate-map');
  const tabs = [...el.querySelectorAll('[data-story]')];
  const playBtn = $('.estate-play');
  const steps = [...el.querySelectorAll('.story-steps li')];
  const phone = $('.phone');
  const parts = {
    rain: $('.rain'), sun: $('.sun'), water: $('.canal-water'), dry: $('.dry'),
    tank: $('.tank-level'), gate: $('.gate-door'), packets: $('.packets'),
    t1: $('.tank-liquid.t1'), t2: $('.tank-liquid.t2'),
  };
  const sensors = Object.fromEntries([...el.querySelectorAll('[data-sensor]')].map((g) => [g.dataset.sensor, g]));
  const callouts = Object.fromEntries([...el.querySelectorAll('[data-callout]')].map((g) => [g.dataset.callout, g]));
  const paths = Object.fromEntries([...el.querySelectorAll('.links path')].map((p) => [p.id.slice(3), p]));

  let story = 'hujan';
  let time = 0;
  let playing = true; // what the visitor wants
  let auto = true; // cycle through stories until the visitor picks one
  let visible = false;
  let raf = 0;
  let last = 0;
  let sent = false;
  let alarmValue = '';
  /** @type {{ path: SVGPathElement, dot: SVGCircleElement, born: number, then?: SVGPathElement }[]} */
  let packets = [];
  let nextPing = 2;

  /** Values of every channel at time `t` of the current story. */
  const values = (tt) => {
    const { tracks } = STORIES[story];
    return Object.fromEntries(Object.entries(DEFAULTS).map(([k, d]) => [k, valueAt(tracks[k], tt, d)]));
  };

  const fmt = {
    rain: (v) => `${Math.round(v.mm)} mm`,
    canal: (v) => `${cm(v.water)} cm`,
    soil: (v) => `${Math.round(v.soil)}%`,
    tank: (v) => `${Math.round(v.tank * 100)}%`,
  };
  const alarms = (v) => ({
    rain: false,
    canal: v.water > 0.7 || v.water < 0.2,
    soil: v.soil < 28,
    tank: v.tank > 0.9,
  });

  const stepLabels = () => {
    const keys = [`map.${story}.0`, 'map.step.measure', 'map.step.send', 'map.step.alarm', 'map.step.act'];
    steps.forEach((li, i) => { li.textContent = tr(keys[i]); });
  };

  const playLabel = () => {
    const ended = time >= STORIES[story].dur;
    playBtn.textContent = tr(!playing ? 'map.play' : ended ? 'map.replay' : 'map.pause');
    playBtn.setAttribute('aria-pressed', String(!playing));
  };

  const render = () => {
    const s = STORIES[story];
    const v = values(time);
    parts.rain.style.opacity = v.rain.toFixed(2);
    parts.sun.style.opacity = (v.sun * 0.3).toFixed(3);
    const h = 4 + 18 * v.water;
    parts.water.setAttribute('y', (226 - h).toFixed(1));
    parts.water.setAttribute('height', h.toFixed(1));
    parts.dry.style.opacity = Math.min(Math.max((44 - v.soil) / 22, 0), 1).toFixed(2);
    const th = 46 * v.tank;
    parts.tank.setAttribute('y', (169 - th).toFixed(1));
    parts.tank.setAttribute('height', th.toFixed(1));
    parts.gate.style.transform = `translateY(${(-18 * v.gate).toFixed(1)}px)`;
    el.classList.toggle('rainy', v.rain > 0.05);
    // mill close-up (tank story): liquid levels, feed from the press, transfer pump
    const liquid = (rect, level) => {
      const lh = 197 * level;
      rect.setAttribute('y', (317 - lh).toFixed(1));
      rect.setAttribute('height', lh.toFixed(1));
    };
    liquid(parts.t1, v.tank1);
    liquid(parts.t2, v.tank);
    el.classList.toggle('mill-on', story === 'tangki');
    el.classList.toggle('feeding', story === 'tangki' && time < 6);
    el.classList.toggle('pumping', story === 'tangki' && time >= s.at.act && time < 12.5);

    const a = alarms(v);
    for (const [k, g] of Object.entries(sensors)) {
      const shown = s.show.includes(k);
      g.classList.toggle('alarm', shown && a[k]);
      g.classList.toggle('dim', !shown);
      const c = callouts[k];
      c.classList.toggle('on', shown);
      c.classList.toggle('alarm', shown && a[k]);
      c.querySelector('text').textContent = fmt[k](v);
    }

    if (time >= s.at.alarm && !alarmValue) alarmValue = fmt[s.sensor](values(s.at.alarm));
    const alarmNote = phone.querySelector('.note-alarm');
    const actNote = phone.querySelector('.note-act');
    alarmNote.classList.toggle('on', time >= s.at.alarm);
    actNote.classList.toggle('on', time >= s.at.act);
    alarmNote.querySelector('strong').textContent = tr(`map.${story}.alarm`);
    alarmNote.querySelector('span').textContent = tr(`map.${story}.alarmBody`).replace('{v}', alarmValue || fmt[s.sensor](values(s.at.alarm)));
    actNote.querySelector('span').textContent = tr(`map.${story}.act`);
    phone.classList.toggle('ringing', time >= s.at.alarm && time < s.at.act);

    const marks = [0, 1.2, s.at.send, s.at.alarm, s.at.act];
    let current = 0;
    marks.forEach((m, i) => { if (time >= m) current = i; });
    steps.forEach((li, i) => {
      li.classList.toggle('done', i < current);
      li.classList.toggle('active', i === current);
    });
    playLabel();
  };

  /** @param {SVGPathElement} path @param {SVGPathElement} [then] */
  const sendPacket = (path, then) => {
    const dot = document.createElementNS(SVG_NS, 'circle');
    const p0 = path.getPointAtLength(0);
    dot.setAttribute('r', then ? '4.5' : '3.2');
    dot.setAttribute('class', then ? 'packet' : 'packet ping');
    dot.setAttribute('cx', p0.x.toFixed(1));
    dot.setAttribute('cy', p0.y.toFixed(1));
    parts.packets.append(dot);
    packets.push({ path, dot, born: performance.now(), then });
  };

  const movePackets = (now) => {
    packets = packets.filter((p) => {
      const k = Math.min((now - p.born) / PACKET_MS, 1);
      const ease = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const pt = p.path.getPointAtLength(p.path.getTotalLength() * ease);
      p.dot.setAttribute('cx', pt.x.toFixed(1));
      p.dot.setAttribute('cy', pt.y.toFixed(1));
      if (k < 1) return true;
      p.dot.remove();
      if (p.then) sendPacket(p.then);
      return false;
    });
  };

  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const s = STORIES[story];
    if (time < s.dur) {
      time = Math.min(time + dt, s.dur);
      if (!sent && time >= s.at.send) { sent = true; sendPacket(paths[s.sensor], paths.up); }
      nextPing -= dt;
      if (nextPing <= 0) { // quiet heartbeat from the sensors in view
        nextPing = 2.4;
        const k = s.show[Math.floor(Math.random() * s.show.length)];
        sendPacket(paths[k]);
      }
    } else if (auto) {
      time += dt;
      if (time > s.dur + 1.8) setStory(ORDER[(ORDER.indexOf(story) + 1) % ORDER.length]);
    }
    movePackets(now);
    render();
    raf = shouldRun() ? requestAnimationFrame(frame) : 0;
  };

  const shouldRun = () => playing && visible && !document.hidden && !reduce.matches
    && (time < STORIES[story].dur || auto || packets.length > 0);

  const sync = () => {
    el.classList.toggle('still', reduce.matches);
    if (reduce.matches) { time = STORIES[story].at.act + 0.5; render(); return; }
    if (shouldRun() && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    playLabel();
  };

  /** @param {string} name */
  const setStory = (name) => {
    story = name;
    time = 0;
    sent = false;
    alarmValue = '';
    nextPing = 1.5;
    packets.forEach((p) => p.dot.remove());
    packets = [];
    tabs.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.story === name)));
    stepLabels();
    render();
    sync();
  };

  tabs.forEach((b) => b.addEventListener('click', () => {
    auto = false;
    playing = true;
    setStory(b.dataset.story);
  }));
  playBtn.addEventListener('click', () => {
    if (time >= STORIES[story].dur && !auto) { playing = true; setStory(story); return; }
    playing = !playing;
    auto = auto && playing;
    sync();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.2 }).observe(svg);
  } else {
    visible = true;
  }
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  document.addEventListener('rt:lang', () => { stepLabels(); render(); });

  setStory('hujan');
}
