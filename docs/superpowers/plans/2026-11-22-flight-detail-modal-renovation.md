# Flight Detail Modal Renovation (Executive Airport FIDS HUD) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Renovate the flight details modal across all terminal pages into an Executive Airport FIDS HUD with terminal-matched colors, aircraft model info, arrival/departure adaptability, and full bilingual support (ID/EN).

**Architecture:** Replace the cramped 3D globe modal with a high-readability airport terminal display card. Use vanilla CSS tokens for terminal-specific color themes, dynamic time-until-boarding calculation, adaptive Departure vs Arrival layouts, and `i18n.js` integration for live instant language switching.

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5, CSS3, Bootstrap 5, FontAwesome 6, Node.js assert test runner.

**Spec:** `docs/superpowers/specs/2026-11-22-flight-detail-modal-redesign.md`

## Global Constraints

- Zero build step / pure vanilla frontend architecture.
- Full compatibility with existing `FLIGHT_DATABASE` and helper `getAircraftModel()`.
- Terminal color fidelity: Terminal 1 Crimson Red (`#e11d48`), Terminal 2 Royal Violet (`#7c3aed`), Terminal 3 Amber Gold (`#d97706`).
- Seamless bilingual translation for all modal elements via `i18n.js`.
- All existing 23 test suites in `tests/*.js` must continue to pass 100%.

## Review Focus

1. **Unknown/missing aircraft model:** When a flight has an unmapped airline or code, `getAircraftModel()` must fall back gracefully to standard jet (e.g. `Commercial Jetliner`) instead of displaying empty or undefined.
2. **Missing gate or counter:** If gate or counter is `-` or missing, display a clean fallback (`Gate TBA`, `Row TBA` or `Lobby Arrival`) rather than broken markup.
3. **Language switch while modal is open:** Clicking `ID` or `EN` in the navbar while the modal is open must instantly update all modal texts without closing or crashing.
4. **Countdown timer bounds:** Past flights or flights with departed status must show appropriate status text (e.g. `Departed` / `Landed`) instead of negative countdown numbers.
5. **Responsive mobile viewport:** Modal width and grid columns must adapt cleanly on mobile viewports (< 576px) without horizontal scrolling.

---

### Task 1: Multilingual Dictionary & Translation Keys

**Files:**
- Modify: `assets/js/i18n.js`
- Test: `tests/test_modal_i18n.js`

**Interfaces:**
- Consumes: `I18N_DICT` from `assets/js/i18n.js`
- Produces: `__t(key)` returning translated strings for all new modal keys

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_modal_i18n.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const i18nContent = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'i18n.js'), 'utf-8');
const dictMatch = i18nContent.match(/const I18N_DICT = ({[\s\S]*?\n};)/);
assert(dictMatch, 'I18N_DICT must be defined');

const dict = new Function(`${dictMatch[0]}; return I18N_DICT;`)();

const requiredKeys = [
    'modal_flight_status', 'modal_gate_departure', 'modal_boarding_time_left',
    'modal_baggage_belt', 'modal_landing_time', 'modal_destination_city',
    'modal_origin_city', 'modal_counter_island', 'modal_exit_gate',
    'modal_aircraft_type', 'modal_wide_body', 'modal_narrow_body'
];

