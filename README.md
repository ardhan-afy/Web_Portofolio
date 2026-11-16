# Ardhan — Editorial Portfolio

Redesign berdasarkan referensi video pengguna. HTML/CSS/JS tanpa framework atau CDN untuk halaman utama.

## Jalankan
Ekstrak ZIP, buka folder `web portofolio`, jalankan `index.html` melalui VS Code Live Server atau `python -m http.server 8000` lalu buka http://localhost:8000.

## File aktif
- `index.html`: konten, navigasi, galeri, sertifikat, CV dan form kontak.
- `editorial.css`: seluruh styling halaman utama, tema gelap/terang, responsive dan reduced motion.
- `editorial.js`: navigasi, tema tersimpan di localStorage, pemilih project, carousel 2D dan validasi form.
- `docs.js`: lightbox sertifikat dan CV.
- `hero-portrait.png`: hasil pemisahan latar merah dari foto asli untuk hero. `foto.jpeg` tetap utuh.
- Folder aplikasi dan aset asli tetap tersedia. `legacy-redesign/` berisi stylesheet/script lama untuk referensi, tidak dimuat halaman baru.

## Keputusan desain
Tidak menggunakan canvas Three.js, peta 3D, musik latar dan terminal di hero. Tautan Google Maps menggantikan peta 3D; project tetap mempunyai detail fitur dan tautan aslinya. Form membuka draf melalui mailto, bukan mengirim email secara otomatis. Demo aplikasi mungkin membutuhkan internet atau izin perangkat (kamera).

## Pengujian
Layout 1440, 768, 390, 320 piksel; carousel, pemilih project, tema, menu mobile, lightbox dan validasi form diperiksa menggunakan Chromium dengan aset lokal disisipkan ke halaman karena navigasi HTTP dibatasi lingkungan pengujian. Tautan eksternal, pengiriman email dan demo aplikasi belum diuji end-to-end.

## Editorial Motion Edition
- `motion.css` / `motion.js`: marquee outline di belakang foto, animasi masuk hero, typing satu kali untuk judul, scroll reveal ringan, transisi pilihan proyek dan hover.
- Tombol Pause motion menghentikan animasi dan menyimpan preferensi; sistem `prefers-reduced-motion` diprioritaskan.
- Tidak ada dependency tambahan; desain dan aplikasi demo sebelumnya dipertahankan.


## Update foto dan tipografi
- `hero-portrait.png` memakai foto studio terbaru, dengan background transparan dan warna asli; `foto-profil-studio.png` adalah foto sumber.
- Tanda titik dekoratif dan titik akhir teks UI dihapus; tanda baca antarkalimat pada deskripsi panjang, URL, email, dan sintaks kode dipertahankan.

## Update komposisi hero dan kemampuan
- Hero desktop mengisi viewport dengan ukuran potret responsif terhadap lebar dan tinggi layar.
- What I Can Do: grid ikon SVG lokal dan dua kartu kemampuan; tidak memakai CDN atau menambah skill dari video referensi.
- SVG dibuat sebagai representasi visual teknologi; label setiap ikon tetap terlihat pada desktop dan mobile.
