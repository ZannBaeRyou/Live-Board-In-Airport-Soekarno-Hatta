# Design Spec: Dashboard Top Sky Batik Mega Mendung Fade-Down & Terminal Photos

## 1. Intent & Context
Pengguna ingin tampilan **Dashboard (`index.html`)** diperkaya dengan motif **Batik Mega Mendung** (nuansa Bandara Internasional Indonesia) di latar belakang secara menyeluruh yang memudar secara halus (tidak langsung tempel). Selain itu, pengguna menambahkan dua persyaratan penting:
1. Menambahkan foto asli masing-masing terminal Bandara Soekarno-Hatta ke dalam kartu terminal T1, T2, dan T3 di Dashboard.
2. Menyeragamkan latar belakang halaman **Direktori Maskapai (`airlines.html`)** dengan gaya Top Sky Batik Fade di Dashboard, dan menghapus watermark lokal yang sebelumnya berada di dalam kotak judul.

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- Memasang backdrop batik Mega Mendung di bagian atas dashboard dan airlines (`.dashboard-batik-sky-backdrop`) dengan efek vertikal gradient mask fade (`height: ~520px`, `opacity: 0.20`, memudar dari atas ke bawah).
- Menambahkan banner foto terminal asli pada masing-masing kartu terminal di `index.html`:
  - Terminal 1: `assets/images/cgk_terminal_1_header.png`
  - Terminal 2: `assets/images/cgk_terminal_2_header.png`
  - Terminal 3: `assets/images/cgk_terminal_3_header.png`
- Mengganti watermark lokal `.banner-batik-watermark` di `airlines.html` dengan backdrop `.dashboard-batik-sky-backdrop` terpadu, sehingga area judul direktori menjadi bersih dan lapang.
- Menjaga kontras teks dan kartu Bento (WCAG AAA contrast, Deep Slate `#0f172a` pada background putih/light).
- Memastikan arsitektur tetap zero-build vanilla (HTML5 + CSS3 Custom Properties).
- Memastikan semua test suite lulus 100%.

### Non-Goals
- Tidak mengubah fungsionalitas FIDS data fetching, Supabase realtime service, atau kalkulasi jam WIB/UTC.
- Tidak mengubah struktur halaman FIDS individual (`terminal1.html`, `terminal2.html`, `terminal3.html`).

### Anti-Goals
- Menempelkan gambar batik secara mentah (100% opacity tanpa mask) yang menyebabkan background berisik (*visual clutter*) dan merusak keterbacaan data penerbangan.

## 3. Approaches Considered & Trade-Offs

1. **Pendekatan 1 (Bento Hero Watermark Saja):**
   - *Kelebihan:* Sangat rapi dan terisolasi di kartu Hero.
   - *Kekurangan:* Tidak memenuhi keinginan pengguna yang menginginkan nuansa batik di latar belakang dashboard secara menyeluruh.
2. **Pendekatan 2 (Ultra-Soft Ambient Watermark 10% Menyeluruh):**
   - *Kelebihan:* Menyeluruh dari atas hingga footer.
   - *Kekurangan:* Kurang dramatis di bagian langit hero, dan bisa menimbulkan tekstur berlebih di balik footer.
3. **Pendekatan 3 (Top Sky Fade-Down & Terminal Photo Banners — DIPILIH OLEH USER):**
   - *Kelebihan:* Menghadirkan atmosfer visual "langit Mega Mendung" yang megah di area atas (navbar + hero + weather card), lalu memudar lembut ke warna dasar putih bersih di area terminal operasional. Kartu terminal T1, T2, dan T3 memiliki foto arsitektur asli CGK yang elegan dan informatif. Halaman Airlines menggunakan background langit yang serasi.

## 4. Technical Architecture & Implementation Details

### A. Dashboard (`index.html`)
1. **Backdrop Dekoratif:**
   Tambahkan tepat di bawah pembuka `<body>`:
   ```html
   <div class="dashboard-batik-sky-backdrop" aria-hidden="true"></div>
   ```
2. **Terminal Card Photo Banner (`#t1-bento-card`, `#t2-bento-card`, `#t3-bento-card`):**
   Tambahkan elemen banner foto di bagian atas setiap kartu:
   ```html
   <div class="terminal-card-photo">
       <img src="assets/images/cgk_terminal_1_header.png" alt="Terminal 1 CGK" loading="lazy">
       <div class="terminal-card-photo-overlay"></div>
       <span class="terminal-card-photo-title">Terminal 1</span>
   </div>
   ```

### B. Airlines Directory (`airlines.html`)
1. **Backdrop Dekoratif:**
   Tambahkan `.dashboard-batik-sky-backdrop` di bawah `<body>`.
2. **Bersihkan Header Banner:**
   Hapus `.banner-batik-watermark` dari dalam `<header class="modern-page-banner">` sehingga judul direktori 100% bersih dengan background langit terpadu.

### C. Styling (`assets/css/style.css`)
1. **`.dashboard-batik-sky-backdrop`**:
   ```css
   .dashboard-batik-sky-backdrop {
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 520px;
       background-image: url('../images/batik-megamendung-clean.jpg');
       background-size: cover;
       background-position: top center;
       opacity: 0.20;
       -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0) 100%);
       mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0) 100%);
       pointer-events: none;
       z-index: 0;
   }
   ```
2. **`.terminal-card-photo`**:
   ```css
   .terminal-card-photo {
       height: 110px;
       width: 100%;
       position: relative;
       overflow: hidden;
       border-radius: 10px;
       margin-bottom: 12px;
       background: #e2e8f0;
   }
   .terminal-card-photo img {
       width: 100%;
       height: 100%;
       object-fit: cover;
       transition: transform 0.3s ease;
   }
   .bento-terminal-card:hover .terminal-card-photo img {
       transform: scale(1.05);
   }
   .terminal-card-photo-overlay {
       position: absolute;
       inset: 0;
       background: linear-gradient(to top, rgba(15, 23, 42, 0.65) 0%, transparent 60%);
   }
   .terminal-card-photo-title {
       position: absolute;
       bottom: 8px;
       left: 12px;
       color: #ffffff;
       font-weight: 800;
       font-size: 0.95rem;
       text-shadow: 0 1px 3px rgba(0,0,0,0.6);
   }
   ```

### D. Testing & Verification
- Perbarui `tests/test_homepage.js` untuk memverifikasi `.dashboard-batik-sky-backdrop` dan `.terminal-card-photo` pada ketiga kartu terminal.
- Perbarui `tests/test_airlines_page.js` untuk memverifikasi `.dashboard-batik-sky-backdrop` di `airlines.html`.
- Jalankan seluruh 14 test suite untuk memastikan kelulusan 100%.