requiredKeys.forEach(k => {
    assert(dict.id[k], `Missing ID translation for ${k}`);
    assert(dict.en[k], `Missing EN translation for ${k}`);
});
console.log('PASS: All modal i18n keys present and symmetrical in ID and EN');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_modal_i18n.js`  
Expected: FAIL with missing key assertion.

- [ ] **Step 3: Implement translation keys in `assets/js/i18n.js`**

Add the 12 required keys in both `id` and `en` blocks:
- `modal_flight_status`: ID `"STATUS PENERBANGAN"`, EN `"FLIGHT STATUS"`
- `modal_gate_departure`: ID `"GERBANG KEBERANGKATAN"`, EN `"DEPARTURE GATE"`
- `modal_boarding_time_left`: ID `"SISA WAKTU BOARDING"`, EN `"TIME UNTIL BOARDING"`
- `modal_baggage_belt`: ID `"SABUK PENGAMBILAN BAGASI"`, EN `"BAGGAGE CLAIM BELT"`
- `modal_landing_time`: ID `"WAKTU MENDARAT"`, EN `"LANDED TIME"`
- `modal_destination_city`: ID `"KOTA TUJUAN"`, EN `"DESTINATION"`
- `modal_origin_city`: ID `"KOTA ASAL"`, EN `"ORIGIN"`
- `modal_counter_island`: ID `"KONTER CHECK-IN"`, EN `"CHECK-IN COUNTER"`
- `modal_exit_gate`: ID `"PINTU KELUAR"`, EN `"EXIT GATE"`
- `modal_aircraft_type`: ID `"TIPE ARMADA"`, EN `"AIRCRAFT MODEL"`
- `modal_wide_body`: ID `"Badan Lebar (Wide-Body)"`, EN `"Wide-Body Jet"`
- `modal_narrow_body`: ID `"Lorong Tunggal (Narrow-Body)"`, EN `"Narrow-Body Jet"`

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_modal_i18n.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/js/i18n.js tests/test_modal_i18n.js
git commit -m "feat(i18n): add modal airport FIDS HUD translation keys"
```

---

### Task 2: CSS Theming for Executive Airport FIDS Modal

**Files:**
- Modify: `assets/css/style.css`
- Test: `tests/test_modal_styles.js`

**Interfaces:**
- Produces: CSS classes `.fids-modal-executive`, `.modal-highlight-banner`, `.modal-info-grid`, and terminal theme modifiers (`.theme-t1`, `.theme-t2`, `.theme-t3`).

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_modal_styles.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');

