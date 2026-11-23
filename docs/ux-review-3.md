# Review 3 (terakhir) · hasil nomor 5 (urutan `#proses`, menu 7 item, ritme)

Metode: `python -m http.server 8793` dari `site/`, browser pane, lebar 320/375/700/768/1024/1200/1440/2560 (ID) dan 320/375/700/768/1024/1100/1200/1440/2560 (EN), plus pindai 1040-1366 untuk EN. Ukur via `getComputedStyle`/`getBoundingClientRect`. Kode tidak diubah. Status pelatihan "Segera hadir" tidak dihitung.

| Kode | Kriteria | Hasil | Angka |
|---|---|---|---|
| a | Urutan section | LULUS | `top,sektor,layanan,alur,proyek,proses,pelatihan,tentang,faq,kontak` (semua lebar, ID+EN) |
| b | Menu 7 item, ID, 1024/1100/1200/1440/2560 | LULUS | Semua tinggi tautan 40/43 px (satu baris), tanpa tumpang tindih, tanpa terpotong; jarak antar-tautan min 16 px (1024-1199) dan 30-36 px (>=1200); tepi kanan tautan terakhir (712/750/865/1004) < kiri tombol bahasa |
| b | Menu 7 item, EN | **GAGAL** | "How it works" patah jadi 2 baris dan logo "RedTree IoT" patah jadi 2 baris di 1024-~1050 (tautan 64 px, logo 70 px) dan di ~1190-~1215 (1199/1200: tautan 70 px, logo 70 px). Di 1060, 1080, 1100, 1150, 1220-1366, 1440, 2560 normal (40/43 px). Gambar zoom 1024 dan 1200 memastikan header tidak rapi |
| b | Tombol WA header terlihat | LULUS | >=1024: lebar 155-177 px, di dalam `.nav-in` di semua lebar uji (ID dan EN). <1024: tombol header disembunyikan (sengaja), WA ada di menu HP dan tombol melayang |
| b | Gulir horizontal | LULUS | `scrollWidth == clientWidth` di 320, 375, 700, 768, 1024, 1100, 1200, 1440, 2560, ID dan EN (selisih viewport = scrollbar 15 px) |
| b | Menu HP | LULUS (animasi TIDAK TERUJI) | 375: `aria-expanded=true`, panel 504 px (menjangkau y 560 < 800), 7 item + "Chat WhatsApp", item "Cara kerja" ada (tinggi 58 px); klik tautan menutup menu (`aria-expanded=false`) dan URL jadi `#proses`. Transisi/gulir halus tidak berjalan di pane, jadi diverifikasi dengan `scroll-behavior:auto`: `#proses` berhenti 84 px dari atas (di bawah header 65 px) |
| c | Tanpa pil merah | LULUS | `.step-n`: latar `rgba(0,0,0,0)`, radius 0, tanpa `::before` |
| c | Ukuran angka | LULUS | 40 px (2,5rem) di 320 dan 375; 48 px (3rem) di 700 dan 768; 56 px (3,5rem) di 1024-2560 |
| c | 4 kolom, kolom 1 lebih besar | LULUS | 1024: 266/190/190/190; 1100: 288/206x3; 1200: 317/227x3; 1440 dan 2560: 341/243x3; <1024 satu kolom (maks 760) |
| c | Tombol WA langkah 1 | LULUS | `href=https://wa.me/6282272226678?text=Halo%20RedTree%20IoT%2C%20kebutuhan%20saya%3A%20`; punya `data-wa-cta` (tombol melayang `show=false` saat tombol ini terlihat, tidak menutupinya) |
| c | Kontras angka | LULUS | `#C02615` L=0,1264 di latar `#FFFFFF` (body; `#proses` transparan) = 1,05/0,1764 = **5,95:1** (>= 4,5; juga memenuhi 3:1 untuk teks besar) |
| d | `#faq` kolom tunggal, judul di atas | LULUS | `grid-template-columns: 760px` di >=1024 (320: 280 px, 375: 335 px, 768: 676 px, 700: 630 px; tidak pernah > 760); `.faq-intro` berada di atas `.faq-list` di semua lebar |
| d | Susunan berurutan tidak sama | LULUS | proyek = bento 3 kolom; proses = 4 kolom; pelatihan = 2 kolom (teks + kartu); tentang = teks + 3 kolom nilai; faq = 1 kolom 760. Tidak ada dua yang sama |
| d | Latar berurutan | **GAGAL (ringan)** | `#tentang` dan `#faq` sama-sama `#F6F7F9` dan berurutan tanpa garis: menyatu jadi blok abu-abu 1.489 px di 1024 (673 + 816), 1.786 px di 375 (968 + 818). Sebelum nomor 5, `#proses` putih berada di antara keduanya |
| e | `#alur` 375 <= 900 | LULUS | 859 px (setelah muat ulang di 375); 320: 857; 768: 708 |
| e | `#proyek` 375 <= 2.600 | LULUS | 2.505 px tertutup |
| e | `.proj-more` | LULUS | 375: terlihat `inline-flex` "Lihat 5 proyek lain", 4 proyek tampil; setelah klik `hidden=true`, `display:none`, 9 proyek; 700+: `display:none` |
| e | Teks `.estate` >= 14 px | LULUS | min 14 px di 320 dan 375 (di 700-1440 ada teks 11,5 px pada peta, di luar kriteria HP seperti putaran 2; catatan saja) |
| e | Baris in-house | LULUS | latar `#fff`, border 1 px, `inset 4px #C02615`, judul `#C02615` bobot 700 |
| e | WA melayang (375) | LULUS | 52x52; hero false, tengah true, di dekat `#proses`/tombolnya false, `#faq` false, akhir halaman false; `display` sembunyi >=1024 |
| e | Konsol | LULUS | hanya 2x "unknown error when fetching the script" (pendaftaran service worker ditolak pane); tidak ada 404/galat lain |
| f | Tiga halaman SEO tampil benar | LULUS | 375, 1024, 2560, 320: `scrollWidth==clientWidth`; `styles.css` dan `pages.css` termuat (`sheet` ada); H1 dan font benar; 6 item menu fit (tinggi 40 px, logo 35 px) di 1024 |
| f | `?v=2` vs `?v=3` | LULUS (tidak ada risiko CSS usang) | Koreksi laporan: di ketiga halaman, `?v=2` hanya ada pada `<meta og:image>` (baris 19). `styles.css`/`pages.css`/`wa-float.js`/`pages.js` dimuat TANPA `?v` (`../styles.css`). `_headers`: `*.css` dan `*.js` = `max-age=0, must-revalidate`, jadi browser selalu validasi; SW `networkFirst` untuk css/js/navigasi, cache lama dihapus di `rt-v5`. Tidak ada CSS usang |
| f | Konsistensi menu SEO | CATATAN | Menu halaman SEO tetap 6 item (tanpa "Cara kerja") |
| g | Ritme halaman | LULUS (dengan catatan d) | lihat bagian bawah |

