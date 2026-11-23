# Referensi upgrade tampilan · RedTree IoT

Disusun oleh reverse-engineer (23 Nov 2026) untuk dikerjakan web-developer.
Dasar aturan: `DESIGN.md`, `CLAUDE.md`, `site/index.html`, `site/styles.css` (`:root`).
Semua teknik di bawah: HTML/CSS/JS biasa, tanpa framework/build, gerak hanya `transform`/`opacity`, patuh `prefers-reduced-motion`.

> Catatan kondisi: `screenshots/homepage-desktop.png` sudah usang (masih menampilkan kartu dashboard gelap dan menu "Contoh sistem"). HTML sekarang memakai peta kebun SVG (`estate.js`) di hero. Blueprint ini mengacu ke HTML terbaru.

---

## 0. Ringkasan diagnosis halaman sekarang

| Urutan | Bagian | Susunan sekarang | Masalah |
|---|---|---|---|
| 1 | `#top` hero | teks + peta kebun interaktif (berlabel simulasi) | Sudah kuat. Judul masih satu blok, tanpa penekanan. |
| 2 | `#sektor` | daftar tipografis besar + hover merah | Baik. Baris tidak bisa diklik ke halaman terkait. |
| 3 | `#layanan` | satu panel 2x2 bergaris | Baik, tetapi empat sel setara (tanpa satu yang dominan). |
| 4 | `#alur` | 4 kolom bernomor setara | Melanggar semangat "tanpa 3+ kotak setara"; mirip `#proses`. |
| 5 | `#proyek` | bento: 1 foto unggulan 2x2 + 8 kartu | Benar arahnya. Foto unggulan tidak "dijelaskan"; layar SCADA kecil sulit dibaca di HP. |
| 6 | `#pelatihan` | intro sticky + daftar | Baik. |
| 7 | `#tentang` | teks + 3 nilai ber-ikon | Tidak ada satu hal dominan; terasa seperti template. |
| 8 | `#proses` | 4 kolom bernomor + garis | Susunan sama dengan `#alur` (pengunjung merasa "sudah lihat ini"). |
| 9 | `#faq` | intro kiri + accordion | Baik. |
| 10 | `#kontak` | band merah + form WA | Baik (satu-satunya band merah). |

Gerak yang sudah ada: hero `rise`, `.proj:hover` naik, `.btn:active` tekan, plus beberapa gerak kecil (garis bawah menu, `.sector-lines` geser 6px, panah `.card-link`, ikon `+` FAQ berputar, ikon menu). Secara harfiah ini sudah lebih dari "tiga gerak"; anggap kuota gerak **sudah penuh**. Karena itu setiap gerak baru di bawah ditandai **BUTUH PERSETUJUAN PEMILIK**.

---

## (a) Sumber yang dipakai dan apa yang benar-benar dibaca

Saya tidak menonton video apa pun. Untuk video, yang dibaca hanya halaman deskripsi/daftar bab/ringkasan pihak ketiga.

