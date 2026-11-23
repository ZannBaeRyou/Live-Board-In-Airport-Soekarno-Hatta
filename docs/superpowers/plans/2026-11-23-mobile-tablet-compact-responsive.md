# Mobile & Tablet Compact Responsive Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merampingkan tata letak tampilan Liveboard pada perangkat HP (< 768px) dan tablet (768px–991px) untuk memangkas scroll berlebih hingga 65%, menyajikan carousel snap kartu terminal di HP, merapikan bento grid tablet menjadi 2-3 kolom sejajar, dan memadatkan baris penerbangan FIDS menjadi format ultra-dense 52px.

**Architecture:** Mengoptimasi media queries responsif di `assets/css/style.css`, menambahkan struktur container snap carousel dan utilitas penyembunyian teks panjang di `index.html` dan `terminal1–3.html`, serta memperbarui markup row generator di `assets/js/main.js` agar menghasilkan format baris 2-baris compact di mobile dan 1-baris penuh di tablet/desktop tanpa merusak event klik modal HUD.

**Tech Stack:** HTML5, CSS3 (CSS Grid, Flexbox, CSS Scroll Snap), Bootstrap 5.3.2 utility classes, Vanilla JavaScript ES6, Node.js (test runner).

**Spec:** `docs/superpowers/specs/2026-11-23-mobile-tablet-compact-responsive-design.md`

## Global Constraints

- Platform: Web browser (responsive mobile 320px–480px, tablet 768px–991px, desktop ≥ 992px).
- Tidak merubah tampilan layout Desktop (≥ 992px) yang sudah ada.
- Tidak mengubah logika Supabase SDK, real-time listener, atau kalkulasi status penerbangan.
- Mempertahankan kompatibilitas dwibahasa (ID/EN) `data-i18n`.
- Target sentuh (touch target) tombol dan baris FIDS tetap memenuhi aksesibilitas sentuh minimum (tinggi baris ≥ 50px dan area sentuh selebar container).

## Review Focus

1. **Layar HP ekstra kecil (≤ 360px seperti Galaxy Z Flip / iPhone SE)**: Nama kota atau status penerbangan panjang tidak boleh meluap (overflow) atau menutupi jam/gate — wajib truncate dengan elipsis.
2. **Layar Tablet (768px - 991px)**: Tiga kartu terminal tidak boleh bertumpuk 1 kolom penuh lagi; harus tampil berdampingan dalam 3 kolom tanpa horizontal scrollbar.
3. **Modal HUD Klik Interaktif**: Penyesuaian layout baris `.fids-row-modern` di mobile tidak boleh merusak event listener `openModal(flight)` saat pengguna mengetuk baris jadwal.
4. **Scroll Snap Horizontal di HP**: Kartu terminal di HP dapat digeser secara halus ke samping dengan visual hint kartu berikutnya terlihat sebagian (`flex: 0 0 85%`).
5. **Kontrol Sticky FIDS**: Tab Keberangkatan/Kedatangan serta input pencarian tidak boleh saling bertumpukan atau menutupi baris teratas saat di-scroll di mobile.

---

### Task 1: Tablet Responsive Grid Overhaul in `assets/css/style.css`

**Files:**
- Modify: `assets/css/style.css:259-265`
- Test: `tests/test_tablet_responsive_grid.js`

**Interfaces:**
- Consumes: Existing `.bento-grid`, `.bento-hero`, `.bento-weather`, `.bento-terminal-card` classes.
- Produces: CSS media query khusus tablet (`min-width: 768px and max-width: 991.98px`) yang mengatur bento grid 2 kolom & 3 kolom.

- [ ] **Step 1: Write the failing test**

