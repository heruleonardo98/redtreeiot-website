# Review 1 · implementasi spesifikasi `ux-audit-upgrade-visual.md` (bagian c, no. 1-4, 6-8)

Metode: server lokal `127.0.0.1:8791`, browser pane, lebar 320/375/768/1024/1440/2560, ID dan EN, pengukuran lewat `getComputedStyle`, `getBoundingClientRect`, kontras rumus WCAG. Tidak ada kode diubah. Nomor 5 sengaja dilewati (menunggu pemilik).

Catatan uji: browser sempat memakai `wa-float.js` lama dari cache HTTP; hasil di bawah diambil setelah muat ulang paksa. Pengunjung yang pernah membuka situs bisa mengalami hal yang sama, lihat perbaikan 7.

## Hasil per nomor

| No | Kriteria | Hasil | Angka |
|---|---|---|---|
| 1 | Cincin fokus putih di tautan telepon, Salin nomor, Instagram, TikTok (+ tombol kirim) | LULUS | `outline-color rgb(255,255,255)`, `solid`, 3px (terukur 2,4px karena skala pane), offset sama; `:focus-visible` true. Kontras 4,55:1 |
| 1 | Tidak ada perubahan bagian lain | LULUS | (select/input form memakai gaya sendiri, tidak berubah) |
| 2 | Tombol melayang 375: hilang saat tombol merah lain terlihat >=60% | LULUS | Diuji pada `#train-wa`, `[data-wa=proses]`, `[data-wa=faq]`, `.submit`: `show=false`; tampil di tengah halaman |
| 2 | Tidak ada tombol melayang di 1440 | LULUS | `display:none` di 1024, 1440, 2560 |
| 2 | Ukuran >=44px | LULUS | 52x52 di 375 (pil 200x52 di 768) |
| 2 | `scroll-padding-bottom` | LULUS | 88px di 375 dan 768 |
| 3 | Semua tombol WA beranda punya `?text=` berbeda per konteks | LULUS | nav, hero, proses, faq, float, `#train-wa` semua berisi teks; hanya tautan WA footer polos (wajar) |
| 3 | Teks berganti saat EN/ID | LULUS | ID "Halo RedTree IoT, ..." menjadi EN "Hello RedTree IoT, ..." untuk semua; `proses` berakhir `kebutuhan saya: ` |
| 3 | Tanpa JS tetap berfungsi | LULUS | `href` di HTML polos `wa.me/6282272226678` |
| 4 | Panah di 5 baris, 375 dan 1440 | LULUS | svg 24px, stroke `rgb(192,38,21)` (5,95:1 di putih), `grid-template-columns` 299px 24px di 375 |
| 4 | Target sentuh >=44px | LULUS | tinggi baris 119 (375), 85 (768), 99 (1440) |
| 4 | Keterangan EN muncul, ID tidak | LULUS | ID `display:none`; EN `block` "Linked pages are in Indonesian." |
| 6 | Tinggi `#proyek` 375 <= 2.600 | LULUS | 2.506 px (tertutup); terbuka 4.586 px; 9 proyek dapat dibuka |
| 6 | Tombol "Lihat 5 proyek lain" 52px, btn-tint | LULUS | 52 x 335, latar `#FFF3F1`, teks `#C02615` |
| 6 | Setelah dibuka, tombol hilang | GAGAL | atribut `hidden=true` tetapi computed `display:inline-flex` (kelas `.btn` menimpa); tombol tetap tampil, teks masih "Lihat 5 proyek lain", klik kedua tidak berbuat apa-apa |
| 6 | 768 dan 1440: semua 9 proyek tampil, tombol tersembunyi | LULUS | `display:none`, 9 terlihat |
| 6 | Tinggi `#alur` 375 <= 900 | GAGAL | 969 px (ID), 935 (EN, 4 langkah sama); 320: 969. Rincian: padding bagian 64+64, head 138, 4 `li` x 169 |
| 6 | Diagram `#alur` disembunyikan <1024 | LULUS | `display:none` di 375, 768; `block` di 1024+ |
| 6 | Kontras tahap tidak aktif >=4,5 | LULUS | opacity .65: teks ink di atas kotak putih pada `#F6F7F9` = 5,05:1 |
| 6 | 1440: sticky, sorotan aktif merah | LULUS | `position: sticky; top:100px`; aktif `stroke rgb(224,48,30)` 2,5px; non-aktif 1,5px abu; `transition-duration 0s` |
| 6 | Sorotan berpindah mengikuti gulir | TIDAK TERUJI penuh | nilai `data-active` berubah 1 menjadi 2 menjadi 3; tahap 4 tidak sempat aktif di tes saya (pane hidden menunda IntersectionObserver). Logika tidak berubah dari sebelumnya |
| 7 | `aria-live` di dalam `figure.estate` | LULUS | hanya `.phone="off"` |
| 7 | `.estate-note` di dalam `.estate-bar`, 14px | LULUS | induk `estate-bar`, 14px |
| 7 | Nama blok opacity .75 | LULUS | 0,75 |
| 7 | Tidak ada teks <14px di `#pelatihan`, `.estate`, `.badge`, `.story-steps li` | GAGAL | 375: tab (Hujan deras, Kemarau, Tangki pabrik) 13px, tombol Jeda 13px, "HP mandor" 12px, `.note` (judul+isi alarm dan tindakan) 13px. Penyebab: `.estate-tabs button` di media query HP `.8125rem` (baris 426), `.phone-head` `.75rem` (398), `.note` `.8125rem` (402) |
| 8 | Hanya 1 lencana status + 1 "Sesuai permintaan"; 6 lencana lama hilang | LULUS | 2 `.badge` di `#pelatihan` |
| 8 | Teks lencana status | GAGAL (kecil) | berbunyi "Segera hadir" / "Coming soon" (kunci `tr.soon`); spesifikasi meminta "Jadwal segera diumumkan" / "Schedule to be announced" (`tr.status`). Konfirmasi pemilik soal kalimat ini masih TODO-PEMILIK 6 |
| 8 | Tombol WA "Chat WhatsApp" / "Chat on WhatsApp" | LULUS | nav, hero, proses, faq, float; `#train-wa` memang berteks khusus |
| 8 | Label form terlihat 14px dan terbaca di band merah | LULUS | 2 label, 14px, putih di `#E0301E` = 4,55:1 |
| 8 | Tombol kirim EN, `faq.p` EN | LULUS | "Send via WhatsApp", "Can't find your answer? Chat with us." |
| 8 | Tidak ada teks ID tertinggal di EN | LULUS | pemindaian kata ID: 0 sisa |
| Umum | Gulir horizontal 320-2560 | LULUS | `scrollWidth <= innerWidth` di 320, 375, 768, 1024, 1440, 2560 (ID); 375 EN juga; tidak ada elemen melewati tepi kanan |
| Umum | Menu muat di 1024 (6 item) | LULUS | tidak ada gulir, tombol menu tersembunyi |

