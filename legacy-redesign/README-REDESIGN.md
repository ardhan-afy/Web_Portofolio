# Portofolio Ardhan — Dark Slate

Redesign dari proyek asli HTML/CSS/JavaScript. Tidak membutuhkan npm, framework baru, atau build step.

## Menjalankan

1. Ekstrak ZIP seluruhnya.
2. Buka folder `web portofolio` di VS Code.
3. Jalankan `index.html` dengan Live Server atau dari terminal folder ini:

   ```bash
   python -m http.server 8000
   ```

4. Buka http://localhost:8000. Untuk deployment statis, pertahankan struktur folder dan unggah isi folder ke hosting. Kamera pada demo Puzzle Cam memerlukan HTTPS atau localhost.

## File yang diubah

- `index.html`: struktur hero, tipografi, skill badge SVG, label menu, aksesibilitas, form kontak dan kontrol musik.
- `style.css`: token warna dan font, penghapusan CSS progress bar lama.
- `redesign.css`: lapisan tampilan akhir, dimuat sesudah stylesheet komponen lain. Edit bagian ini untuk layout dan styling baru.
- `script.js`: navbar sticky, active section, menu mobile, reveal, dan validasi form.
- `3d.js`: background ringan, perlindungan saat WebGL tidak tersedia, peta manual.
- `landscape.css` dan `landscape.js`: efek drum/rotasi otomatis tidak digunakan lagi.
- `health.js`: carousel manual, tombol keyboard dan status aksesibilitas.
- `musik.js`: musik opt-in, tombol putar/jeda di footer.

## Catatan

Foto asli, audio, CV, sertifikat, konten pendidikan dan empat project dipertahankan. CSS menurunkan saturasi foto dan menambah gradasi; latar merah tidak dihapus dari foto asli. Font Google, Three.js dan MapLibre masih memerlukan internet. Form kontak kini membuat draf `mailto:`; pengiriman otomatis memerlukan backend/layanan form. Carousel dan musik tidak autoplay agar pengunjung mengontrol gerakan dan suara. Folder `.git` tidak disertakan dalam ZIP hasil.

Pengujian: sintaks JS, referensi aset lokal, ID HTML, layout Chromium pada lebar 320/390/768/1440, menu mobile, navigasi carousel, lightbox dan validasi form kosong. Pemeriksaan Chromium memakai salinan halaman dengan CSS/JS/aset gambar lokal disisipkan karena akses navigasi browser dibatasi; CDN, WebGL, peta live, email, audio dan aplikasi demo tidak diuji secara end-to-end.
