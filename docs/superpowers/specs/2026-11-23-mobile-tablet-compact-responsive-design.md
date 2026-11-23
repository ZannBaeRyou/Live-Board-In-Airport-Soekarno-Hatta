# Desain Tampilan Hemat Ruang (Ultra-Compact) Layar HP & Tablet — Liveboard

**Tanggal:** 23 November 2026  
**Status:** Menunggu Persetujuan  
**File Terkait:** `index.html`, `terminal1.html`, `terminal2.html`, `terminal3.html`, `assets/css/style.css`, `assets/js/main.js`

---

## 1. Latar Belakang & Intent (The "Why")

Pengguna merasa bahwa tata letak Liveboard saat ini memakan terlalu banyak ruang vertikal (*kemakan space banget*) ketika dibuka pada perangkat berlayar sentuh kecil (ponsel/HP) dan tablet. 

### Kondisi Saat Ini:
1. **Dashboard Utama (`index.html`)**:
   - Aturan CSS `@media (max-width: 991px)` memaksa seluruh kartu Bento Grid (`.bento-hero`, `.bento-weather`, `.bento-terminal-card`) mengambil lebar penuh `grid-column: span 12`.
   - Di ponsel, pengguna harus menggulir (scroll) lebih dari 1.400–1.800px ke bawah hanya untuk mencapai tautan Terminal 3.
   - Di tablet (lebar 768px–991px), kartu-kartu ini melar sangat lebar dan panjang ke bawah secara tidak proporsional, padahal lebar tablet mampu menampung 2 hingga 3 kolom.
2. **Papan Jadwal FIDS (`terminal1–3.html`)**:
   - Hero banner terminal memakan hampir 50% tinggi layar smartphone (*viewport height*) sebelum jadwal penerbangan pertama terlihat.
   - Setiap baris jadwal penerbangan (`.fids-row-modern`) memakan tinggi vertikal ~95px karena elemennya terpecah dalam 3 susunan baris terpisah di mobile. Pengguna hanya dapat melihat 3–4 penerbangan per layar.

### Tujuan Utama:
Merampingkan tata letak agar hemat ruang (*ultra-compact*), memangkas kebutuhan scroll hingga 60–65%, serta menggandakan kepadatan informasi yang langsung terlihat di layar awal (*above-the-fold*) tanpa mengorbankan keterbacaan maupun kemudahan sentuhan (*touch target*).

---

## 2. Tujuan, Batasan & Anti-Tujuan

### Goals:
- **Dashboard HP (< 768px)**:
  - Menyatukan informasi penting bandara (jam live WIB/UTC, status landasan, OTP) dan cuaca METAR ke dalam header status yang ringkas.
  - Mengubah kartu 3 terminal menjadi format kartu geser samping (*horizontal swipe snap carousel*) atau compact tiles ringkas, menyembunyikan paragraf narasi panjang yang repetitif.
  - Memastikan seluruh konten utama beranda terlihat dalam 1 hingga 1.5 viewport layar HP.
- **Dashboard Tablet (768px – 991px)**:
  - Menggantikan tumpukan 1 kolom raksasa dengan Bento Grid proporsional: Hero & METAR Weather berdampingan (Grid 2 kolom), dan Terminal 1, 2, 3 berdampingan (Grid 3 kolom).
- **FIDS Flight Board HP (< 768px)**:
  - Menyusutkan hero terminal di mobile (sembunyikan paragraf deskripsi panjang, tampilkan judul terminal, badge, dan jam live dalam satu baris ringkas).
  - Memadatkan baris penerbangan (`.fids-row-modern`) dari ~95px menjadi **~52px per baris** dengan struktur 2 baris terpadu:
    - *Baris atas:* Jam WIB + Logo/Maskapai & No. Penerbangan + Status Pill.
    - *Baris bawah:* Kota Asal/Tujuan + Gate/Baggage Badge.
  - Menampilkan 7–8 baris penerbangan sekaligus di layar HP tanpa scroll.

