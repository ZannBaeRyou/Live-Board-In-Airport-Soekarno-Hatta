# Cyber-Aviation Full UI Renovation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely renovate all remaining Liveboard components (Terminal FIDS boards, 3D radar globe modal, dark theme lock, quick search data sync, and airlines directory) into a unified, high-tech Cyber-Aviation design system.

**Architecture:** 
- Fix CSS Grid conflict on `.fids-row-modern` by converting it to a full-width block container housing Bootstrap's 12-column grid (`1 + 3 + 3 + 2 + 1 + 2 = 12`).
- Enforce permanent `data-theme="dark"` in `assets/js/i18n.js` to eradicate light-theme leakage.
- Transform the 3D globe radar canvas in `assets/js/main.js` into a dark glass cockpit tactical display with glowing cyan arcs and monospace digital HUD.
- Update `initQuickSearch()` in `main.js` to normalize `number` vs `flight_no` and support `?search=` / `?airline=` deep-linking in `initFIDSBoard()`.
- Modernize `airlines.html` into a dynamic Fleet Bento Grid powered by a comprehensive `AIRLINE_DATABASE`.

**Tech Stack:** Pure Vanilla HTML5, CSS3, Vanilla ES6 JavaScript (Zero-Build, cPanel-ready).

**Spec:** `docs/superpowers/specs/2026-11-22-cyber-aviation-full-renovation-design.md`

## Global Constraints
- Zero-build static files: Plain HTML, CSS, JS directly runnable by any browser/cPanel server without npm build step.
- Dark Mode Only: Deep zinc obsidian palette (`#09090b`, `#13151b`, `#27272a`), neon cyan accent (`#38bdf8`), emerald pulse (`#22c55e`).
- Preserve Supabase schema and existing real-time subscription mechanisms.
- Translation parity for ID and EN in `assets/js/i18n.js`.

## Review Focus
1. Full-width FIDS table: Verify `.fids-row-modern` spans 100% width and aligns perfectly with header columns on desktop.
2. Dark 3D Globe Canvas: Verify the globe canvas draws `#09090b` space and `#080f21` ocean, with zero white/cream backgrounds regardless of client OS preferences.
3. Quick Search Data Mapping: Verify searching for flight codes like `"GA 204"` or `"JT 206"` finds the flight, links to the correct terminal, and auto-opens the modal.
4. Deep-Link Search on Terminal Board: Verify `terminal1.html?search=Lion%20Air` pre-fills the search input and filters the board automatically.
5. Airlines Directory Fleet Grid: Verify all active CGK airlines render, terminal filters work, and "Lihat Penerbangan" links to the terminal board.

---

### Task 1: Fix FIDS Table Row Layout & Header Column Alignment

**Files:**
- Modify: `assets/css/style.css:264-285`
- Modify: `terminal1.html:120-130`, `terminal2.html:120-130`, `terminal3.html:120-130`
- Test: `tests/test_terminal_dom.js`, `tests/test_styles.js`

**Interfaces:**
- Consumes: `.fids-row-modern` in `assets/css/style.css`, table headers in `terminal1-3.html`.
- Produces: `display: block; width: 100%;` on `.fids-row-modern`; left status borders; aligned 6-column header (`col-md-1`, `col-md-3`, `col-md-3`, `col-md-2`, `col-md-1`, `col-md-2`).

- [ ] **Step 1: Write test assertions for full-width row and aligned header**

```javascript
// In tests/test_terminal_dom.js
assert.ok(!css.includes('grid-template-columns: 85px'), 'fids-row-modern must not have 85px grid column constraint');
assert.ok(css.includes('status-border-boarding') || css.includes('.fids-row-modern.status-boarding') || css.includes('border-left: 3px solid'), 'status left border indicator present');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_terminal_dom.js`  
Expected: FAIL

- [ ] **Step 3: Implement CSS fix and update terminal table headers**