Buat file `tests/test_tablet_responsive_grid.js`:
```javascript
const fs = require('fs');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// Verifikasi bahwa @media (max-width: 991px) tidak lagi memaksakan span 12 secara membabi buta tanpa pemisahan tablet
if (css.includes('@media (max-width: 991px) {\n    .bento-hero, .bento-weather, .bento-terminal-card {\n        grid-column: span 12;')) {
    console.error('FAIL: Legacy @media (max-width: 991px) still forces span 12 on all bento elements including tablets');
    process.exit(1);
}

// Verifikasi aturan tablet 768px - 991px
const hasTabletRule = css.includes('@media (min-width: 768px) and (max-width: 991') || 
                      css.includes('@media (min-width: 768px) and (max-width: 991.98px)');

if (!hasTabletRule) {
    console.error('FAIL: Missing specific tablet responsive media query (768px to 991px)');
    process.exit(1);
}

// Verifikasi bahwa hero span 8, weather span 4, dan terminal card span 4 pada tablet
if (!css.includes('.bento-terminal-card') || !css.includes('grid-column: span 4')) {
    console.error('FAIL: Tablet grid does not define span 4 for terminal cards');
    process.exit(1);
}

console.log('PASS: Tablet responsive grid rules verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_tablet_responsive_grid.js`  
Expected: FAIL with "Legacy @media (max-width: 991px) still forces span 12..."

- [ ] **Step 3: Implement tablet grid rules in `assets/css/style.css`**

Perbarui media query di `assets/css/style.css` pada baris 259:
Pisahkan mobile (`@media (max-width: 767.98px)`) yang menggunakan `grid-column: span 12` dan tablet (`@media (min-width: 768px) and (max-width: 991.98px)`) di mana `.bento-hero` mengambil `span 8`, `.bento-weather` mengambil `span 4`, dan `.bento-terminal-card` mengambil `span 4`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_tablet_responsive_grid.js`  
Expected: PASS: Tablet responsive grid rules verified

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css tests/test_tablet_responsive_grid.js
git commit -m "style: overhaul tablet bento grid to 2 and 3 column layout"
```

---

### Task 2: Mobile Dashboard Layout & Horizontal Snap Carousel in `index.html` & `assets/css/style.css`

**Files:**
- Modify: `index.html:133-228`
- Modify: `assets/css/style.css`
- Test: `tests/test_mobile_dashboard_carousel.js`

**Interfaces:**
- Consumes: `.bento-terminal-card`, Bootstrap grid utilities.
- Produces: `.terminal-carousel-mobile` container dengan CSS Scroll Snap di mobile dan `d-none d-md-block` pada deskripsi panjang.

- [ ] **Step 1: Write the failing test**

Buat file `tests/test_mobile_dashboard_carousel.js`:
```javascript
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Cek adanya container terminal carousel di index.html
if (!html.includes('terminal-carousel-mobile')) {
    console.error('FAIL: index.html is missing terminal-carousel-mobile container');
    process.exit(1);
}

// 2. Cek deskripsi panjang terminal disembunyikan di mobile
if (!html.includes('data-i18n="term1_desc"') || !html.includes('d-none d-md-block')) {
    console.error('FAIL: Terminal description in index.html is not hidden on mobile with d-none d-md-block');
    process.exit(1);
}

// 3. Cek CSS scroll snap rules
if (!css.includes('.terminal-carousel-mobile') || !css.includes('scroll-snap-type')) {
    console.error('FAIL: style.css is missing .terminal-carousel-mobile with scroll-snap-type');
    process.exit(1);
}

// 4. Cek thumbnail foto di mobile disusutkan
if (!css.includes('@media (max-width: 767.98px)') || !css.includes('.terminal-card-photo')) {
    console.error('FAIL: Missing compact terminal-card-photo height in mobile media query');
    process.exit(1);
}

console.log('PASS: Mobile dashboard carousel and compact layout verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_mobile_dashboard_carousel.js`  
Expected: FAIL with "index.html is missing terminal-carousel-mobile container"

- [ ] **Step 3: Implement carousel container & compact styling**

1. Di `index.html`:
   - Bungkus ketiga kartu terminal (`#t1-bento-card`, `#t2-bento-card`, `#t3-bento-card`) dalam wrapper `<div class="terminal-carousel-mobile">...</div>`.
   - Tambahkan class `d-none d-md-block` pada elemen `<p ... data-i18n="term1_desc">`, `term2_desc`, dan `term3_desc`.
