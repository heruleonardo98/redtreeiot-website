# Review 2 · hasil perbaikan web-developer atas `ux-review-1.md`

Metode: `python -m http.server 8792` dari `site/`, browser pane, lebar 320/375/768/1024/1440/2560, ID dan EN (EN diuji di 375), ukur via `getComputedStyle`/`getBoundingClientRect`. Tidak ada kode diubah. Nomor 4 (kata status) sengaja tidak diubah, tidak dihitung.

| Kode | Kriteria | Hasil | Angka |
|---|---|---|---|
| a | `.proj-more` tersembunyi setelah dibuka | LULUS | `hidden=true`, `display:none` (sebelumnya inline-flex) |
| a | 9 proyek tampil di 375 setelah dibuka | LULUS | 9 `.proj` terlihat; 768 dan 1440 juga 9, tombol `display:none` di 768 |
| b | Tinggi `#alur` 375 <= 900 | LULUS | 857 px (ID), 823 px (EN); sebelumnya 969/935 |
| b | `#alur` 320 dan 768 | LULUS | 320: 857; 768: 708 |
| b | `#proyek` 375 <= 2.600 | LULUS | 2.506 px tertutup (terbuka 4.518) |
| c | Tidak ada teks <14px di `.estate` (375, ID+EN) | LULUS | tab 14, Jeda 14, `.phone-head` 14, `.note` 14; pemindaian semua daun teks: 0 di bawah 14 (juga di 320) |
| c | Tab tidak meluber | LULUS | `scrollWidth<=clientWidth`; EN tab kanan terjauh 276 px |
| c | `.note` tidak terpotong | LULUS | `scrollHeight==clientHeight`; tinggi 98 (ID), 117 (EN); min-height 60 |
| d | Baris in-house terlihat | LULUS | latar `#fff` di atas bagian `#FFF3F1`, border 1px `#E6E8EC`, `inset 4px` `#C02615` |
| d | Kontras judul >= 4,5:1 | LULUS | `#C02615` di `#fff` = 5,95:1, bobot 700 |
| e | Aset `?v=2` tanpa error | LULUS | styles.css, i18n-en.js, wa-float.js, script.js dimuat `?v=2` 200 OK (estate.js tanpa versi, wajar) |
| e | WA melayang benar | LULUS | `show=false` di hero (0, 1200), `true` di 3000-7504, `false` di dekat `#train-wa`, `proses`, `faq`, `.submit`, dan akhir halaman; 52x52 di 375; `display:none` di 1024 dan 1440 |
| e | Tanpa gulir horizontal | LULUS | `scrollWidth<=innerWidth` di 320, 375, 768, 1024, 1440, 2560 (selisih di >=768 = lebar scrollbar 15 px); EN 375 = 375; tidak ada elemen melewati tepi kanan |
| e | Error konsol | CATATAN | Hanya "unknown error when fetching the script" dari registrasi service worker; lihat f. Tidak ada 404 pada aset situs |
| f | Registrasi SW aman | TIDAK TERUJI | Pane menolak registrasi (`sw.js` 200, `node --check` OK, tipe `application/javascript`); kegagalan diduga batasan pane, bukan kode. Registrasi di `script.js`/`pages.js` memakai `.catch` yang hanya `console.warn`, jadi aman |
| f | Tidak memuat halaman usang | TIDAK TERUJI (kajian kode) | `networkFirst` untuk navigasi/css/js, fallback `ignoreSearch:true`, `VERSION rt-v4` menghapus cache lama saat aktivasi: logikanya benar |

## Daftar perbaikan

Tidak ada. Semua kriteria yang dapat diuji LULUS.

## Butuh keputusan pemilik

1. Kalimat status pelatihan ("Segera hadir" vs "Jadwal segera diumumkan", TODO-PEMILIK 6).
2. Nomor 5 (urutan `#proses`, ritme halaman), masih menunggu.
3. Sarankan uji SW sekali di Chrome biasa (DevTools, Application) atau setelah deploy: daftar, muat ulang, offline.
