# Modern UI Renovation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely overhaul the Liveboard frontend into a high-end, "vibe coder" aviation Bento Dashboard (dark zinc palette, Bento Hub on homepage with Quick Search, and ultra-crisp FIDS tables on terminal pages).

**Architecture:** Maintain the zero-build Modern Vanilla Stack (HTML5, Modern CSS variables & Grid, Vanilla JS). Re-architect `style.css` into a modern design system, transform `index.html` into an Executive Bento Command Hub with an instant flight search bar, and renovate the flight schedule table renderer in `main.js` and `terminal1-3.html` to output high-density, modern aviation flight rows.

**Tech Stack:** HTML5, CSS3 (CSS Grid, Flexbox, CSS Variables), Vanilla JavaScript (ES6+), FontAwesome 6, Google Fonts (Plus Jakarta Sans, Roboto Mono), Supabase JS Client, Open-Meteo REST API.

**Spec:** [docs/superpowers/specs/2026-11-22-modern-ui-renovation-design.md](file:///D:/Project/Liveboard/docs/superpowers/specs/2026-11-22-modern-ui-renovation-design.md)

---

## Global Constraints

- Platform: Static hosting / cPanel (`liveboard.daeroom.my.id`). Zero npm build or transpile steps.
- Backend: Supabase `flights` and `system_config` tables remain completely unchanged.
- Mode: Dark Mode Only. Deep zinc palette (`#09090b`, `#13151b`), hairline 1px borders (`rgba(255,255,255,0.08)`). Theme toggle button is removed.
- Localization: All user-facing strings must have corresponding Indonesian (`id`) and English (`en`) keys in `assets/js/i18n.js` with `data-i18n` attributes.
- Responsiveness: Flawless layout down to mobile viewports (375px width), with no broken horizontal overflows or clipped text.

## Review Focus

1. **Empty/Offline Search State**: Searching for non-existent flight or offline database must gracefully render a "No flights found" feedback without throwing JS errors.
2. **Missing Aircraft Type Fallback**: Flights without known aircraft models must cleanly omit the sub-label without leaving empty badges or awkward gaps.
3. **Deep-Link Auto-Open (`?flight=...`)**: If a query parameter `?flight=XYZ` refers to a flight that isn't on the current terminal board, it must handle the mismatch gracefully without breaking page render.
4. **Mobile Bento & Table Layout**: Bento grid items and FIDS rows on small screens (<768px) must stack cleanly into touch-friendly cards without horizontal table scrolling.
5. **Language Switch Continuity**: Toggling language between ID and EN must dynamically re-translate all new Bento telemetry labels, search placeholder, and status badges.

---

### Task 1: Core Design System & Global Styles (`assets/css/style.css`)

**Files:**
- Modify: `D:/Project/Liveboard/assets/css/style.css`
- Test: `D:/Project/Liveboard/tests/test_styles.js`

**Interfaces:**
- Produces: CSS custom properties (`--bg-canvas`, `--surface-card`, `--border-subtle`, `--text-primary`, `--text-secondary`, `--accent-t1`, `--accent-t2`, `--accent-t3`, `--status-boarding`, etc.), utility classes (`.bento-grid`, `.bento-card`, `.segmented-control`, `.status-pill`, `.pulse-ring`).

- [ ] **Step 1: Write verification test for design system tokens and classes**

Create `tests/test_styles.js` verifying that `style.css` defines the required modern design tokens, removes legacy light-mode theme variables, and contains the required animations (`@keyframes pulse-ring`).

```javascript
// tests/test_styles.js
const fs = require('fs');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

const requiredTokens = [
  '--bg-canvas',
  '--surface-card',
  '--border-subtle',
  '--text-primary',
  '--text-secondary',
  '--accent-t1',
  '--accent-t2',
  '--accent-t3',
  'pulse-ring'
];

for (const token of requiredTokens) {
  if (!css.includes(token)) {
    console.error(`FAIL: Missing token ${token}`);
    process.exit(1);
  }
}
console.log('PASS: All modern design tokens present');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_styles.js`  
Expected: FAIL with "Missing token --bg-canvas"

- [ ] **Step 3: Implement Modern Design System in `assets/css/style.css`**

- Import `Plus Jakarta Sans:wght@400;500;600;700;800` and `Roboto Mono:wght@400;600;700`.
- Update `:root` variables:
  - `--bg-canvas: #09090b`
  - `--surface-card: #13151b`
  - `--surface-hover: #181a22`
  - `--border-subtle: rgba(255, 255, 255, 0.08)`
  - `--border-hover: rgba(255, 255, 255, 0.16)`
  - `--text-primary: #f8fafc`
  - `--text-secondary: #94a3b8`
  - `--text-muted: #64748b`
  - `--accent-t1: #38bdf8`
  - `--accent-t2: #a855f7`
  - `--accent-t3: #f59e0b`
  - Status colors: Boarding (`#22c55e`), Final Call (`#f59e0b`), Check-in (`#38bdf8`), Scheduled (`#94a3b8`), Delayed (`#f43f5e`).
- Add `@keyframes pulse-ring` and `.status-pulse-dot` with glowing ring pseudo-elements.
- Add `.bento-grid`, `.bento-card`, and `.segmented-control` modern component styles.
- Remove redundant light-mode overrides.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_styles.js`  
Expected: PASS: All modern design tokens present

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css tests/test_styles.js
git commit -m "style: implement modern dark zinc design system and bento tokens"
```

---

### Task 2: Homepage Bento Command Hub (`index.html`)

**Files:**
- Modify: `D:/Project/Liveboard/index.html`
- Modify: `D:/Project/Liveboard/assets/js/main.js`
- Test: `D:/Project/Liveboard/tests/test_homepage.js`

**Interfaces:**
- Consumes: CSS tokens from Task 1.
- Produces: DOM elements `#bento-airport-hero`, `#live-clock-wib`, `#live-clock-utc`, `#stat-runway`, `#stat-otp`, `#stat-scheduled`, `#bento-weather`, `#t1-bento-card`, `#t2-bento-card`, `#t3-bento-card`.

- [ ] **Step 1: Write test for homepage DOM structure**

Create `tests/test_homepage.js` verifying that `index.html` contains the new Bento structure, removed the theme toggle button, and has the dual clock and airport telemetry containers.

```javascript
// tests/test_homepage.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');

const checks = [
  { test: !html.includes('id="theme-toggle"'), msg: 'Theme toggle removed' },
  { test: html.includes('id="bento-airport-hero"'), msg: 'Bento hero exists' },
  { test: html.includes('id="live-clock-utc"'), msg: 'UTC clock exists' },
  { test: html.includes('id="stat-otp"'), msg: 'OTP stat container exists' },
  { test: html.includes('id="t1-bento-card"'), msg: 'T1 bento card exists' },
  { test: html.includes('id="t2-bento-card"'), msg: 'T2 bento card exists' },
  { test: html.includes('id="t3-bento-card"'), msg: 'T3 bento card exists' }
];

for (const c of checks) {
  if (!c.test) {
    console.error(`FAIL: ${c.msg}`);
    process.exit(1);
  }
}
console.log('PASS: Homepage Bento structure verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_homepage.js`  
Expected: FAIL

- [ ] **Step 3: Refactor `index.html` & `assets/js/main.js`**

- In `index.html`:
  - Update navbar: Remove `<button id="theme-toggle">`, update brand subtitle to "CGK Aviation Operations", keep language toggle and admin sync button.
  - Replace `<header class="dashboard-hero">` and `<section class="terminal-cards-section">` with `<main class="container my-4">` containing the Bento Grid:
    - Bento 1 (Hero Airport Hub, 2 cols): Title Soekarno-Hatta (CGK / WIII), WIB & UTC clocks, active runways badge, On-Time Performance metric `#stat-otp`, Total flights.
    - Bento 2 (METAR Weather, 1 col): Temperature, wind, and visibility powered by Open-Meteo.
    - Bento 3, 4, 5 (Terminal 1, 2, 3 Bento Cards, 3 cols): T1 (Sky), T2 (Purple), T3 (Amber), with departure & arrival counts and direct links to `terminal1-3.html`.
- In `assets/js/main.js`:
  - Update live clock function to update both WIB and UTC clocks every second (`#live-clock-wib` and `#live-clock-utc`).
  - Calculate dynamic OTP: `const otp = total > 0 ? Math.round(((total - delayed) / total) * 100) : 100;` and render to `#stat-otp`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_homepage.js`  
Expected: PASS: Homepage Bento structure verified

- [ ] **Step 5: Commit**

```bash
git add index.html assets/js/main.js tests/test_homepage.js
git commit -m "feat: overhaul homepage into modern Aviation Bento Command Hub"
```

---

### Task 3: Homepage Quick Flight Search Bar (`index.html` & `assets/js/main.js`)

**Files:**
- Modify: `D:/Project/Liveboard/index.html`
- Modify: `D:/Project/Liveboard/assets/js/main.js`
- Test: `D:/Project/Liveboard/tests/test_quick_search.js`

**Interfaces:**
- Consumes: Aggregated flight arrays `[...TERMINAL_1_FLIGHTS, ...TERMINAL_2_FLIGHTS, ...TERMINAL_3_FLIGHTS]`.
- Produces: `initQuickSearch()` function, `#quick-search-input`, `#quick-search-dropdown`, search result click navigation to `terminalX.html?flight=...`.

- [ ] **Step 1: Write test for quick search filtering logic**

Create `tests/test_quick_search.js` testing flight filtering logic (case-insensitive substring match on flight number, airline name, and destination).

```javascript
// tests/test_quick_search.js
const mockFlights = [
  { flight_no: 'GA-206', airline: 'Garuda Indonesia', destination: 'Yogyakarta', terminal: '3', status: 'Boarding' },
  { flight_no: 'SQ-951', airline: 'Singapore Airlines', destination: 'Singapore', terminal: '3', status: 'Final Call' },
  { flight_no: 'JT-610', airline: 'Lion Air', destination: 'Pangkal Pinang', terminal: '1', status: 'Scheduled' },
  { flight_no: 'QZ-202', airline: 'AirAsia', destination: 'Kuala Lumpur', terminal: '2', status: 'Check-in' }
];

function filterFlights(query, flights) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  return flights.filter(f => {
    const fn = (f.flight_no || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const al = (f.airline || '').toLowerCase();
    const dest = (f.destination || '').toLowerCase();
    return fn.includes(q) || al.includes(query.toLowerCase()) || dest.includes(query.toLowerCase());
  }).slice(0, 5);
}

const res1 = filterFlights('ga 206', mockFlights);
if (res1.length !== 1 || res1[0].flight_no !== 'GA-206') {
  console.error('FAIL: Query "ga 206" failed');
  process.exit(1);
}

const res2 = filterFlights('lion', mockFlights);
if (res2.length !== 1 || res2[0].airline !== 'Lion Air') {
  console.error('FAIL: Query "lion" failed');
  process.exit(1);
}

console.log('PASS: Quick search filtering unit tests passed');
```

- [ ] **Step 2: Run test to verify it passes**

Run: `node tests/test_quick_search.js`  
Expected: PASS: Quick search filtering unit tests passed

- [ ] **Step 3: Implement Quick Search Bar in `index.html` and `main.js`**

- In `index.html`: Add `#quick-search-container` with input `#quick-search-input` and dropdown container `#quick-search-dropdown` below the top Bento row.
- In `assets/js/main.js`:
  - When on the dashboard, aggregate all terminal flights into `ALL_DASHBOARD_FLIGHTS`.
  - Implement `initQuickSearch()`:
    - Listen for `input` events with 200ms debounce.
    - Match against `flight_no`, `airline`, `destination`, and `origin`.
    - Render floating card items showing: Airline logo emblem, flight number, route, terminal badge (`T1`, `T2`, `T3`), and status pill.
    - If user clicks an item, navigate to `terminal${item.terminal}.html?flight=${encodeURIComponent(item.flight_no)}`.
    - If no matches, display "Tidak ada penerbangan ditemukan" / "No flights found".
    - Close dropdown when clicking outside or pressing Escape.

- [ ] **Step 4: Verify search integration**

Run: `node -e "const html = require('fs').readFileSync('index.html', 'utf-8'); if (!html.includes('id=\"quick-search-input\"')) process.exit(1); console.log('PASS: Quick search input in index.html');"`  
Expected: PASS: Quick search input in index.html

- [ ] **Step 5: Commit**

```bash
git add index.html assets/js/main.js tests/test_quick_search.js
git commit -m "feat: implement homepage quick flight search with terminal deep-linking"
```

---

### Task 4: Terminal FIDS Board Renovation (`terminal1-3.html` & `main.js`)

**Files:**
- Modify: `D:/Project/Liveboard/terminal1.html`
- Modify: `D:/Project/Liveboard/terminal2.html`
- Modify: `D:/Project/Liveboard/terminal3.html`
- Modify: `D:/Project/Liveboard/assets/js/main.js`
- Test: `D:/Project/Liveboard/tests/test_terminal_fids.js`

**Interfaces:**
- Consumes: Flight objects from Supabase.
- Produces: Modern FIDS table row HTML, URL query parameter handler (`?flight=...`), segmented control active states.

- [ ] **Step 1: Write test for FIDS row generator and deep-link parser**

Create `tests/test_terminal_fids.js` testing that the row generator output contains the modern elements (square emblem, flight code, gate badge, status pill with pulsing dot).

```javascript
// tests/test_terminal_fids.js
const { JSDOM } = require('jsdom');

function getAircraftModel(airlineCode) {
  const map = {
    'GA': 'B737-800',
    'SQ': 'A350-900',
    'JT': 'B737-900ER',
    'QZ': 'A320-200',
    'SJ': 'B737-800',
    'ID': 'A320-200',
    'EK': 'B777-300ER',
    'QR': 'A350-1000'
  };
  return map[airlineCode] || '';
}

if (getAircraftModel('GA') !== 'B737-800') {
  console.error('FAIL: Aircraft mapping for GA failed');
  process.exit(1);
}
console.log('PASS: FIDS helper tests passed');
```

- [ ] **Step 2: Run test to verify it passes**

Run: `node tests/test_terminal_fids.js`  
Expected: PASS: FIDS helper tests passed

- [ ] **Step 3: Update `terminal1.html`, `terminal2.html`, `terminal3.html`**

- Remove theme toggle button from navbar.
- Replace old retro hero and tabs with:
  - Clean breadcrumb navigation (`Dashboard > Terminal X`).
  - Terminal title and live system clock.
  - Modern segmented controls for Keberangkatan & Kedatangan with flight counter badges.
  - Search and filter bar.
  - Auto-sync status pill (`Sync: 60s ⟳`).

- [ ] **Step 4: Update row rendering engine in `assets/js/main.js`**

- Update `renderFlightRow()` in `assets/js/main.js` to render the modern grid row:
  - Scheduled time in bold monospace font.
  - Square airline emblem with IATA code + airline name + aircraft model subtext (from client-side lookup).
  - Destination / Origin with IATA airport code.
  - Tactile gate badge (`Gate 15` or `Counter A1-A6`).
  - Status pill with pulsing dot (`status-pulse-dot`) color-coded to Boarding, Final Call, Check-in, etc.
- Add deep-link handler in `initFIDSBoard()`:
  - Check `new URLSearchParams(window.location.search).get('flight')`.
  - If present, find the row for that flight, scroll it into view with a smooth pulse highlight, and trigger `openFlightDetailModal(flight)`.

- [ ] **Step 5: Commit**

```bash
git add terminal1.html terminal2.html terminal3.html assets/js/main.js tests/test_terminal_fids.js
git commit -m "feat: renovate terminal FIDS boards and add deep-link modal auto-open"
```

---

### Task 5: Localization (i18n) & End-to-End Verification

**Files:**
- Modify: `D:/Project/Liveboard/assets/js/i18n.js`
- Test: `D:/Project/Liveboard/tests/test_e2e_verification.js`

**Interfaces:**
- Consumes: UI elements with `data-i18n` attributes.
- Produces: Complete translation coverage in both Indonesian (`id`) and English (`en`).

- [ ] **Step 1: Write end-to-end verification script**

Create `tests/test_e2e_verification.js` to parse all HTML files (`index.html`, `terminal1.html`, `terminal2.html`, `terminal3.html`) and verify that every `data-i18n` attribute has translations in `assets/js/i18n.js` for both `id` and `en`.

```javascript
// tests/test_e2e_verification.js
const fs = require('fs');

const i18nContent = fs.readFileSync('assets/js/i18n.js', 'utf-8');
const idMatch = i18nContent.match(/id:\s*{([^}]+)}/s);
const enMatch = i18nContent.match(/en:\s*{([^}]+)}/s);

const files = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html'];
let missing = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.matchAll(/data-i18n="([^"]+)"/g);
  for (const match of matches) {
    const key = match[1];
    if (!i18nContent.includes(`'${key}'`) && !i18nContent.includes(`"${key}"`)) {
      console.error(`FAIL: Missing i18n key "${key}" in ${file}`);
      missing++;
    }
  }
}

if (missing > 0) {
  process.exit(1);
}
console.log('PASS: All data-i18n keys are translated');
```

- [ ] **Step 2: Run test to check for missing keys**

Run: `node tests/test_e2e_verification.js`

- [ ] **Step 3: Update `assets/js/i18n.js` with new telemetry and Bento keys**

Add keys to `I18N_DICT.id` and `I18N_DICT.en`:
- `bento_hub_subtitle`: "Pusat Operasi Penerbangan CGK" / "CGK Aviation Operations"
- `stat_runway`: "Status Landasan" / "Runway Status"
- `stat_otp`: "Ketepatan Waktu" / "On-Time Performance"
- `quick_search_placeholder`: "Cari nomor pesawat (GA-206), maskapai, kota..." / "Search flight number (GA-206), airline, city..."
- `quick_search_no_results`: "Tidak ada penerbangan ditemukan" / "No flights found"
- `quick_search_found`: "Penerbangan Ditemukan" / "Flights Found"
- `term_domestic`: "Domestik Utama" / "Domestic Hub"
- `term_lcc`: "LCC & Regional" / "LCC & Regional"
- `term_intl`: "Internasional & Garuda" / "International & Flagship"
- `view_board`: "Buka FIDS Board →" / "Open FIDS Board →"

- [ ] **Step 4: Re-run test to verify 100% coverage**

Run: `node tests/test_e2e_verification.js`  
Expected: PASS: All data-i18n keys are translated

- [ ] **Step 5: Final Git Commit**

```bash
git add assets/js/i18n.js tests/test_e2e_verification.js
git commit -m "feat: complete i18n localization for bento grid and modern FIDS elements"
```