2. Di `assets/css/style.css`:
   - Tambahkan styling `.terminal-carousel-mobile` pada `@media (max-width: 767.98px)`:
     ```css
     @media (max-width: 767.98px) {
         .terminal-carousel-mobile {
             display: flex;
             gap: 12px;
             overflow-x: auto;
             scroll-snap-type: x mandatory;
             -webkit-overflow-scrolling: touch;
             padding: 4px 2px 14px 2px;
             grid-column: span 12;
         }
         .terminal-carousel-mobile .bento-terminal-card {
             flex: 0 0 85%;
             scroll-snap-align: start;
             margin-bottom: 0;
         }
         .terminal-card-photo {
             height: 80px;
         }
     }
     @media (min-width: 768px) {
         .terminal-carousel-mobile {
             display: contents;
         }
     }
     ```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_mobile_dashboard_carousel.js`  
Expected: PASS: Mobile dashboard carousel and compact layout verified

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/style.css tests/test_mobile_dashboard_carousel.js
git commit -m "feat: add mobile horizontal snap carousel and compact terminal cards on dashboard"
```

---

### Task 3: Terminal Pages Hero Section Slimming in `terminal1.html`, `terminal2.html`, `terminal3.html`

**Files:**
- Modify: `terminal1.html:59-90`
- Modify: `terminal2.html:59-90`
- Modify: `terminal3.html:59-90`
- Modify: `assets/css/style.css:2255-2265`
- Test: `tests/test_terminal_hero_compact.js`

**Interfaces:**
- Consumes: `.terminal-hero-section`, `.terminal-hero-card`, `data-i18n="term1_desc" / term2_desc / term3_desc`.
- Produces: Compact hero banner on `< 768px` that brings the flight schedule table above the fold.

- [ ] **Step 1: Write the failing test**

Buat file `tests/test_terminal_hero_compact.js`:
```javascript
const fs = require('fs');
const t1 = fs.readFileSync('terminal1.html', 'utf-8');
const t2 = fs.readFileSync('terminal2.html', 'utf-8');
const t3 = fs.readFileSync('terminal3.html', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

[t1, t2, t3].forEach((page, idx) => {
    const termNum = idx + 1;
    // Cek deskripsi panjang disembunyikan di mobile
    if (!page.includes(`data-i18n="term${termNum}_desc"`) || !page.includes('d-none d-md-block')) {
        console.error(`FAIL: Terminal ${termNum} hero description is not hidden on mobile with d-none d-md-block`);
        process.exit(1);
    }
});

// Cek CSS hero section mobile padding reduction
if (!css.includes('.terminal-hero-section') || !css.includes('padding-top: 70px') && !css.includes('padding-top: 75px')) {
    console.error('FAIL: Missing compact terminal-hero-section mobile top padding in style.css');
    process.exit(1);
}

console.log('PASS: Terminal pages hero compact layout verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_terminal_hero_compact.js`  
Expected: FAIL with "Terminal 1 hero description is not hidden on mobile..."

- [ ] **Step 3: Implement compact hero in terminal pages and style.css**

1. Di `terminal1.html`, `terminal2.html`, `terminal3.html`:
   - Tambahkan `d-none d-md-block` pada elemen `<p ... data-i18n="term[1-3]_desc">`.
   - Pastikan header row di dalam `.terminal-hero-card` rapi dan compact.
2. Di `assets/css/style.css`:
   - Pada `@media (max-width: 768px)`, ubah padding `.terminal-hero-section` dari `padding-top: 85px; padding-bottom: 16px;` menjadi `padding-top: 70px; padding-bottom: 8px;`.
   - Kurangi padding `.terminal-hero-card` pada mobile dari `p-4` menjadi `padding: 1rem 1.25rem !important;`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_terminal_hero_compact.js`  
Expected: PASS: Terminal pages hero compact layout verified

- [ ] **Step 5: Commit**

```bash
git add terminal1.html terminal2.html terminal3.html assets/css/style.css tests/test_terminal_hero_compact.js
git commit -m "feat: slim down terminal hero header on mobile to bring board above the fold"
```

---

### Task 4: FIDS Board Ultra-Dense Row Layout (~52px) in `assets/js/main.js` & `assets/css/style.css`

**Files:**
- Modify: `assets/js/main.js:608-659`
- Modify: `assets/css/style.css`
- Test: `tests/test_fids_compact_rows.js`

**Interfaces:**
- Consumes: `renderBoard()` data mapping, flight object fields (`flight.time`, `flight.airline`, `flight.number`, `flight.logo`, `flight.status`, `flight.destination`/`origin`, `flight.gate`).
- Produces: Structured 2-row layout in mobile and 1-row layout in desktop, reducing row height to ~52px.

- [ ] **Step 1: Write the failing test**

Buat file `tests/test_fids_compact_rows.js`:
```javascript
const fs = require('fs');
const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Cek adanya class penanda compact di main.js
if (!mainJs.includes('fids-compact-row') || !mainJs.includes('fids-mobile-top-row') || !mainJs.includes('fids-mobile-bottom-row')) {
    console.error('FAIL: main.js is missing compact 2-tier mobile row structure');
    process.exit(1);
}