### Non-Goals:
- Tidak mengubah logika data backend Supabase, mekanisme sinkronisasi real-time WebSocket/polling, maupun kalkulasi status penerbangan.
- Tidak mengubah tampilan layar Desktop (> 991px); grid bento dan FIDS desktop tetap berjalan persis seperti sekarang.
- Tidak menghapus modal HUD detail penerbangan; modal tetap terbuka saat baris jadwal di-tap.

### Anti-Goals:
- Tidak mengecilkan ukuran teks atau target sentuh di bawah standar aksesibilitas (ukuran teks esensial tetap minimum 12–14px, area sentuh baris tetap mencakup seluruh lebar baris dengan tinggi sentuh nyaman ≥ 44–52px).
- Tidak memotong nomor penerbangan atau status penting hingga tidak dapat diidentifikasi penumpang.

---

## 3. Pendekatan yang Dipertimbangkan (Approaches)

Tiga pendekatan telah disajikan dan dikomparasikan secara visual melalui Visual Companion browser:

1. **Pendekatan A: Native Airline App Style (Ultra-Compact + Horizontal Snap Carousel) [TERPILIH]**
   - *Konsep:* Memadatkan hero & cuaca menjadi compact status bar, mengubah terminal di HP menjadi horizontal snap carousel, merapikan grid tablet menjadi 2-3 kolom sejajar, dan memadatkan baris FIDS menjadi 52px.
   - *Kelebihan:* Menghemat 65% ruang vertikal, melipatgandakan data yang terlihat langsung, dan memberikan pengalaman ala aplikasi mobile maskapai modern.
   - *Trade-off:* Paragraf deskripsi pengantar terminal disembunyikan di layar HP (tetap tampil di desktop/tablet jika dibutuhkan).
   - *Keputusan:* **Dipilih oleh pengguna.**

2. **Pendekatan B: Segmented Tabbed View (Zero-Scroll Hub)**
   - *Konsep:* Dashboard beranda diubah menjadi tampilan tab switcher `[ T1 | T2 | T3 ]`. Memilih tab langsung menampilkan ringkasan penerbangan terminal tersebut di tempat.
   - *Kelemahan:* Pengguna tidak bisa melihat sekilas perbandingan antar terminal sekaligus, memerlukan klik tab tambahan.

3. **Pendekatan C: Collapsible Accordion Hub**
   - *Konsep:* Masing-masing terminal berupa panel accordion yang bisa dibuka-tutup.
   - *Kelemahan:* Masih memakan ruang saat beberapa panel dibuka; interaksi terasa seperti form administratif bukan layar papan informasi bandara.

---

## 4. Rincian Desain & Spesifikasi Teknis

### A. Breakpoint Standar
- **Mobile Phones**: `< 768px` (dengan optimasi khusus untuk layar kecil `< 576px` dan `< 400px`).
- **Tablets**: `768px – 991px` (iPad Mini, iPad Air, Galaxy Tab portrait/landscape).
- **Desktop**: `≥ 992px` (tetap mempertahankan layout bento 12 kolom yang sudah ada).

---

### B. Dashboard Utama (`index.html`)

#### 1. Pada Layar Mobile (< 768px)
- **Top Airport Bar & Clock**:
  - Judul bandara dan jam WIB/UTC ditampilkan dalam satu kartu ringkas dengan padding `p-3` (sebelumnya `p-4`).
  - Baris statistik (Runway, Ketepatan Waktu, Total Penerbangan) ditampilkan dalam baris 3 kolom horizontal ringkas dengan ukuran teks 11–12px.
  - Kotak *Quick Search* dibuat lebih ramping dengan tinggi sentuh ~42px.
- **METAR Cuaca**:
  - Pada layar `< 768px`, kartu METAR weather disajikan ringkas dan proporsional tanpa ruang kosong berlebih.
- **Terminal Carousel / Compact Tiles**:
  - Di mobile, kartu Terminal 1, 2, dan 3 dibungkus dalam container horizontal snap scroll:
    ```css
    .terminal-carousel-mobile {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 8px;
    }
    .terminal-carousel-mobile .bento-terminal-card {
      flex: 0 0 85%; /* Menampilkan kartu aktif dan preview kartu berikutnya */
      scroll-snap-align: start;
    }
    ```
  - Paragraf deskripsi panjang di kartu terminal disembunyikan di HP menggunakan utility class Bootstrap `d-none d-md-block`.
  - Foto header terminal di HP disesuaikan tingginya dari 110px menjadi 80px agar lebih hemat ruang.
  - Bar informasi jumlah keberangkatan/kedatangan dan tombol "Buka FIDS Board →" tetap tampil jelas di bagian bawah kartu.

