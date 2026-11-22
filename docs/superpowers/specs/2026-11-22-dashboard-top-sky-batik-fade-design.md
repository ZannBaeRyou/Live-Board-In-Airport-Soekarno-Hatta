# Design Spec: Dashboard Top Sky Batik Mega Mendung Fade-Down

## 1. Intent & Context
Pengguna ingin tampilan **Dashboard (`index.html`)** diperkaya dengan motif **Batik Mega Mendung** (nuansa Bandara Internasional Indonesia) di latar belakang secara menyeluruh, namun tidak "langsung tempel" secara kasar/mencolok. 
Melalui eksplorasi visual companion, pengguna telah memilih **Variasi 1: Top Sky Fade-Down (Langit Mega Mendung)**, di mana motif batik membentang di bagian atas halaman (di balik navbar dan bento grid atas) lalu memudar secara halus ke bawah menuju warna dasar putih bersih di area terminal.

## 2. Goals, Non-Goals, & Anti-Goals

### Goals
- Memasang backdrop batik Mega Mendung di bagian atas dashboard dengan efek vertikal gradient mask fade.
- Menjaga kontras teks dan kartu Bento (WCAG AAA contrast, Deep Slate `#0f172a` pada background putih/light).
- Memastikan arsitektur tetap zero-build vanilla (HTML5 + CSS3 Custom Properties).
- Memastikan semua test suite lulus 100%.

### Non-Goals
- Tidak mengubah fungsionalitas FIDS data fetching, Supabase realtime service, atau kalkulasi jam WIB/UTC.
- Tidak mengubah halaman lain yang sudah selesai (`airlines.html`, `terminal1.html`, dll.).

### Anti-Goals
- Menempelkan gambar batik secara mentah (100% opacity tanpa mask) yang menyebabkan background berisik (*visual clutter*) dan merusak keterbacaan data penerbangan.

## 3. Approaches Considered & Trade-Offs

1. **Pendekatan 1 (Bento Hero Watermark Saja):**
   - *Kelebihan:* Sangat rapi dan terisolasi di kartu Hero.
   - *Kekurangan:* Tidak memenuhi keinginan pengguna yang menginginkan nuansa batik di latar belakang dashboard secara menyeluruh.
2. **Pendekatan 2 (Ultra-Soft Ambient Watermark 10% Menyeluruh):**
   - *Kelebihan:* Menyeluruh dari atas hingga footer.
   - *Kekurangan:* Kurang dramatis di bagian langit hero, dan bisa menimbulkan tekstur berlebih di balik footer.
3. **Pendekatan 3 (Top Sky Fade-Down — DIPILIH OLEH USER):**
   - *Kelebihan:* Menghadirkan atmosfer visual "langit Mega Mendung" yang megah di area atas (navbar + hero + weather card), lalu memudar lembut ke warna dasar putih bersih di area terminal operasional. Estetika bandara Indonesia berkelas dan fungsionalitas tetap 100% terjaga.

## 4. Technical Architecture & Implementation Details

### A. Markup (`index.html`)
- Tepat di bawah pembuka `<body>` (setelah navbar atau di dalam `<main>`), tambahkan elemen dekoratif:
  ```html
  <div class="dashboard-batik-sky-backdrop" aria-hidden="true"></div>
  ```

### B. Styling (`assets/css/style.css`)
- Definisikan class `.dashboard-batik-sky-backdrop`:
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
- Pastikan container utama (`body` dan `main`) memiliki `position: relative` dan `bento-grid` berada di `z-index: 1`.

### C. Testing & Verification
- Perbarui `tests/test_homepage.js` untuk memverifikasi keberadaan `.dashboard-batik-sky-backdrop` di `index.html` dan definisinya di `style.css`.
- Jalankan seluruh 14 test suite untuk memastikan tidak ada regresi.