In `assets/css/style.css`:
```css
.fids-row-modern {
    display: block;
    width: 100%;
    background: var(--surface-card);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    padding: 0.85rem 1.25rem;
    margin-bottom: 0.6rem;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    cursor: pointer;
}
.fids-row-modern.status-boarding { border-left: 3px solid #22c55e; }
.fids-row-modern.status-final-call { border-left: 3px solid #f59e0b; }
.fids-row-modern.status-delayed { border-left: 3px solid #f43f5e; }
```
In `assets/js/main.js` `renderFIDS()`:
Add status class to `row`: `row.classList.add('status-' + flight.status.toLowerCase().replace(/[^a-z0-9]/g, '-'))`.
In `terminal1.html`, `terminal2.html`, `terminal3.html`:
Align `.fids-board-header`:
```html
<div class="row align-items-center">
    <div class="col-md-1" data-i18n="col_time">WAKTU</div>
    <div class="col-md-3" data-i18n="col_flight">PENERBANGAN & MASKAPAI</div>
    <div class="col-md-3" id="fids-dest-hdr" data-i18n="col_dest">TUJUAN / ASAL</div>
    <div class="col-md-2" id="fids-gate-hdr" data-i18n="col_gate">GERBANG / KONTER</div>
    <div class="col-md-1" data-i18n="col_est">ESTIMASI</div>
    <div class="col-md-2 text-end" data-i18n="col_status">STATUS</div>
</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_terminal_dom.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css assets/js/main.js terminal1.html terminal2.html terminal3.html tests/test_terminal_dom.js
git commit -m "fix: make fids rows full width and align 6-column table headers"
```

---

### Task 2: Permanent Dark Mode Lock & Cockpit 3D Globe Radar Overhaul

**Files:**
- Modify: `assets/js/i18n.js:220-245`
- Modify: `assets/js/main.js:1070-1380` (canvas globe renderer)
- Modify: `assets/css/style.css:900-1050` (modal styles)
- Test: `tests/test_globe_modal.js`

**Interfaces:**
- Consumes: `initTheme()` in `i18n.js`, `startFlightMapAnimation()` / `drawGlobeLoop()` in `main.js`, `.fids-modal-content` in `style.css`.
- Produces: Guaranteed dark mode (`data-theme="dark"`), space canvas background (`#09090b`), deep ocean (`#080f21`), glowing cyan flight arc, cockpit HUD overlay, and 1px hairline modal border.

- [ ] **Step 1: Write test for dark theme lock and globe styling**

Create `tests/test_globe_modal.js` verifying:
- `i18n.js` sets `currentTheme = 'dark'` and does not set `'light'` on init.
- `main.js` canvas draw sets `fillStyle = '#09090b'` or `#0d172e` and not `#F5F3EC`.
- Modal styles do not have `#ffc107` / yellow border.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_globe_modal.js`  
Expected: FAIL

- [ ] **Step 3: Implement Dark Mode Lock and 3D Globe Radar Renderer Overhaul**

1. In `assets/js/i18n.js`:
```javascript
let currentTheme = 'dark';
function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
}
```
2. In `assets/js/main.js` (`drawGlobeLoop`):
- Background: `#09090b`
- Ocean sphere: `#080f21`
- Atmosphere halo: `rgba(56, 189, 248, 0.25)`
- Latitude/Longitude graticule: `rgba(56, 189, 248, 0.1)`
- Real Earth GeoJSON stroke: `rgba(56, 189, 248, 0.45)`, fill: `rgba(56, 189, 248, 0.06)`
- Great circle flight arc: Gradient `#38bdf8` to `#22c55e` with pulsing chevron.
- Telemetry HUD: Render modern cockpit glass HUD badge (`rgba(9, 9, 11, 0.85)` background, cyan text, monospace metrics for Speed, Altitude, Heading, Distance).
3. In `assets/css/style.css`:
- Remove yellow border from `.fids-modal-content`; replace with `border: 1px solid var(--border-subtle); background: rgba(19, 21, 27, 0.95); backdrop-filter: blur(20px);`.
- Modern flight progress stepper with glowing checkpoints.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_globe_modal.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/js/i18n.js assets/js/main.js assets/css/style.css tests/test_globe_modal.js
git commit -m "feat: lock permanent dark mode and overhaul 3D globe into cyber cockpit radar"
```

---

### Task 3: Quick Search Data Sync & Terminal Header Airline Quick-Filters

**Files:**
- Modify: `assets/js/main.js:250-265, 1790-1845`
- Modify: `terminal1.html:57-82`, `terminal2.html:57-82`, `terminal3.html:57-82`
- Test: `tests/test_quick_search.js`, `tests/test_terminal_search_sync.js`

**Interfaces:**
- Consumes: `initQuickSearch()` and `initFIDSBoard()` in `main.js`.
- Produces: Accurate search matching on `f.number || f.flight_no`, explicit terminal links, `?search=` / `?airline=` handling, and interactive airline emblem tags in terminal headers.

- [ ] **Step 1: Write test for quick search normalization and URL query parameter handling**

Add assertions in `tests/test_quick_search.js` & `tests/test_terminal_search_sync.js` verifying:
- Flights matched by flight number like `"GA 204"` or `"JT 206"` return correct terminal.
- Result link href is `terminal{term}.html?flight=...`.
- `initFIDSBoard()` parses `?search=` and filters the board.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_quick_search.js`  
Expected: FAIL