### Artikel dan panduan (teks dibaca via WebFetch)
| Sumber | URL | Yang dibaca |
|---|---|---|
| NN/g, Scroll animations | https://www.nngroup.com/articles/scroll-animations/ | Teks penuh: animasi scroll mengganggu pengguna B2B yang berorientasi tugas; animasikan konten sekunder, bukan teks utama; mainkan sekali saja. |
| NN/g, Scrolljacking 101 | https://www.nngroup.com/articles/scrolljacking-101/ | Teks penuh: hindari mengubah kecepatan/arah scroll, jangan di atas lipatan, jangan taruh teks penting di dalamnya. |
| The Pudding, sticky scrollytelling | https://pudding.cool/process/scrollytelling-sticky/ | Teks penuh: pola grafik `position: sticky` + langkah teks, JS hanya mendeteksi langkah aktif. |
| WebKit, scroll-driven animations | https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/ | Teks penuh: `view()`, `animation-range`, urutan deklarasi, peringatan gerak lebar (parallax/zoom). |
| Chrome, kursus video scroll-driven | https://developer.chrome.com/blog/scroll-driven-animations-video-course | Halaman blog: daftar 10 episode (Bramus), dukungan Chrome/Edge 115, Firefox, Safari 26; disebut "progressive enhancement". |
| web.dev HTTP 203 (video Bramus) | https://web.dev/shows/http-203/Qf5wdXOxW3E.md.txt | Hanya daftar bab ber-timestamp (view timeline, inset, demo image reveal). Tanpa transkrip. |
| web.dev, split text animations | https://web.dev/articles/building/split-text-animations | Teks penuh: teks terbaca dulu, animasi di atasnya; pecah teks hanya bila `no-preference`; `--index` untuk stagger. |
| Tatiana Mac, no-motion-first | https://tatianamac.com/posts/prefers-reduced-motion/ | Teks penuh: default tanpa gerak, gerak dipasang di dalam `(prefers-reduced-motion: no-preference)`. |
| htmlburger, animasi di situs B2B | https://htmlburger.com/blog/animation-in-b2b-websites-guide/ | Teks penuh: microinteraction sebagai umpan balik, demo alur untuk produk kompleks, jangan animasikan semua elemen, beri tombol jeda untuk loop. |
| Chrome, stagger dengan `sibling-index()` | https://developer.chrome.com/docs/modern-web-guidance/guides/ui-behaviors/dynamic-sibling-animations | Hanya cuplikan hasil pencarian (fallback `--sibling-index`, matikan saat reduced motion). |
| Screenhance, screenshot landing page | https://screenhance.com/blog/saas-landing-page-screenshots | Hanya cuplikan hasil pencarian: satu screenshot = satu kemampuan; potong ulang untuk HP; anotasi di screenshot fitur, bukan hero. Vendor, anggap arah saja. |
| Panduan bento (StudioMeyer, dev.to) | https://studiomeyer.io/en/blog/bento-grid-layouts · https://dev.to/dev48v/a-bento-grid-is-just-css-grid-with-intent-equal-tracks-a-row-height-one-hero-that-spans-2x2-27l9 | Hanya cuplikan hasil pencarian: susunan mengikuti hierarki konten, satu sel dominan 2x2. Klaim "35% lebih lama" tidak bersumber, diabaikan. |

### Video YouTube (tidak ditonton)
| Video | URL | Yang dibaca |
|---|---|---|
| Kevin Powell, "Incredible scroll-based animations with CSS-only" | https://www.youtube.com/watch?v=CnhYu68Rxau (ID dari situs mirror, belum terverifikasi) | Hanya cuplikan hasil pencarian Class Central (topik: `scroll()`, `view()`, animasi hero, dukungan browser). Halaman YouTube dan Class Central gagal dibuka; ringkasan Recapio kosong. |
| Bramus, "Unleash the power of Scroll-Driven Animations" (10 episode) | lewat https://developer.chrome.com/blog/scroll-driven-animations-video-course | Hanya judul episode. |

### Situs perusahaan yang dibedah (teks halaman via WebFetch; warna/gaya visual TIDAK terlihat dari teks, jadi klaim "terang/bersih" belum diverifikasi visual)
| Situs | URL | Pola yang terbaca |
|---|---|---|
| Disruptive Technologies (sensor nirkabel) | https://www.disruptive-technologies.com/ | Tepat setelah hero: grid ubin "data langsung" (ikon, lokasi, nilai: suhu freezer, CO2, pintu terbuka). Diagram alur 4 tahap (sensor → konektor → cloud → aplikasi) dengan status OK / peringatan / error. Kartu solusi dengan widget status kecil ("Within limits"). |
| Samsara (IoT armada) | https://www.samsara.com/ | UI produk ditampilkan kecil dan selalu dipasangkan dengan teks fitur; daftar 5 kemampuan di samping 2 screenshot; foto pekerja + formulir di HP. |
| Tulip (platform pabrik) | https://tulip.co/ | Disusun per industri → kasus pakai → fitur, tiap blok ditutup ajakan. |
| Vention (otomasi modular) | https://vention.com/ | Tab per area aplikasi (foto + paragraf). Bahasa sederhana per tahap ("Design / Program / Deploy"). Tiga cara kerja sama (turnkey, didampingi, mandiri). |
| Augury (perawatan prediktif) | https://www.augury.com/ | Perbandingan dua kolom "alat lama vs dengan Augury". "How it works" 5 langkah bertumpuk vertikal. |
| Blues (konektivitas IoT) | https://blues.com/ | FAQ di beranda, blok ajakan diulang, kartu industri berfoto. Alur hardware → cloud hanya dijelaskan dengan teks (contoh yang sebaiknya TIDAK ditiru: tanpa diagram). |

