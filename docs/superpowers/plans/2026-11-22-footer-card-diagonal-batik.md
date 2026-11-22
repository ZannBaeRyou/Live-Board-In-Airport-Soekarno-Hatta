# Footer Card Diagonal Silver Batik Watermarks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menambahkan corak Batik Mega Mendung pada kartu informasi utama footer (`.footer-card`) di kedua sudut diagonal (kiri atas & kanan bawah) dengan nuansa Silver / Slate Monokrom yang netral dan elegan di seluruh 5 halaman situs.

**Architecture:** Dua elemen watermark absolut (`.footer-batik-watermark.batik-corner-tl` dan `.batik-corner-br`) disematkan di dalam `.footer-card` dengan `pointer-events: none`, radial gradient mask, dan CSS filter monokrom (`grayscale(100%)`). Konten kartu (`.row.g-4`) dinaikkan dengan `position: relative; z-index: 2` untuk menjamin keterbacaan penuh dan kelancaran interaksi klik.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+), Node.js test runner.

**Spec:** [`docs/superpowers/specs/2026-11-22-footer-card-diagonal-batik-design.md`](file:///D:/Project/Liveboard/docs/superpowers/specs/2026-11-22-footer-card-diagonal-batik-design.md)

## Global Constraints

- Corak batik wajib menggunakan asset resmi `assets/images/batik-megamendung-clean.jpg`.
- Warna watermark adalah Opsi B (Silver / Slate Monokrom) menggunakan `filter: grayscale(100%) contrast(1.15) brightness(1.02);`.
- Opasitas default `0.22`, bertransisi menjadi `0.30` saat hover pada desktop.
- Watermark wajib berstatus `pointer-events: none` dan `z-index: 1`, sedangkan konten teks/link wajib `position: relative; z-index: 2`.
- Wajib konsisten di seluruh 5 halaman: `index.html`, `terminal1.html`, `terminal2.html`, `terminal3.html`, dan `airlines.html`.
- 100% test pass rate pada seluruh suite di `tests/*.js`.

## Review Focus

1. **Link Clickability:** Memastikan link terminal (`terminal1.html`, `terminal2.html`, `terminal3.html`, `airlines.html`) dan email/phone customer service tetap responsif dan dapat diklik tanpa halangan overlay watermark.
2. **Contrast & Readability:** Teks deskripsi dan teks creator `Designed & Developed by Fauzan Ayub` di kolom kiri harus tetap terbaca jelas di atas watermark sudut kiri atas (kontras teks `#334155` dan `#64748b` tidak terganggu).
3. **Mobile Screen Responsiveness:** Di layar ponsel (`<= 768px`), ukuran watermark disesuaikan secara proporsional agar tidak menumpuk atau menutupi kolom layout yang vertikal.
4. **Clean Edge Clipping:** `overflow: hidden` pada `.footer-card` wajib memotong tepi watermark agar tidak bocor keluar dari radius kartu (20px).
5. **No Regressions:** Memastikan tidak ada kerusakan pada layout 3-kolom footer card atau baris footer bottom.

---

### Task 1: CSS Styling & Automated Test Suite

**Files:**
- Create: `tests/test_footer_diagonal_batik.js`
- Modify: `assets/css/style.css:2179-2210`

**Interfaces:**
- Produces: CSS rules `.footer-batik-watermark`, `.footer-batik-watermark.batik-corner-tl`, `.footer-batik-watermark.batik-corner-br`, `.footer-card:hover .footer-batik-watermark`.

- [ ] **Step 1: Write the failing test in `tests/test_footer_diagonal_batik.js`**

```javascript
// tests/test_footer_diagonal_batik.js
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');
const pages = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html', 'airlines.html'].map(file => ({
    name: file,
    content: fs.readFileSync(path.join(__dirname, '..', file), 'utf-8')
}));

console.log('--- RUNNING FOOTER DIAGONAL BATIK WATERMARK TESTS ---');

// 1. Verify CSS rules in style.css
if (!css.includes('.footer-batik-watermark')) {
    console.error('FAIL: style.css must define .footer-batik-watermark');
    process.exit(1);
}
if (!css.includes('.batik-corner-tl') || !css.includes('.batik-corner-br')) {
    console.error('FAIL: style.css must define .batik-corner-tl and .batik-corner-br');
    process.exit(1);
}
if (!css.includes('grayscale(100%)')) {
    console.error('FAIL: style.css must define grayscale(100%) for Option B Silver Monokrom');
    process.exit(1);
}
if (!css.includes('pointer-events: none')) {
    console.error('FAIL: .footer-batik-watermark must have pointer-events: none');
    process.exit(1);
}

// 2. Verify all 5 HTML pages have both diagonal watermarks inside .footer-card
pages.forEach(page => {
    if (!page.content.includes('footer-batik-watermark batik-corner-tl') ||
        !page.content.includes('footer-batik-watermark batik-corner-br')) {
        console.error(`FAIL: ${page.name} must include both .batik-corner-tl and .batik-corner-br inside .footer-card`);
        process.exit(1);
    }
});

console.log('PASS: Footer card diagonal silver batik watermarks verified across all pages and CSS');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_footer_diagonal_batik.js`  
Expected: FAIL with "style.css must define .footer-batik-watermark"

- [ ] **Step 3: Implement CSS rules in `assets/css/style.css`**

Tambahkan styling `.footer-batik-watermark`, `.batik-corner-tl`, `.batik-corner-br`, dan hover transition pada `assets/css/style.css` tepat setelah deklarasi `.footer-card`:

```css
.footer-batik-watermark {
    position: absolute;
    background-image: url('../images/batik-megamendung-clean.jpg');
    background-size: cover;
    pointer-events: none;
    filter: grayscale(100%) contrast(1.15) brightness(1.02);
    opacity: 0.22;
    z-index: 1;
    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
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

.footer-card:hover .footer-batik-watermark {
    opacity: 0.30;
}

@media (max-width: 768px) {
    .footer-batik-watermark.batik-corner-tl {
        width: 180px;
        height: 120px;
        opacity: 0.16;
    }
    .footer-batik-watermark.batik-corner-br {
        width: 200px;
        height: 130px;
        opacity: 0.16;
    }
}
```

- [ ] **Step 4: Run test to verify CSS assertions pass**

Run: `node tests/test_footer_diagonal_batik.js`  
Expected: FAIL with "index.html must include both .batik-corner-tl and .batik-corner-br inside .footer-card" (CSS passes, awaiting HTML implementation).

---

### Task 2: Markup Integration Across All 5 Pages & Verification

**Files:**
- Modify: `index.html` (lines ~235)
- Modify: `terminal1.html` (lines ~207)
- Modify: `terminal2.html` (lines ~208)
- Modify: `terminal3.html` (lines ~208)
- Modify: `airlines.html` (lines ~130)

**Interfaces:**
- Consumes: CSS rules from Task 1.

- [ ] **Step 1: Embed watermark divs into `index.html`**

Update `.footer-card` di `index.html`:
```html
<div class="footer-card p-4 p-md-5 mb-3 mb-md-4 position-relative overflow-hidden">
    <!-- Diagonal Corner Batik Watermarks (Silver / Slate Monokrom) -->
    <div class="footer-batik-watermark batik-corner-tl" aria-hidden="true"></div>
    <div class="footer-batik-watermark batik-corner-br" aria-hidden="true"></div>
    <div class="row g-4 position-relative" style="z-index: 2;">
```

- [ ] **Step 2: Embed watermark divs into `terminal1.html`, `terminal2.html`, `terminal3.html`, and `airlines.html`**

Terapkan markup yang sama pada `.footer-card` di:
- `terminal1.html`
- `terminal2.html`
- `terminal3.html`
- `airlines.html`

- [ ] **Step 3: Run `tests/test_footer_diagonal_batik.js` to verify PASS**

Run: `node tests/test_footer_diagonal_batik.js`  
Expected: `PASS: Footer card diagonal silver batik watermarks verified across all pages and CSS`

- [ ] **Step 4: Run all 22 test suites**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`  
Expected: All 22 test suites pass with 100% success.

- [ ] **Step 5: Visual verification via browser subagent**

Instruksikan subagent browser untuk memuat `http://127.0.0.1:5500/index.html` dan `terminal1.html`, scroll ke bagian footer, memverifikasi bahwa corak batik monokrom muncul elegan di kiri atas dan kanan bawah kartu tanpa menutupi teks, serta mengambil tangkapan layar.

- [ ] **Step 6: Commit and Push**

Commit perubahan dengan pesan:
`feat(ui): add diagonal silver batik watermarks to footer card across all pages`
dan push ke `origin/main`.