- [ ] **Step 3: Implement Quick Search Fix & Terminal Board Sync**

1. In `assets/js/main.js` `initQuickSearch()`:
- Aggregate with explicit `terminal`:
  ```javascript
  const allFlights = [
      ...TERMINAL_1_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '1' })),
      ...TERMINAL_2_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '2' })),
      ...TERMINAL_3_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '3' }))
  ];
  ```
- Search query matching: check `(f.number || f.flight_no || '').toLowerCase()`, `f.airline`, `f.destination`, `f.origin`.
- Links use `terminal${term}.html?flight=${encodeURIComponent(f.number || f.flight_no)}`.
2. In `initFIDSBoard()`:
- Add query parameter support:
  ```javascript
  const searchParam = urlParams.get('search') || urlParams.get('airline');
  if (searchParam && searchInput) {
      searchInput.value = searchParam;
      renderFIDS();
  }
  ```
3. In `terminal1.html`, `terminal2.html`, `terminal3.html`:
- Modernize terminal headers with terminal badge, live clocks, and clickable airline pills (e.g., `<button class="btn-airline-filter" onclick="filterByAirline('Lion Air')">...`).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_quick_search.js && node tests/test_terminal_search_sync.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js terminal1.html terminal2.html terminal3.html tests/test_quick_search.js tests/test_terminal_search_sync.js
git commit -m "feat: normalize quick search flight properties and add terminal header quick-filters"
```

---

### Task 4: Airlines Directory Modern Bento Overhaul (`airlines.html`)

**Files:**
- Modify: `airlines.html`
- Modify: `assets/js/main.js` (add `AIRLINE_DATABASE` and `initAirlinesDirectory()`)
- Modify: `assets/css/style.css` (bento fleet card styles)
- Test: `tests/test_airlines_page.js`

**Interfaces:**
- Consumes: `AIRLINE_DATABASE` in `main.js`, DOM elements `#airline-bento-grid`, `#airline-search-input`, `#terminal-filter-group` in `airlines.html`.
- Produces: Fleet Bento Grid rendering 18+ active CGK carriers with real-time terminal filters and "Lihat Penerbangan" deep-links.

- [ ] **Step 1: Write test for Airlines Directory**

Create `tests/test_airlines_page.js` verifying:
- `airlines.html` has `#airline-bento-grid`, `#airline-search-input`.
- `AIRLINE_DATABASE` has all active carriers (Garuda, Lion, Batik, AirAsia, Citilink, Emirates, Singapore Airlines, Qatar, ANA, Scoot, Super Air Jet, etc.).
- Filter by terminal renders corresponding airline subset.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_airlines_page.js`  
Expected: FAIL

- [ ] **Step 3: Implement Airlines Directory Bento Overhaul**

1. In `assets/js/main.js`:
- Define `AIRLINE_DATABASE` array with code, name, country, primary terminals, fleet aircraft models, check-in zones, and website.
- Implement `initAirlinesDirectory()` that renders `.airline-card-bento` with terminal filter buttons and instant debounced search.
- "Lihat Penerbangan" button links to `terminal${term}.html?search=${encodeURIComponent(airline.name)}`.
2. In `airlines.html`:
- Modernize header with live airline counter badge.
- Add terminal filter buttons (`Semua`, `Terminal 1`, `Terminal 2`, `Terminal 3`) and search input.
- Replace static cards container with `<div class="row g-4" id="airline-bento-grid"></div>`.
3. In `assets/css/style.css`:
- Add `.airline-card-bento` styling: dark surface `#13151b`, 1px border `var(--border-subtle)`, hover lift, square emblem, monospace code badges.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_airlines_page.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add airlines.html assets/js/main.js assets/css/style.css tests/test_airlines_page.js
git commit -m "feat: overhaul airlines directory into modern fleet bento grid with live filtering"
```

---

### Task 5: Full Regression & E2E Verification

**Files:**
- Test: all tests in `tests/*.js`

**Interfaces:**
- Consumes: Entire Liveboard application.
- Produces: 100% test pass rate across all 8+ test suites.

- [ ] **Step 1: Execute all test suites**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`  
Expected: All suites PASS with 0 failures.

- [ ] **Step 2: Commit any final polish**

```bash
git commit --allow-empty -m "test: verify entire liveboard application passes all cyber-aviation tests"
```