Yang TIDAK diambil dari situs-situs itu: dinding logo klien, pita statistik, testimoni, harga, angka ROI (semua dilarang oleh `CLAUDE.md` karena RedTree belum punya datanya).

---

## (b) Teknik konkret

Label:
- **AMAN** = sesuai `DESIGN.md` apa adanya (statis, atau memakai salah satu dari tiga gerak yang sudah diizinkan).
- **BUTUH PERSETUJUAN PEMILIK** = menambah gerak baru atau mengubah aturan.

Setiap teks baru wajib punya `data-i18n` + entri di `site/i18n-en.js`. Cek 320px sampai 2560px, ID dan EN.

---

### T1. Judul hero muncul per baris · AMAN (bagian dari gerak "judul/hero muncul naik pelan")
- **Bagian:** `#top` `.hero-text h1`.
- **Kenapa cocok:** tipografi "kinetik" yang paling ringan. Tetap satu gerak yang sama (rise), hanya dipecah per baris agar judul terasa disusun, bukan ditempel. Sumber: web.dev split text (teks terbaca dulu), Tatiana Mac (no-motion-first).
- **Cara:** pecah per **baris/frasa dengan kunci i18n sendiri**, bukan per huruf lewat JS. Ini aman untuk tombol bahasa karena i18n mengganti isi per kunci.
```html
<h1>
  <span class="h1-line" data-i18n="hero.h1a">IoT &amp; otomasi</span>
  <span class="h1-line" data-i18n="hero.h1b">yang bekerja di lapangan.</span>
</h1>
```
```css
.h1-line { display: block; }
@media (prefers-reduced-motion: no-preference) {
  .h1-line { animation: rise .8s var(--ease) both; }
  .h1-line:nth-child(2) { animation-delay: .08s; }
}
```
  Lalu geser delay elemen `.hero-text` berikutnya +0.08s.
- **Risiko/aksesibilitas:** pembaca layar membaca dua span sebagai satu judul (aman). Hapus `hero.h1` lama dari `i18n-en.js`, tambah `hero.h1a`/`hero.h1b`. Jangan pecah per huruf (bahasa EN akan patah aneh, dan menambah ratusan node).

### T2. Garis penekanan merah statis pada frasa kunci · AMAN
- **Bagian:** frasa "di lapangan" di H1, dan satu frasa per H2 terpilih (maks. 2-3 di seluruh halaman, mis. `#alur` "keputusan", `#kontak` tidak perlu karena sudah merah).
- **Kenapa cocok:** `DESIGN.md` menyebut "garis penekanan" sebagai peran resmi aksen merah. Memberi satu titik fokus per judul (prinsip "satu anchor" dari artikel hierarki).
```css
.mark { background: linear-gradient(var(--red), var(--red)) 0 92% / 100% .12em no-repeat; }
```
  Catatan: `linear-gradient` di sini dipakai sebagai garis solid satu warna, bukan gradasi. Kalau pemilik menganggap ini melanggar "tanpa gradasi", pakai `text-decoration: underline var(--red) .12em; text-underline-offset: .12em; text-decoration-skip-ink: none;`.
- **Risiko:** perlu `<span class="mark" data-i18n="...">` dengan kunci sendiri agar ikut terjemahan. Jangan diberi animasi "menggambar garis" (itu gerak baru, lihat T11).

