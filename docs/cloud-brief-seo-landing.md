Buat tiga halaman landing SEO berbahasa Indonesia untuk website RedTree IoT di repo ini, lalu buka pull request ke `main`. Baca `CLAUDE.md` dulu dan ikuti dengan ketat (warna, huruf Plus Jakarta Sans, responsif 320–2560px, tanpa mengarang fakta, bahasa utama Indonesia).

Halaman (masing-masing folder berisi `index.html` agar URL bersih):
1. `site/pelatihan-plc-iot-medan/` – kata kunci "pelatihan PLC Medan", "kursus IoT Medan". Isi: untuk siapa (siswa SMK, mahasiswa, teknisi, engineer, tim perusahaan), daftar kursus persis seperti di beranda (Dasar IoT dengan ESP32, Dasar elektronika dan solder, Dasar pemrograman PLC, Dasar HMI dan SCADA, Jaringan industri: Modbus dan MQTT, Sensor lapangan untuk perkebunan, Pelatihan in-house) bertanda "Segera hadir"/"Sesuai permintaan", apa yang dipraktikkan, FAQ (4 butir), tombol "Daftarkan minat via WhatsApp".
2. `site/jasa-iot-otomasi-medan/` – kata kunci "jasa IoT Medan", "jasa otomasi PLC Medan", "panel PLC HMI". Isi: layanan monitoring IoT dan otomasi, alur sensor → dashboard, panel PLC/HMI dan retrofit, konsultasi, cara kerja (4 langkah), FAQ, tombol WhatsApp.
3. `site/monitoring-kebun-sawit/` – kata kunci "monitoring kebun sawit IoT", "sensor perkebunan sawit", "otomasi pabrik kelapa sawit". Isi: masalah di kebun (blok berjauhan, muka air di gambut, data hujan/cuaca, tangki dan mesin pabrik), sensor yang membantu (penakar hujan, kelembapan tanah, level air parit, suhu/kelembapan udara, stasiun cuaca otomatis, level tangki ultrasonik), apa yang tampil di dashboard, FAQ, tombol WhatsApp.

Syarat setiap halaman:
- Pakai `site/styles.css` (`../styles.css`) serta header/nav dan footer yang sama dengan `site/index.html` (link nav kembali ke bagian beranda, mis. `../#layanan`). CSS khusus halaman hanya bila perlu, di `site/pages.css`.
- `<title>` unik (≤60 karakter) dan meta description (≤160 karakter) berisi kata kunci, `<link rel="canonical">` ke `https://redtreeiot.netlify.app/<folder>/`, tag Open Graph memakai `og-image.jpg`, JSON-LD `Service` (provider = `@id` `https://redtreeiot.netlify.app/#bisnis`), `BreadcrumbList`, dan `FAQPage`.
- Satu `<h1>` berisi kata kunci utama; 600–900 kata Bahasa Indonesia yang benar-benar berguna; tanpa harga (harga bisa dinego), tanpa klien, testimoni, angka atau sertifikat yang tidak ada di repo.
- Tombol WhatsApp ke `https://wa.me/6282272226678` dengan `?text=` yang sesuai halaman.
- Gambar: hanya pakai foto yang sudah ada di `site/assets/`, alt text jujur (foto ilustrasi Wikimedia, bukan proyek RedTree).
- Halaman cukup berbahasa Indonesia (tanpa tombol EN), `<html lang="id">`.
- Tautkan ketiga halaman dari beranda: link "Pelajari lebih lanjut" di bawah bagian layanan dan pelatihan, serta di footer; tambahkan teks EN di `site/i18n-en.js` untuk kunci baru di beranda.
- Tambahkan ketiga URL ke `site/sitemap.xml` dengan `lastmod` hari ini.
- Pastikan setiap halaman tanpa scroll horizontal di 375px dan 1440px dan semua link internal valid.

Selesai = satu PR berjudul "Halaman landing SEO: pelatihan, jasa IoT, monitoring sawit" dengan ringkasan singkat berbahasa Indonesia: daftar halaman, kata kunci, dan hal yang perlu dikonfirmasi pemilik.
