# Homepage Integrated Search & Balanced Bento Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-architect the homepage Bento Grid layout by nesting the Quick Search bar directly inside the Hero Airport Hub card and aligning Terminal 1, 2, and 3 into a balanced 3-column row (4+4+4 = 12 columns).

**Architecture:** Embed `#quick-search-container` into `#bento-airport-hero` underneath the live telemetry row (`row g-3`). Eliminate `#quick-search-section` as a standalone child in `.bento-grid`, giving `.bento-grid` exactly 5 cards across 2 symmetric rows. Add `overflow: visible` to `#bento-airport-hero` and update `.quick-search-wrapper` styles so the autocomplete dropdown displays without clipping.

**Tech Stack:** Vanilla HTML5, CSS3 (CSS Grid + Custom Properties), Vanilla ES6 JavaScript, Node.js (test runner).

**Spec:** `docs/superpowers/specs/2026-11-22-homepage-integrated-search-layout-design.md`

## Global Constraints
- Pure Vanilla Zero-Build: No Node.js build step or bundler; static HTML/CSS/JS files directly deployable to cPanel.
- Preserve DOM IDs: `#quick-search-input`, `#quick-search-dropdown`, `#bento-airport-hero`, `#bento-weather-card`, `#t1-bento-card`, `#t2-bento-card`, `#t3-bento-card` must remain unchanged so existing JS listeners and i18n remain functional.
- Dark Mode Only: Deep zinc obsidian palette (`#09090b`, `#13151b`, `#27272a`).

## Review Focus
1. Search input inside Hero: Ensure the search input box is a descendant of `#bento-airport-hero` and responsive.
2. Autocomplete dropdown visibility: Ensure `.quick-search-dropdown` is not clipped by `.bento-card`'s `overflow: hidden`.
3. Bento Grid children count: Ensure `.bento-grid` has exactly 5 direct `.bento-card` children (no orphan columns).
4. Terminal cards symmetry: Ensure T1, T2, T3 are direct siblings in row 2 with `grid-column: span 4` on desktop viewports.
5. Search functionality: Ensure debounce, filter, and `?flight=` deep-linking to terminal boards remain 100% operational.

---

### Task 1: DOM Hierarchy & Bento Grid Restructure (`index.html`)

**Files:**
- Modify: `index.html:65-155`
- Test: `tests/test_homepage.js`

**Interfaces:**
- Consumes: Existing `#bento-airport-hero` and `#quick-search-container` elements.
- Produces: Nested `#quick-search-container` within `#bento-airport-hero`; `.bento-grid` with exactly 5 direct card children.

- [ ] **Step 1: Update `tests/test_homepage.js` to assert nested search and 5 bento card children**

```javascript
// Add assertions in tests/test_homepage.js
assert.ok(
    html.includes('id="bento-airport-hero"') &&
    html.indexOf('id="quick-search-input"') > html.indexOf('id="bento-airport-hero"') &&
    html.indexOf('id="quick-search-input"') < html.indexOf('id="bento-weather-card"'),
    'quick-search-input must be inside bento-airport-hero'
);
assert.ok(!html.includes('id="quick-search-section"'), 'quick-search-section wrapper must be removed');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_homepage.js`  
Expected: FAIL with "quick-search-input must be inside bento-airport-hero" or "quick-search-section wrapper must be removed"

- [ ] **Step 3: Modify `index.html` to nest search inside `#bento-airport-hero`**

Move `#quick-search-container` into the bottom of `#bento-airport-hero` below `.row.g-3`. Remove `<div class="col-12" id="quick-search-section">`. Add `overflow-visible` class to `#bento-airport-hero`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_homepage.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html tests/test_homepage.js
git commit -m "refactor: nest quick search inside bento airport hero card"
```

---

### Task 2: CSS Polish & Dropdown Unclipping (`assets/css/style.css`)

**Files:**
- Modify: `assets/css/style.css:135-185`
- Test: `tests/test_styles.js`, `tests/test_search_dom.js`

**Interfaces:**
- Consumes: `#bento-airport-hero`, `.quick-search-wrapper`, `.quick-search-input-box`, `.quick-search-dropdown`.
- Produces: CSS rules ensuring `.quick-search-wrapper` has `max-width: 100%`, `margin: 1.25rem 0 0 0`, `#bento-airport-hero` has `overflow: visible`, and `.quick-search-dropdown` has `z-index: 100`.

- [ ] **Step 1: Write assertions in `tests/test_styles.js` and `tests/test_search_dom.js`**

Verify that `#bento-airport-hero` or `.overflow-visible` allows unclipped dropdowns, and `.quick-search-wrapper` has `max-width: 100%`.

- [ ] **Step 2: Run test to verify failure**

Run: `node tests/test_styles.js`  
Expected: FAIL

- [ ] **Step 3: Implement CSS styling updates in `assets/css/style.css`**

Add `#bento-airport-hero.overflow-visible { overflow: visible !important; }`. Update `.quick-search-wrapper` max-width to `100%`, margin to `1.25rem 0 0 0`. Give `.quick-search-input-box` background `rgba(9, 9, 11, 0.75)` and `border: 1px solid var(--border-subtle)`. Set `.quick-search-dropdown` `z-index: 100`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_styles.js && node tests/test_search_dom.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css tests/test_styles.js tests/test_search_dom.js
git commit -m "style: adjust quick search styles inside hero card and prevent dropdown clipping"
```

---

### Task 3: Full E2E & Regression Suite Verification

**Files:**
- Test: `tests/test_*.js` (all 7 suites)

**Interfaces:**
- Consumes: Entire codebase.
- Produces: Green verification run across all components.

- [ ] **Step 1: Run full test suite**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`  
Expected: All 7 suites PASS (0 errors).

- [ ] **Step 2: Commit any final regression adjustments**

```bash
git commit --allow-empty -m "test: verify integrated search and balanced bento layout passes all tests"
```