### T3. `#alur` menjadi diagram sticky + langkah (scrollytelling tanpa scrolljacking) · AMAN (versi tanpa transisi)
- **Bagian:** `#alur` (sekarang 4 kolom setara).
- **Kenapa cocok:** inti cerita RedTree adalah rantai sensor → gateway → dashboard → tindakan. Disruptive Technologies dan Augury sama-sama menampilkan alur ini sebagai diagram/langkah bertumpuk; Blues yang hanya pakai teks terasa abstrak. Pola Pudding: grafik `position: sticky`, langkah teks di-scroll normal, JS hanya menandai langkah aktif. NN/g: tidak mengubah kecepatan scroll, jadi bukan scrolljacking. Juga menghapus kemiripan dengan `#proses`.
- **Susunan:** desktop 2 kolom (kiri diagram SVG sticky, kanan 4 langkah dengan jarak lega); HP/tablet: diagram di atas (tidak sticky), langkah di bawah.
```html
<div class="flow-story">
  <figure class="flow-fig"><svg ...><g data-node="1">...</g>...</svg></figure>
  <ol class="flow-steps"><li data-step="1">...</li>...</ol>
</div>
```
```css
.flow-story { display: grid; grid-template-columns: 5fr 6fr; gap: clamp(32px, 5vw, 80px); }
.flow-fig { position: sticky; top: 100px; align-self: start; }
.flow-steps li { padding-block: clamp(32px, 8vh, 96px); }
.flow-fig [data-node] { opacity: .35; }
.flow-fig[data-active="1"] [data-node="1"],
.flow-fig[data-active="2"] [data-node="2"] { opacity: 1; } /* dst. */
@media (max-width: 1023px) { .flow-story { grid-template-columns: 1fr; } .flow-fig { position: static; } }
```
```js
const fig = document.querySelector('.flow-fig');
fig.dataset.active = '1';
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) fig.dataset.active = e.target.dataset.step;
}), { rootMargin: '-45% 0px -45% 0px' });
document.querySelectorAll('.flow-steps [data-step]').forEach(li => io.observe(li));
```
- **Risiko/aksesibilitas:** perubahan sorotan **tanpa** `transition` = perubahan status, bukan gerak (AMAN). Menambahkan `transition: opacity` = gerak baru → BUTUH PERSETUJUAN. Di HP semua node tampil penuh (`opacity: 1`) agar tidak bergantung scroll. Jangan pakai `overflow: hidden` pada leluhur (`.section`, `.wrap`) karena mematikan sticky. Diagram diberi `role="img"` + `<desc>`; isi langkah tetap teks HTML biasa (bukan di dalam SVG). Gaya ikon/diagram mengikuti peta kebun yang sudah ada, bukan ilustrasi 3D.

### T4. Kalimat pembanding "Tanpa sistem vs Dengan sistem" · AMAN
- **Bagian:** di `#alur`, di atas atau di bawah diagram T3 (atau sebagai pembuka `#layanan`).
- **Kenapa cocok:** pola dua kolom Augury ("alat lama vs dengan kami") membuat manfaat konkret tanpa angka. Untuk RedTree bisa kualitatif dan lokal: keliling blok mengecek parit vs notifikasi di HP mandor (sesuai cerita di peta hero).
```html
<div class="compare">
  <div><h3 data-i18n="cmp.a">Tanpa sistem</h3><ul>...</ul></div>
  <div class="compare-b"><h3 data-i18n="cmp.b">Dengan sensor RedTree</h3><ul>...</ul></div>
</div>
```
  Kolom kanan dominan (latar `--tint`, judul merah gelap); kolom kiri teks `--muted`, tanpa latar. Bukan dua kartu setara.
- **Risiko:** DILARANG memakai angka (hemat X%, Y jam). Isi kalimat minta disetujui pemilik. Simbol centang/silang memakai SVG + teks, bukan warna saja.