## Daftar perbaikan untuk web-developer

1. (GAGAL no. 6) Tombol `proj-more` tetap tampil setelah dibuka. Tambah `styles.css`: `.proj-more[hidden] { display: none; }`. Selesai bila setelah klik tombol tidak terlihat dan `getComputedStyle(btn).display === 'none'`.
2. (GAGAL no. 6) Tinggi `#alur` di <1024. Di `@media (max-width: 1023px)`: `#alur.section { padding-block: 40px; }` dan `.flow-steps li { padding-block: 12px; }` (turun 48 + 32 = 80 px, hasil perkiraan 889 px). Ukur ulang di 320, 375, 768; target <= 900 di 375. Bila ada baris yang tidak sengaja mepet, boleh `.flow-steps li { gap: 8px }`.
3. (GAGAL no. 7) Teks <14px di `.estate`. Ubah menjadi `.875rem` (14px) di semua lebar: hapus `font-size: .8125rem` pada `.estate-tabs button, .estate-play` di media query HP (baris 426); `.phone-head { font-size: .875rem; }`; `.note { font-size: .875rem; }`. Setelah itu cek di 375 bahwa tab tidak meluber (`flex-wrap` sudah aktif) dan `.note` tidak terpotong; `min-height` `.note:not(.on)` naikkan ke 56px bila tinggi aktif berubah.
4. (GAGAL kecil no. 8) Lencana status: kunci `tr.status`, ID "Jadwal segera diumumkan", EN "Schedule to be announced", ganti `tr.soon` pada `.course-status .badge`. Tunggu konfirmasi pemilik hanya bila ia keberatan; sementara pakai teks ini.
5. (Keputusan desain no. 3, di bawah) Ubah gaya baris in-house.
6. (Opsional, no. 6 audit sub-butir 2) tombol `btn-tint` "Tanya tentang pengalaman ini" (WA berteks awal) di bawah daftar proyek belum ada; tidak termasuk bagian (c), jadi hanya dikerjakan bila nomor 6 dianggap utuh.
7. (Ketahanan cache) `sw.js`/`_headers` ada, tetapi pengunjung tanpa service worker bisa menerima `wa-float.js` lama dari cache HTTP. Naikkan parameter versi di tag script (`wa-float.js?v=2`, `script.js?v=2`, `styles.css?v=2`) atau pastikan `_headers` memberi `Cache-Control: no-cache` untuk `.js`/`.css`. Ini kecil tetapi memengaruhi perilaku tombol melayang di pengguna lama.

