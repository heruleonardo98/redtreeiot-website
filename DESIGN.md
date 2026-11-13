# DESIGN.md · RedTree IoT

Aturan gaya website ini. Baca file ini sebelum mengubah tampilan apa pun, dan ikuti untuk semua halaman.
Kalau ada hal yang tidak diatur di sini, tanya pemilik dulu, jangan menebak dengan gaya bawaan.
Nilai di bawah sama dengan token di `:root` pada `site/styles.css`. Ubah gaya = ubah file ini dan `:root`, lalu terapkan ke semua halaman.

## Suasana
Terang, bersih, teknis tapi ramah. Latar putih dan abu sangat muda, satu aksen merah, foto asli dari lapangan.
Terasa seperti perusahaan teknik lokal yang bisa diajak bicara (Medan), bukan template startup.

## Warna (punya peran)
| Peran | Nilai | Dipakai untuk |
|---|---|---|
| Aksen / tombol utama | `#E0301E` (`--red`) | Tombol WhatsApp, ikon, angka langkah, garis penekanan. Satu aksen saja. |
| Aksen gelap (hover, teks merah kecil) | `#C02615` (`--red-dark`) | Hover tombol, teks merah di atas putih (kontras AA). |
| Teks utama / judul | `#1F2328` (`--ink`) | Judul dan teks penting. |
| Teks isi | `#4A515B` (`--body`) | Paragraf. |
| Teks sekunder | `#5F6672` (`--muted`) | Keterangan, tidak dipakai di atas warna selain putih/abu. |
| Latar utama | `#FFFFFF` | Bagian bergantian dengan abu. |
| Latar bagian abu | `#F6F7F9` (`--grey`) | Pembeda bagian. |
| Latar hangat | `#FFF3F1` (`--tint`) | Bagian pelatihan, pil, ikon. |
| Garis | `#E6E8EC` (`--line`) | Pemisah halus. |
| Band ajakan | `#E0301E` penuh | Hanya satu: bagian kontak di bawah. |

## Font
- Satu keluarga: **Plus Jakarta Sans** (Google Fonts), bobot 400/500/600/700/800.
- Judul: 800, tracking -0.03em sampai -0.035em, tinggi baris 1.06–1.15.
- Isi: 400/500, tinggi baris 1.6.
- Skala (fluid): H1 `clamp(2.375rem, 1.6rem + 3.4vw, 3.875rem)`, H2 `clamp(1.875rem, 1.45rem + 1.8vw, 2.75rem)`, H3 `clamp(1.125rem, 1.05rem + .35vw, 1.5rem)`, lead `clamp(1.0625rem, 1rem + .3vw, 1.25rem)`, isi `clamp(1rem, .97rem + .12vw, 1.0625rem)`, kecil `0.9375rem`.
- Tidak ada font kedua. Tidak ada huruf kapital semua untuk label kecil.

## Jarak dan bentuk
- Lebar konten maks 1200px, gutter `clamp(20px, 5vw, 40px)`.
- Jarak antar bagian `clamp(64px, 8vw, 104px)`.
- Radius: kartu 20px, kartu kecil/field 14px, gambar besar `clamp(18px, 2vw, 28px)`, tombol dan pil 999px.
- Bayangan hanya untuk benda yang melayang atau saat hover: `0 12px 32px rgba(18,23,31,.10)`.
- Tombol: pil, tinggi min 52px (44px untuk kecil), merah `#E0301E` teks putih; tombol kedua bertinta `#FFF3F1` teks merah gelap.
- Area sentuh minimal 44px di layar sentuh.

## Susunan bagian (inti aturan "bukan buatan AI")
- **Dilarang tiga atau lebih kotak yang sama berderet tanpa hierarki.** Setiap bagian punya satu hal yang dominan (satu foto besar, satu judul raksasa, satu daftar tipografis), sisanya mengikuti.
- Dua bagian bersebelahan tidak boleh memakai susunan yang sama (kartu-kartu, kartu-kartu).
- Bukti memakai **foto dan tampilan asli** (bagian Proyek). Foto stok hanya boleh sebagai latar suasana di halaman SEO, dan selalu diberi keterangan "foto ilustrasi".
- Bagian yang dipakai pengunjung punya judul sendiri dan masuk menu.

## Gerak
- Maksimal tiga gerak halus yang disengaja: judul/hero muncul naik pelan, kartu naik sedikit saat di-hover, tombol utama menekan pelan saat diklik. Peta kebun di hero adalah satu-satunya animasi besar (simulasi, berlabel).
- Semua gerak wajib mati atau berhenti saat `prefers-reduced-motion: reduce`.
- Hanya `transform` dan `opacity`.

## Larangan
- Tanpa gradasi (apalagi ungu atau biru), tanpa efek kaca, tanpa glow, tanpa blob dekoratif.
- Tanpa ikon 3D atau ilustrasi stok untuk membuktikan layanan.
- Tanpa emoji di halaman web.
- Tanpa angka statistik, klien, testimoni, sertifikasi perusahaan, harga, atau alamat yang tidak ada di repo (lihat aturan konten di `CLAUDE.md`).
- Tanpa menyebut proyek pendiri sebagai proyek klien RedTree IoT.

## Aturan gambar
- Foto proyek pendiri: dipotong dari alamat IP, URL, bilah browser, dan data pribadi sebelum dipasang.
- Setiap gambar punya `NAMA.jpg` + `NAMA-480.webp` + `NAMA-960.webp`, dipakai lewat `srcset` dan `sizes`, dengan `width`, `height`, dan alt yang jujur.
- Foto Wikimedia (halaman SEO) dikreditkan di footer dan `brand/photo-credits.json`.

## Cek sebelum selesai
- Tidak ada scroll horizontal dari 320px sampai 2560px, dalam bahasa Indonesia dan Inggris.
- Setiap teks baru punya kunci `data-i18n` dan entri Inggris di `site/i18n-en.js`.
- Kontras AA, fokus terlihat, gerak patuh `prefers-reduced-motion`.