### T5. Anotasi bernomor pada foto proyek unggulan · AMAN (isi perlu dicek pemilik)
- **Bagian:** `#proyek` `.proj-feature` (layar SCADA single-line diagram).
- **Kenapa cocok:** foto asli adalah bukti terkuat di halaman ini, tapi di layar kecil isinya tidak terbaca. Tip Screenhance: anotasi dipasang di screenshot fitur (bukan hero), satu screenshot = satu kemampuan. Samsara selalu memasangkan UI dengan teks penjelas.
```html
<figure class="annot">
  <img ...>
  <span class="pin" style="--x:22%; --y:30%" aria-hidden="true">1</span>
  <span class="pin" style="--x:64%; --y:58%" aria-hidden="true">2</span>
</figure>
<ol class="annot-list"><li data-i18n="pj.a1">Status breaker</li><li data-i18n="pj.a2">Daya tiap pembangkit</li></ol>
```
```css
.annot { position: relative; }
.pin { position: absolute; left: var(--x); top: var(--y); translate: -50% -50%;
  width: 28px; height: 28px; border-radius: 999px; display: grid; place-items: center;
  background: var(--red); color: #fff; font-weight: 700; font-size: .8125rem; }
```
- **Risiko:** pin statis (tanpa denyut). Legenda adalah daftar teks biasa, jadi pembaca layar tidak butuh pin. Posisi pin dalam % agar tetap pas saat gambar mengecil; uji di 320px (pin bisa menutupi detail, boleh disembunyikan < 360px dan hanya tampilkan legenda). Jangan menulis nilai/angka dari layar yang tidak dikonfirmasi pemilik. Pertahankan kalimat "pengalaman pendiri".

### T6. Potongan khusus HP untuk tangkapan layar dashboard (art direction) · AMAN (butuh aset baru)
- **Bagian:** `#proyek` gambar SCADA/dashboard (`proyek-scada-sld`, `proyek-dashboard-prototipe`, `proyek-oee`).
- **Kenapa cocok:** sumber screenshot: gambar yang terbaca di 1600px tidak terbaca di kolom 360px, buat potongan terpisah. Ini cara paling murah membuat "dashboard" terlihat menarik di HP (mayoritas pengunjung lokal).
```html
<picture>
  <source media="(max-width: 699px)" srcset="assets/proyek-scada-sld-crop-480.webp 480w" sizes="100vw">
  <img src="assets/proyek-scada-sld.jpg" srcset="..." sizes="..." width="1280" height="720" alt="...">
</picture>
```
- **Risiko:** setiap potongan baru tetap ikut aturan gambar (`.jpg` + `-480.webp` + `-960.webp`, `width`/`height`, alt jujur) dan aturan crop data pribadi/IP. Tambahkan ke precache `sw.js` bila perlu dan naikkan `VERSION`. Potongan HP butuh rasio sendiri, jadi berikan `width`/`height` di `<source>` agar tidak ada lompatan tata letak.

### T7. `#sektor`: setiap baris menjadi tautan ke halaman yang relevan · AMAN
- **Bagian:** `#sektor .sector-lines`.
- **Kenapa cocok:** pola Tulip/Disruptive: industri → kasus pakai → langkah berikutnya. Baris tipografis besar sudah dominan; menjadikannya tautan membuat hover merah yang ada punya fungsi, dan mengalirkan pengunjung ke halaman SEO.
  Pemetaan usulan: Perkebunan → `monitoring-kebun-sawit/`; Pabrik sawit, Pabrik, Gedung → `jasa-iot-otomasi-medan/`; Sekolah → `pelatihan-plc-iot-medan/`.
```html
<li><a class="sector-link" href="monitoring-kebun-sawit/"><h3 data-i18n="sec.1">Perkebunan</h3><p data-i18n="sec.1p">...</p></a></li>
```
  Tambah indeks kecil di kiri (`01`–`05`) berwarna `--red-dark` bila ingin ritme; jangan huruf kapital semua.
- **Risiko:** satu tautan per baris (blok utuh), fokus terlihat (`:focus-visible` outline). Hover memakai gerak yang sudah ada (tidak menambah gerak). Pastikan tinggi area klik ≥ 44px (sudah).

### T8. `#tentang` menjadi satu pernyataan tipografis raksasa · AMAN
- **Bagian:** `#tentang` (sekarang teks + 3 nilai ber-ikon setara).
- **Kenapa cocok:** `DESIGN.md`: setiap bagian punya satu hal dominan. Bagian ini cocok memakai "pernyataan besar" (ukuran mendekati H2, bobot 700-800) yang meringkas sikap RedTree, lalu tiga nilai jadi daftar bergaris tipis tanpa kotak ikon (berbeda dari panel `#layanan` dan kartu `#proyek`).
```css
.about-lead { font-size: clamp(1.5rem, 1.1rem + 1.8vw, 2.375rem); font-weight: 700;
  line-height: 1.2; letter-spacing: -0.02em; color: var(--ink); max-width: 24ch; }
.values { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border-top: 1px solid var(--line); }
.values li { padding-top: 20px; }
```
- **Risiko:** kalimat besar harus pendek (≤ 2 baris desktop) agar tidak melelahkan; teks panjang tetap di paragraf biasa. Kontras `--ink` di putih aman. Isi kalimat = pemadatan dari teks yang sudah ada, tanpa klaim baru.