## Daftar perbaikan (untuk web-developer)

1. Menu EN patah baris di 1024-~1050 dan ~1190-~1215. Tambah `white-space: nowrap` pada `.links a:not(.btn)` dan `.logo span`; beri `flex: none` pada `.logo` dan `.links a`. Bila setelah itu menu meluber di 1024-1059 (EN), rapatkan lagi di rentang itu (`.links { gap: 12px }`, font 0,875rem) atau naikkan titik hamburger dari 1024 ke 1060 (ikut ubah `matchMedia` di `script.js` baris ~86, aturan `.wa-float`, dan `scroll-padding-bottom`). Kriteria: di EN dan ID, 1024-1366 setiap 10 px, semua tautan tinggi 40/43 px, logo tinggi 35 px, tanpa gulir horizontal.
2. Latar `#tentang` dan `#faq` sama-sama abu-abu berurutan. Ubah `#faq` jadi putih (kartu `details` dari `#fff` ke `var(--grey)` atau beri border 1 px `var(--line)`), atau ubah `#tentang`. Kriteria: dua section berurutan tidak berlatar sama (urutan latar: abu, putih, tint, abu, putih, ...), kontras teks tetap >= 4,5:1.
3. (Opsional, konsistensi) Tambah item "Cara kerja" (`../#proses`) ke menu tiga halaman SEO agar sama dengan beranda; atau biarkan 6 item dan catat sebagai keputusan.
4. (Opsional, kebersihan) Samakan `og:image?v=2` di tiga halaman SEO ke `?v=3` bila `og-image.jpg` memang berganti; bila gambar tidak berubah, tidak perlu diubah.

## Rekomendasi `?v=` (f)

Tidak perlu menambah `?v=3` pada `styles.css` halaman SEO demi menghindari CSS usang: URL tanpa `?v` + `must-revalidate` + SW network-first sudah aman. Bila ingin seragam, pakai `../styles.css?v=3` di ketiganya sekaligus dengan `pages.css`, tetapi tidak wajib.

## Penilaian ritme (g)

Sebelum nomor 5: dua bagian berpola "langkah bernomor merah" dan `#proses` berada di y~8.100 (76%), setelah `#tentang`, sehingga urutan panjang berlatar sama. Sesudah: bento (abu) -> 4 kolom angka besar tanpa pil (putih) -> pelatihan 2 kolom (tint) -> tentang (abu) -> FAQ 1 kolom (abu). Susunan tiap bagian berbeda dan pertanyaan "lalu apa setelah chat" terjawab lebih awal, jadi tidak lagi monoton. Satu cacat tersisa: `#tentang` dan `#faq` berlatar sama (perbaikan 2).

## Butuh keputusan pemilik

1. Kalimat status pelatihan ("Segera hadir" vs "Jadwal segera diumumkan", TODO-PEMILIK 6): tidak berubah.
2. Menu halaman SEO: tambah "Cara kerja" atau tetap 6 item (perbaikan 3).
3. Uji SW dan animasi menu/gulir halus sekali di Chrome biasa (pane tidak menjalankan transisi, dan menolak pendaftaran SW).

Server uji dimatikan; ukuran viewport dikembalikan ke desktop.
