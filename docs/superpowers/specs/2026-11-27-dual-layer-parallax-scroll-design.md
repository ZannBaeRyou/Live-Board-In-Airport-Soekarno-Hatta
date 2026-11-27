# Design Spec: Dual-Layer Parallax Scroll Effect for Liveboard

## 1. Context
Liveboard Bandara Soekarno-Hatta saat ini menampilkan dashboard modern berbasis Bento Grid di `index.html` dan halaman terminal (`terminal1.html`, `terminal2.html`, `terminal3.html`). Elemen visual latar belakang terdiri dari:
- Pola kanvas global abu-abu polka dot pada `body` (`radial-gradient(circle, #94a3b8 1.8px, transparent 2.2px)`).
- Watermark corak Batik Mega Mendung hijau emerald pada kartu Hero Bandara (`.hero-batik-watermark`) serta varian warna tematik pada kartu Hero Terminal (`.terminal-hero-batik-watermark`).

Saat pengguna men-scroll halaman, semua elemen latar ini bergerak kaku/bersamaan dengan konten foreground.

## 2. Goal
Menerapkan efek interaksi scroll **Dual-Layer Parallax Z-Depth** yang halus dan responsif:
- **Layer 1 (Global Canvas - 0.10x):** Pola polka dot pada latar halaman bergeser sangat halus ke bawah saat di-scroll.
- **Layer 2 (Batik Watermark - 0.28x):** Corak Batik Mega Mendung di kartu Hero bergeser meluncur perlahan dengan GPU transform `translate3d()`.
- **Layer 3 (Foreground Content - 1.0x):** Kartu, teks, jam digital, dan jadwal penerbangan bergerak normal.
- Menjamin performa **60fps mulus**, bebas jank, ramah baterai di perangkat mobile, dan otomatis nonaktif jika pengguna mengaktifkan mode *prefers-reduced-motion*.

## 3. What Will Be Built

### A. JavaScript Engine (`initParallaxScroll` di `assets/js/main.js`)
1. **Accessibility Check:** Memeriksa `window.matchMedia('(prefers-reduced-motion: reduce)')`. Jika aktif, fungsi langsung keluar (exit early).
2. **Scroll Ticking:** Menggunakan flag `ticking` dengan `window.requestAnimationFrame()` dan `{ passive: true }` listener pada window.
3. **Layer 1 - Global Polka Dot Drift:**
   ```javascript
   const bgOffset = (scrolled * 0.10) % 24; // 24px adalah background-size pola polka dot
   document.body.style.backgroundPositionY = `${bgOffset}px`;
   ```
4. **Layer 2 - Batik Watermark Parallax:**
   Mendeteksi elemen `.hero-batik-watermark` dan `.terminal-hero-batik-watermark`:
   ```javascript
   const heroBatik = document.querySelector('.hero-batik-watermark, .terminal-hero-batik-watermark');
   if (heroBatik) {
       // Clamping maksimal 120px agar corak tetap rapi dan tidak bocor keluar kartu
       const batikY = Math.min(scrolled * 0.28, 120);
       heroBatik.style.transform = `translate3d(0, ${batikY}px, 0)`;
   }
   ```

### B. CSS Styling Optimizations (`assets/css/style.css`)
1. Menambahkan `will-change: transform;` dan `pointer-events: none;` pada `.hero-batik-watermark` dan `.terminal-hero-batik-watermark`.
2. Memastikan transisi transform instan/smooth tanpa jeda CSS transition yang berbenturan dengan `requestAnimationFrame`.
3. Menambahkan media query `@media (prefers-reduced-motion: reduce)` di CSS untuk reset transform.

## 4. Non-Goals
- Tidak mengimplementasikan Pinned Section (efek no. 2) atau Horizontal Scroll (efek no. 3) agar layout jadwal penerbangan FIDS tetap intuitif.
- Tidak menambahkan external dependency (GSAP / ScrollTrigger / library pihak ketiga).
- Tidak mengubah fungsionalitas pencarian, jam sistem, atau modal detail penerbangan.

## 5. Technical Approach & Alternatives
- **Dipilih: Vanilla JS + Hardware-Accelerated Transforms (Approach 1):** Zero dependency, ukuran 0 KB tambahan, kompatibel 100% dengan seluruh browser mobile & desktop, dan mempertahankan status passing 36 unit test suites.
- **Ditolak: GSAP ScrollTrigger (Approach 2):** Menambah beban 90KB file eksternal dari CDN dan berisiko gagal saat jaringan offline.
- **Ditolak: Pure CSS `animation-timeline` (Approach 3):** Dukungan browser belum merata di Safari dan Firefox.

## 6. Risks & Mitigation
- **Risk (Jank saat fast scrolling):** Diredam dengan `requestAnimationFrame` ticking, passive scroll listener, dan GPU composited `translate3d`.
- **Risk (Batik bocor keluar kartu):** Diberikan batasan maksimum pergeseran (*offset clamping* ~120px) dan masking gradient yang sudah ada.
- **Risk (Benturan dengan test suite):** Membuat test suite baru `tests/test_parallax_scroll.js` dan memverifikasi seluruh 36 test suite tetap 100% PASS.