assert(css.includes('.fids-modal-executive'), 'style.css must define .fids-modal-executive');
assert(css.includes('.modal-highlight-banner'), 'style.css must define .modal-highlight-banner');
assert(css.includes('.modal-info-grid'), 'style.css must define .modal-info-grid');
assert(css.includes('.theme-t1'), 'style.css must define .theme-t1');
assert(css.includes('.theme-t2'), 'style.css must define .theme-t2');
assert(css.includes('.theme-t3'), 'style.css must define .theme-t3');
console.log('PASS: All executive modal CSS rules and terminal themes verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_modal_styles.js`  
Expected: FAIL

- [ ] **Step 3: Implement CSS rules in `assets/css/style.css`**

Add:
- `.fids-modal-executive`: Clean rounded modal container, max-width 600px, padding 28px, background white with subtle border.
- `.modal-highlight-banner`: Prominent banner featuring big numbers for Gate / Baggage Belt and countdown/landed time.
- Terminal theme classes:
  - `.theme-t1`: border `#fecdd3`, background `linear-gradient(135deg, #fff1f2, #ffe4e6)`, accent color `#e11d48`
  - `.theme-t2`: border `#ddd6fe`, background `linear-gradient(135deg, #f5f3ff, #ede9fe)`, accent color `#7c3aed`
  - `.theme-t3`: border `#fde68a`, background `linear-gradient(135deg, #fffbeb, #fef3c7)`, accent color `#d97706`
- `.modal-info-grid`: 3-column responsive grid for Origin/Destination, Counter/Exit, and Aircraft Model.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_modal_styles.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css tests/test_modal_styles.js
git commit -m "feat(css): add executive airport modal styles and terminal color themes"
```

---

### Task 3: Dynamic Modal Logic & Aircraft Category Engine

**Files:**
- Modify: `assets/js/main.js`
- Test: `tests/test_modal_render.js`

**Interfaces:**
- Consumes: `flight` object, `currentTerminal`, `__t()`, `formatEstimatedTime()`
- Produces: `openModal(flight)` generating the complete Executive Airport FIDS HUD

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_modal_render.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const mainJs = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'main.js'), 'utf-8');

assert(mainJs.includes('modal_gate_departure'), 'openModal must use modal_gate_departure');
assert(mainJs.includes('modal_aircraft_type'), 'openModal must use modal_aircraft_type');
assert(mainJs.includes('modal_baggage_belt'), 'openModal must use modal_baggage_belt');
assert(mainJs.includes('getAircraftCategory'), 'main.js must define getAircraftCategory()');
console.log('PASS: openModal engine verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_modal_render.js`  
Expected: FAIL

- [ ] **Step 3: Implement `getAircraftCategory()` and refactor `openModal(flight)` in `assets/js/main.js`**

1. Helper `getAircraftCategory(aircraftModel)`:
   - Wide-body: `A350`, `B777`, `B787`, `A330` -> returns `__t('modal_wide_body')`
   - Narrow-body: `B737`, `A320` -> returns `__t('modal_narrow_body')`
   - Default: `Jetliner`
2. Helper `calculateTimeRemaining(targetTimeStr)`:
   - Calculates HH:MM:SS remaining until scheduled departure time, or displays on-time/departed status.
3. Refactor `openModal(flight)`:
   - Determine terminal number (1, 2, or 3) and apply corresponding terminal theme (`theme-t1`, `theme-t2`, `theme-t3`).
   - Construct executive modal DOM:
     - Header row with terminal badge, airline logo + name, flight number, and status pill.
     - Highlight banner with Gate (Dep) or Baggage Belt (Arr) in terminal accent color.
     - 3-column info grid:
       - Col 1: Destination (Dep) or Origin (Arr) + Time.
       - Col 2: Check-in Counter (Dep) or Exit Gate (Arr).
       - Col 3: Aircraft Model + Category.
     - Modern full-width Close Button.
   - Remove legacy canvas globe radar animation calls from modal logic.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_modal_render.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js tests/test_modal_render.js
git commit -m "feat(modal): implement dynamic executive airport FIDS modal engine"
```

---

### Task 4: Template Updates Across Terminal HTML Pages

**Files:**
- Modify: `terminal1.html`
- Modify: `terminal2.html`
- Modify: `terminal3.html`
- Test: `tests/test_terminal_dom.js`

**Interfaces:**
- Consumes: Modal container `#fids-detail-modal`
- Produces: Modern container shell for dynamic injection by `openModal()`

- [ ] **Step 1: Check existing modal shells in terminal HTML files**

Ensure `#fids-detail-modal` in `terminal1.html`, `terminal2.html`, and `terminal3.html` provides a clean container `<div class="fids-modal-content fids-modal-executive" id="modal-content-container"></div>` for dynamic injection.

- [ ] **Step 2: Update terminal HTML modal markup**

Standardize modal shell across `terminal1.html`, `terminal2.html`, and `terminal3.html`.

- [ ] **Step 3: Run all existing test suites**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`  
Expected: ALL test suites PASS 100%.

- [ ] **Step 4: Commit**

```bash
git add terminal1.html terminal2.html terminal3.html
git commit -m "refactor(html): update flight detail modal container across all terminal pages"
```

---

### Task 5: End-to-End Verification & Browser Visual Inspection

**Files:**
- Test: `tests/test_full_i18n_coverage.js`

- [ ] **Step 1: Run comprehensive i18n coverage test**

Run: `node tests/test_full_i18n_coverage.js`  
Expected: PASS

- [ ] **Step 2: Browser Subagent Visual Verification**
- Open `terminal1.html` in browser, click a flight row, verify Crimson Red (`#e11d48`) theme, aircraft model, and close button.
- Open `terminal2.html` in browser, switch to Arrival tab, click a flight row, verify Royal Violet (`#7c3aed`) theme and Baggage Belt.
- Open `terminal3.html` in browser, switch to English (`EN`), click a flight row, verify Amber Gold (`#d97706`) theme and all English translations (`DEPARTURE GATE`, `AIRCRAFT MODEL`, `CLOSE DETAILS`).
- Capture screenshots for verification.

- [ ] **Step 3: Final Git push**

```bash
git push origin main
```
