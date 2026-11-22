# Design Doc: Footer Card Diagonal Batik Watermarks (Silver / Slate Monokrom)

**Date:** 2026-11-22  
**Topic:** Footer Card Batik Megamendung Watermarks  
**Status:** Pending User Approval  

---

## 1. Intent & The Why
Kartu informasi utama footer (`.footer-card`) yang memuat identitas Liveboard, daftar ketiga terminal, dan Layanan Pelanggan Bandara (Angkasa Pura II 138) saat ini berlatar putih polos. Pengguna menginginkan penambahan corak resmi **Batik Mega Mendung** di kedua ujung kartu (diagonal: **kiri atas** dan **kanan bawah**), dengan nuansa warna yang telah dipilih melalui sesi brainstorming interaktif: **Opsi B (Silver / Slate Monokrom)**.

Pilihan monokrom ini memastikan kartu informasi global tetap 100% netral dan tidak bersinggungan secara visual dengan warna khas masing-masing terminal (T1 Merah, T2 Ungu, T3 Emas), sekaligus memberikan kesan elegan dan profesional kelas dunia.

---

## 2. Goals, Non-Goals, and Anti-Goals
- **Goals**:
  - Menghadirkan dua watermark Batik Mega Mendung pada `.footer-card`:
    1. Sudut **kiri atas (top-left)**: Fading halus dari pojok kiri atas ke tengah.
    2. Sudut **kanan bawah (bottom-right)**: Fading halus dari pojok kanan bawah ke tengah.
  - Menerapkan nuansa warna **Silver / Slate Monokrom (`#64748b`)** dengan filter grayscale (`filter: grayscale(100%)`) dan opasitas lembut (~20-25%).
  - Memastikan seluruh teks dan tautan di dalam `.footer-card` tetap berstatus `z-index: 2` sehingga keterbacaan (kontras WCAG AAA) dan klik tautan tidak terganggu (`pointer-events: none` pada watermark).
  - Konsisten di seluruh 5 halaman: `index.html`, `terminal1.html`, `terminal2.html`, `terminal3.html`, dan `airlines.html`.
- **Non-Goals**:
  - Mengubah konten teks atau tata letak grid internal footer card.
  - Menambahkan watermark pada baris copyright bawah (`.footer-card-bottom`).
- **Anti-Goals**:
  - Menghalangi klik tautan terminal atau kontak customer service.
  - Membuat watermark terlalu pekat sehingga mengaburkan keterbacaan teks deskripsi atau nama creator.

---

## 3. Approaches Considered
1. **Approach A (Warm Amber Gold `#d97706`)**:
   - *Trade-off*: Sangat serasi dengan judul `Liveboard` bernuansa emas, namun agak menyerupai tema warna Terminal 3.
2. **Approach B (Sophisticated Silver / Slate Monokrom `#64748b`) — [DIPILIH PENGGUNA]**:
   - *Trade-off*: Sifatnya 100% netral terhadap ketiga terminal. Terlihat tenang, tidak mencolok, dan menyatu alami dengan tema Changi Clean Light Mode.
3. **Approach C (Heritage Emerald Green `#059669`)**:
   - *Trade-off*: Mengimbangi banner Hero bandara di puncak, tetapi menghadirkan warna hijau ketiga di halaman terminal individual.

---

## 4. Implementation Details
- **DOM Structure**:
  Di dalam `.footer-card`:
  ```html
  <div class="footer-card p-4 p-md-5 mb-3 mb-md-4 position-relative overflow-hidden">
      <!-- Diagonal Corner Batik Watermarks -->
      <div class="footer-batik-watermark batik-corner-tl" aria-hidden="true"></div>
      <div class="footer-batik-watermark batik-corner-br" aria-hidden="true"></div>
      
      <div class="row g-4 position-relative" style="z-index: 2;">
          <!-- Existing Content Columns -->
      </div>
  </div>
  ```
- **CSS Styling (`assets/css/style.css`)**:
  ```css
  .footer-batik-watermark {
      position: absolute;
      background-image: url('../images/batik-megamendung-clean.jpg');
      background-size: cover;
      pointer-events: none;
      filter: grayscale(100%) contrast(1.15) brightness(1.02);
      opacity: 0.22;
      z-index: 1;
      transition: opacity 0.4s ease;
  }
  .footer-batik-watermark.batik-corner-tl {
      top: 0;
      left: 0;
      width: 280px;
      height: 180px;
      background-position: top left;
      -webkit-mask-image: radial-gradient(circle at 0% 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
      mask-image: radial-gradient(circle at 0% 0%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
  }
  .footer-batik-watermark.batik-corner-br {
      bottom: 0;
      right: 0;
      width: 340px;
      height: 190px;
      background-position: bottom right;
      -webkit-mask-image: radial-gradient(circle at 100% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
      mask-image: radial-gradient(circle at 100% 100%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
  }
  ```
- **Hover Micro-interaction**:
  Saat kursor melayang di atas `.footer-card`, opasitas watermark meningkat lembut dari `0.22` menjadi `0.30` untuk memberikan efek kedalaman (*depth lift*).

---

## 5. Verification Plan
- Unit test otomatis `tests/test_footer_diagonal_batik.js` yang memverifikasi:
  1. Keberadaan `.footer-batik-watermark.batik-corner-tl` dan `.batik-corner-br` pada semua 5 file HTML.
  2. Rule CSS di `assets/css/style.css` (grayscale filter, radial mask, `pointer-events: none`, `z-index: 1`).
  3. Memastikan semua 21 test suites yang ada tetap lulus 100%.
- Verifikasi visual di browser live server via browser subagent.