## Jawaban keputusan desain no. 3 (baris in-house di `#pelatihan`)

Masalah benar: `#pelatihan` berlatar `--tint` (`#FFF3F1`), sehingga baris berlatar `--tint` hilang. Dalam browser, baris putih dengan garis merah kini terlihat jelas, jadi arahnya benar. Tetapi kotak merah penuh 2px terbaca seperti elemen "terpilih/galat". Keputusan:

```css
.courses li.course-inhouse {
  background: #fff;                         /* satu-satunya baris kontras terhadap latar tint; baris lain tetap putih tanpa garis */
  border: 1px solid var(--line);
  box-shadow: inset 4px 0 0 var(--red-dark); /* penanda kiri 4px, bukan kotak penuh */
  border-radius: 14px;
}
.courses li.course-inhouse span:first-child { color: var(--red-dark); font-weight: 700; }
```

Hapus `border: 2px solid var(--red-dark)`. Kontras: judul `#C02615` di putih = 5,95:1 (di tint 5,48:1); penanda kiri `#C02615` di putih = 5,95:1 (>=3:1 untuk komponen UI). Tetap patuh DESIGN.md: satu aksen merah, tanpa gradasi dan tanpa glow (`inset` penuh tanpa blur, offset 0 blur 0). Catatan: baris lain di `#pelatihan` kini putih juga (terukur `rgb(255,255,255)`), jadi pembeda utama in-house adalah penanda kiri, judul merah gelap tebal, dan lencana "Sesuai permintaan"; itu cukup, tidak perlu latar berbeda.

## Pengamatan menyeluruh

- Tidak ada regresi terukur: tidak ada tumpang tindih tombol melayang dengan tombol merah, header 1024 muat, 768 `#alur` 820 px, `#proyek` 768 = 2.856 px dan 1440 = 2.402 px (semua kartu tampil).
- Teks terpotong: tidak ditemukan pada pengukuran; `.note` perlu dicek ulang setelah perbaikan 3.
- Ritme: karena nomor 5 dilewati, `#proses` masih berada setelah `#tentang`, dan `#faq` serta `#pelatihan` masih memakai pola intro-kiri + daftar-kanan. Pola monoton itu belum diperbaiki dan baru terselesaikan setelah pemilik memutuskan nomor 5.
- Tautan WA footer ("WhatsApp") tetap tanpa `?text=`; dapat diterima.

## Butuh keputusan pemilik

1. Nomor 5 (pindahkan `#proses` ke setelah `#proyek`, item menu "Cara kerja", angka tipografis tanpa pil, `#faq` kolom tunggal): menyentuh DESIGN.md; tanpa ini ritme dasar halaman tetap monoton.
2. Kalimat status pelatihan "Jadwal segera diumumkan" (TODO-PEMILIK 6) dan teks awal WA per konteks (TODO-PEMILIK 1).
3. Tujuan baris sektor (TODO-PEMILIK 2) dan versi EN halaman landing (TODO-PEMILIK 3): keterangan "Linked pages are in Indonesian." hanya menambal.