### T9. `#proses` sebagai lini waktu vertikal dengan aksi di langkah pertama · AMAN
- **Bagian:** `#proses` (sekarang 4 kolom bernomor, kembar dengan `#alur`).
- **Kenapa cocok:** Augury memakai langkah bertumpuk vertikal; Vention memakai bahasa sederhana per tahap. Membedakan susunan dari `#alur` (yang menjadi diagram sticky di T3), dan langkah 1 "Chat kami" langsung berisi tombol WhatsApp kecil sehingga proses dan ajakan menyatu.
```css
.steps { grid-template-columns: 1fr; max-width: 760px; gap: 0; }
.steps li { grid-template-columns: 56px 1fr; column-gap: 20px; padding-bottom: 32px; }
.steps li:not(:last-child)::before { top: 48px; bottom: 0; left: 21px; right: auto; width: 2px; height: auto; }
```
  Desktop boleh dua kolom: judul `#proses` besar di kiri (sticky seperti `.training-intro`), lini waktu di kanan. Tetapi jangan sama persis dengan `#pelatihan`; pilih salah satu: judul kiri ATAU lini waktu tengah.
- **Risiko:** tetap `<ol>` agar urutan terbaca. Tombol kecil min 44px di layar sentuh. Teks langkah 3 tetap "Harga bisa dinego" tanpa angka.

### T10. Microinteraction umpan balik tanpa gerak: "Salin nomor" · AMAN
- **Bagian:** nomor telepon di `.hero-text .meta` dan `#kontak .contact-list`.
- **Kenapa cocok:** htmlburger: microinteraction = konfirmasi bahwa aksi tercatat. Pengunjung desktop (staf kantor perkebunan/pabrik) sering menyalin nomor ke WA Web/HP. Umpan balik cukup perubahan teks, tanpa animasi, jadi tidak menambah kuota gerak.
```html
<button type="button" class="copy" data-copy="+6282272226678" data-i18n="ct.copy">Salin nomor</button>
<span class="copy-status" role="status" aria-live="polite"></span>
```
```js
document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); b.nextElementSibling.textContent = T('ct.copied'); }
  catch { b.nextElementSibling.textContent = b.dataset.copy; }
}));
```
  (`T()` = fungsi pengambil teks sesuai bahasa yang dipakai `script.js`; sesuaikan.)
- **Risiko:** `navigator.clipboard` butuh HTTPS (Netlify sudah). Teks status perlu kunci i18n ID+EN. Tombol tidak boleh mengalahkan tombol WA merah: pakai gaya `.text-link`/`btn-tint` kecil.

### T11. Muncul sekali saat discroll untuk elemen SEKUNDER · BUTUH PERSETUJUAN PEMILIK
- **Bagian:** gambar di `#proyek` dan diagram T3 saja. **Bukan** judul, paragraf, atau tombol.
- **Kenapa (dan kenapa hati-hati):** memberi kesan "hidup" saat menggulir. Tetapi NN/g menemukan animasi scroll membuat pengguna B2B frustrasi bila teks harus menunggu; sarannya: hanya konten sekunder, dan **main sekali**. Karena `animation-timeline: view()` diputar ulang saat scroll balik dan masih progressive enhancement (WebKit/Chrome), lebih cocok IntersectionObserver sekali-jalan.
```css
@media (prefers-reduced-motion: no-preference) {
  .js .reveal:not(.in) { opacity: 0; transform: translateY(12px); }
  .js .reveal { transition: opacity .5s var(--ease), transform .5s var(--ease); }
}
```
```js
if (matchMedia('(prefers-reduced-motion: no-preference)').matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}
```
- **Kenapa perlu persetujuan:** menambah gerak keempat (pemicu scroll) di luar tiga gerak `DESIGN.md`.
- **Risiko:** tanpa JS / reduced motion, konten tampil langsung (no-motion-first). Jangan pasang pada gambar di atas lipatan (LCP). Gerak kecil (12px), bukan parallax/zoom (peringatan WebKit soal gerak lebar).