#### 2. Pada Layar Tablet (768px – 991px)
- Mengganti aturan `@media (max-width: 991px)` yang memaksakan `span 12`:
  - `.bento-hero`: `grid-column: span 8;`
  - `.bento-weather`: `grid-column: span 4;` (berdampingan rapi dengan Hero)
  - `.bento-terminal-card`: `grid-column: span 4;` (3 kartu terminal berjajar 3 kolom berdampingan secara proporsional)

---

### C. Halaman Jadwal Penerbangan (`terminal1.html`, `terminal2.html`, `terminal3.html`)

#### 1. Header Terminal Hero (< 768px)
- Padding vertikal section diperkecil: `padding: 12px 0; margin-top: 75px;`.
- Paragraf deskripsi panjang disembunyikan di mobile (`d-none d-md-block`).
- Judul terminal (misal "Terminal 3 CGK"), badge batik, dan jam sistem WIB disatukan dalam satu baris fleksibel yang ringkas.

#### 2. Kontrol Sticky (Tabs, Search, Filter)
- Tab *Keberangkatan* dan *Kedatangan* dibuat ramping dengan ikon dan teks yang pas.
- Kolom pencarian dan dropdown filter status disusun rapi dengan margin minimal.

#### 3. Baris Jadwal FIDS Ultra-Dense (`.fids-row-modern`)
- Tinggi baris dikurangi dari ~95px menjadi **~52px**.
- Padding baris disesuaikan: `padding: 8px 12px;`.
- Struktur Grid 2 Baris di Mobile:
  ```html
  <div class="row align-items-center w-100 g-0 m-0">
    <!-- Baris 1: Waktu + Maskapai/Flight No + Status Pill -->
    <div class="col-8 col-md-4 d-flex align-items-center gap-2">
      <span class="fids-compact-time fw-bold font-digital text-white fs-6">17:15</span>
      <div class="airline-emblem-sq-compact">...logo...</div>
      <span class="fw-bold font-digital text-white text-truncate">GA-206</span>
      <span class="text-secondary small d-none d-sm-inline">Garuda</span>
    </div>
    <div class="col-4 col-md-2 text-end">
      <span class="status-pill-modern status-pill-compact ...">Boarding</span>
    </div>
    
    <!-- Baris 2: Rute Tujuan/Asal + Gate/Konter Badge -->
    <div class="col-7 col-md-4 mt-1 mt-md-0">
      <span class="text-white small fw-semibold text-truncate d-block">Yogyakarta (YIA)</span>
    </div>
    <div class="col-5 col-md-2 text-end mt-1 mt-md-0">
      <span class="gate-badge-modern gate-badge-compact">Gate 14</span>
    </div>
  </div>
  ```
- Di desktop/tablet lebar (≥ 768px), baris otomatis kembali ke format 1 baris kolom penuh seperti sedia kala.

---

## 5. Yang Diserahkan ke Builder (Implementation Detail)

1. Menentukan nilai padding dan font-size yang presisi di `assets/css/style.css` agar konsisten dengan tema `data-theme="light"` maupun elemen teks kontras tinggi.
2. Penyesuaian class di template HTML `index.html` dan `terminal1.html`, `terminal2.html`, `terminal3.html` untuk mengintegrasikan container carousel snap mobile.
3. Memastikan fungsi `renderBoard()` di `assets/js/main.js` menghasilkan markup baris yang mendukung struktur compact 2 baris di mobile dan 1 baris di desktop tanpa mengganggu event listener modal klik.
4. Pengujian visual pada simulasi viewport 375px (iPhone SE), 390px (iPhone 14/15), 768px (iPad Mini/Portrait), dan 1024px (iPad Pro/Desktop).