// 2. Cek bahwa event listener modal klik tetap ada
if (!mainJs.includes("row.addEventListener('click', () => openModal(flight))")) {
    console.error('FAIL: openModal click handler missing on flight row');
    process.exit(1);
}

// 3. Cek CSS compact row height & padding di mobile
if (!css.includes('.fids-row-modern') || !css.includes('status-pill-compact')) {
    console.error('FAIL: style.css missing compact status pill and row padding');
    process.exit(1);
}

console.log('PASS: FIDS ultra-dense compact row layout verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_fids_compact_rows.js`  
Expected: FAIL with "main.js is missing compact 2-tier mobile row structure"

- [ ] **Step 3: Implement ultra-dense row layout in `assets/js/main.js` & `assets/css/style.css`**

1. Di `assets/js/main.js`, perbarui template string di `row.innerHTML`:
   - Bungkus baris dalam struktur responsif yang rapi:
     - Di mobile (< md):
       - `fids-mobile-top-row`: baris atas berisi Jam WIB + Logo Emblem mini + Nomor Penerbangan (bold) + Nama Maskapai (truncate), dengan Status Pill di kanan atas.
       - `fids-mobile-bottom-row`: baris bawah berisi Kota Tujuan/Asal (bold text-truncate) di kiri dan Gate/Belt Badge di kanan.
     - Di desktop/tablet (≥ md): Elemen tetap tertata horizontal dalam 6 kolom Bootstrap seperti sebelumnya.
   - Pertahankan `row.addEventListener('click', () => openModal(flight))` utuh.
2. Di `assets/css/style.css`:
   - Tambahkan styling compact di `@media (max-width: 767.98px)`:
     - `.fids-row-modern`: `padding: 8px 12px; min-height: 52px; margin-bottom: 6px;`
     - `.airline-emblem-sq`: disesuaikan menjadi `28px x 28px` di mobile.
     - `.status-pill-compact`: `padding: 3px 8px; font-size: 0.72rem; border-radius: 20px;`
     - `.gate-badge-compact`: `padding: 2px 8px; font-size: 0.72rem;`
     - Font size jam: `0.95rem`, font size kota: `0.85rem`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_fids_compact_rows.js`  
Expected: PASS: FIDS ultra-dense compact row layout verified

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js assets/css/style.css tests/test_fids_compact_rows.js
git commit -m "feat: implement ultra-dense 52px flight row layout for mobile FIDS board"
```

---

### Task 5: Full Regression Testing & Verification

**Files:**
- Test: `tests/test_full_suite.js`

**Interfaces:**
- Consumes: All tests in `tests/test_*.js`.
- Produces: 100% PASS confirmation with zero regressions across mobile, tablet, and desktop functionality.

- [ ] **Step 1: Write full suite runner script**

Buat file `tests/test_full_suite.js`:
```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testDir = __dirname;
const files = fs.readdirSync(testDir).filter(f => f.startsWith('test_') && f.endsWith('.js') && f !== 'test_full_suite.js');

console.log(`Running ${files.length} test suites...`);
let passed = 0;

for (const file of files) {
    try {
        execSync(`node "${path.join(testDir, file)}"`, { stdio: 'pipe' });
        console.log(`  ✓ ${file}`);
        passed++;
    } catch (err) {
        console.error(`  ✗ ${file} FAILED:\n${err.stdout ? err.stdout.toString() : err.message}`);
        process.exit(1);
    }
}

console.log(`\nALL ${passed} TEST SUITES PASSED! Zero regressions.`);
```

- [ ] **Step 2: Run the full test suite**

Run: `node tests/test_full_suite.js`  
Expected: PASS: ALL TEST SUITES PASSED! Zero regressions.

- [ ] **Step 3: Commit**

```bash
git add tests/test_full_suite.js
git commit -m "test: add comprehensive test suite runner verifying responsive layout changes"
```