### T12. Transisi sorotan pada diagram `#alur` + garis penekanan "tergambar" · BUTUH PERSETUJUAN PEMILIK
- **Bagian:** node diagram T3 (`transition: opacity .3s`), garis `.mark` T2 (`transform: scaleX(0→1)` pada pseudo-element saat hero muncul).
- **Kenapa:** membuat urutan sensor → tindakan terasa mengalir; garis yang tergambar memberi aksen kinetik pada judul.
```css
@media (prefers-reduced-motion: no-preference) {
  .flow-fig [data-node] { transition: opacity .3s var(--ease); }
  .mark { position: relative; background: none; }
  .mark::after { content: ""; position: absolute; left: 0; right: 0; bottom: .02em; height: .12em;
    background: var(--red); transform-origin: left; animation: draw .6s .5s var(--ease) both; }
  @keyframes draw { from { transform: scaleX(0); } }
}
```
- **Kenapa perlu persetujuan:** keduanya gerak baru (bukan rise/hover/tekan).
- **Risiko:** kecil; tetap pastikan versi statis (T2/T3) sudah benar dulu.

### Tidak disarankan (dibaca, lalu sengaja ditolak)
| Teknik | Alasan |
|---|---|
| Scrolljacking / pin panjang yang mengubah kecepatan scroll | NN/g: disorientasi, terburuk di HP dan bila ada teks. |
| Parallax, zoom saat scroll | WebKit: pemicu pusing; juga gerak baru. |
| Animasi buka-tutup FAQ dengan tinggi (`interpolate-size`, `height`) | Bukan `transform`/`opacity`. |
| Penghitung angka statistik ("100+ sensor terpasang") | Tidak ada data; dilarang `CLAUDE.md`. |
| Dinding logo klien, testimoni, pita ROI (pola Samsara/Vention/Augury) | Dilarang; RedTree belum punya datanya. |
| Strip logo berjalan (marquee) | Gerak terus-menerus tanpa fungsi. |
| Pecah judul per huruf dengan JS | Rawan dengan i18n, berat, sulit dibaca pembaca layar. |
| Indikator progres scroll di nav (`animation-timeline: scroll()`) | Nilai kecil untuk halaman satu-kolom; gerak baru. Hanya bila pemilik ingin. |
| Kartu "dashboard gelap" sebagai pulau warna | Sudah diganti peta terang; menambah suasana yang bertabrakan dengan "terang, bersih". |

---

## (c) Urutan pengerjaan (dampak terbesar dulu)

1. **T3 + T4** `#alur` diagram sticky + pembanding. Dampak terbesar: menjelaskan apa yang dijual, sekaligus menghapus pelanggaran "4 kotak setara" dan kembaran `#proses`. (AMAN)
2. **T9** `#proses` jadi lini waktu vertikal + tombol di langkah 1. Kerjakan bersama no. 1 agar dua bagian ini langsung berbeda. (AMAN)
3. **T5 + T6** `#proyek` anotasi foto unggulan + potongan HP. Menguatkan bukti asli; tunggu konfirmasi isi anotasi dan potongan dari pemilik. (AMAN, butuh aset/konfirmasi)
4. **T1 + T2** hero judul per baris + garis penekanan statis. Murah, terasa di kesan pertama. (AMAN)
5. **T8** `#tentang` pernyataan besar. (AMAN)
6. **T7** `#sektor` baris jadi tautan. (AMAN)
7. **T10** tombol salin nomor. (AMAN)
8. **T11, T12** hanya setelah pemilik setuju menambah kuota gerak di `DESIGN.md` (bagian "Gerak").

Setelah tiap langkah: cek 320 / 360 / 700 / 1024 / 1440 / 2560px, ID dan EN, reduced motion aktif, tidak ada scroll horizontal, kontras AA, fokus terlihat. Bila gaya baru ditambah (mis. `.mark`, `.pin`), catat di `DESIGN.md` bersama `:root`.
