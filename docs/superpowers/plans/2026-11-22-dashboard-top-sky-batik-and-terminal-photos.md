# Dashboard Top Sky Batik Mega Mendung & Terminal Photos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the ambient Top Sky Batik Mega Mendung fade-down backdrop across Dashboard and Airlines, and integrate authentic CGK airport terminal photo banners inside the T1, T2, and T3 Bento cards.

**Architecture:** Vanilla HTML5 and CSS3. A unified `.dashboard-batik-sky-backdrop` element is styled with a smooth top-down vertical gradient mask fade (`height: 520px; opacity: 0.20`), eliminating localized box watermarks. Bento terminal cards in `index.html` feature a rich 110px photo banner (`.terminal-card-photo`) with hover zoom and gradient text protection overlay.

**Tech Stack:** Vanilla ES6 JS, CSS3 Custom Properties, HTML5, Node.js assert test runner.

**Spec:** [`docs/superpowers/specs/2026-11-22-dashboard-top-sky-batik-fade-design.md`](../specs/2026-11-22-dashboard-top-sky-batik-fade-design.md)

## Global Constraints
- High accessibility contrast ratio (WCAG AAA >= 7:1 for normal text against light background).
- Zero-build vanilla architecture (no npm build steps required to run or deploy).
- All 14 existing test suites must pass 100%.
- Terminal photo banners must use existing authentic assets: `cgk_terminal_1_header.png`, `cgk_terminal_2_header.png`, `cgk_terminal_3_header.png`.
- The local box watermark `.banner-batik-watermark` in `airlines.html` must be removed in favor of `.dashboard-batik-sky-backdrop`.

## Review Focus
- Top sky backdrop z-index stays at 0 behind interactive cards and navigation.
- Terminal photo banner images render with `object-fit: cover` and don't overflow card borders.
- Hover transition on terminal cards scales the image subtly (`scale(1.05)`) without jank.
- Airlines page directory title and search dock retain full contrast and functionality.
- Mobile responsiveness: cards and backdrops display smoothly without horizontal scrollbars.

---

### Task 1: Top Sky Batik Backdrop for Dashboard & Airlines

**Files:**
- Modify: `index.html:28-66`
- Modify: `airlines.html:28-65`
- Modify: `assets/css/style.css:430-475`
- Test: `tests/test_homepage.js`
- Test: `tests/test_airlines_page.js`

**Interfaces:**
- Consumes: `assets/images/batik-megamendung-clean.jpg`
- Produces: `.dashboard-batik-sky-backdrop` CSS class

- [x] **Step 1: Write the failing tests**

In `tests/test_homepage.js`:
Add assertion verifying `index.html` contains `<div class="dashboard-batik-sky-backdrop" aria-hidden="true"></div>` and `assets/css/style.css` defines `.dashboard-batik-sky-backdrop` with `linear-gradient(to bottom, ...)` mask-image.

In `tests/test_airlines_page.js`:
Update assertion verifying `airlines.html` contains `<div class="dashboard-batik-sky-backdrop" aria-hidden="true"></div>` and does NOT contain `<div class="banner-batik-watermark">`.

- [x] **Step 2: Run tests to verify they fail**

Run: `node tests/test_homepage.js; node tests/test_airlines_page.js`
Expected: FAIL on missing `.dashboard-batik-sky-backdrop`

- [x] **Step 3: Implement backdrop markup and CSS**

1. In `index.html`:
   - Immediately after `<body>` opening (before `<nav>`), insert:
     ```html
     <div class="dashboard-batik-sky-backdrop" aria-hidden="true"></div>
     ```
2. In `airlines.html`:
   - Immediately after `<body>` opening (before `<nav>`), insert:
     ```html
     <div class="dashboard-batik-sky-backdrop" aria-hidden="true"></div>
     ```
   - In `<header class="modern-page-banner">`, remove `<div class="banner-batik-watermark"></div>`.
3. In `assets/css/style.css`:
   - Define `.dashboard-batik-sky-backdrop`:
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
   - Ensure `body` has `position: relative;`.

- [x] **Step 4: Run tests to verify they pass**

Run: `node tests/test_homepage.js; node tests/test_airlines_page.js`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add index.html airlines.html assets/css/style.css tests/test_homepage.js tests/test_airlines_page.js
git commit -m "feat(ui): add unified top sky batik backdrop to dashboard and airlines"
```

---

### Task 2: Terminal Photo Banners in Dashboard T1, T2, T3 Bento Cards

**Files:**
- Modify: `index.html:130-205`
- Modify: `assets/css/style.css:480-530`
- Test: `tests/test_homepage.js`

**Interfaces:**
- Consumes: `assets/images/cgk_terminal_1_header.png`, `assets/images/cgk_terminal_2_header.png`, `assets/images/cgk_terminal_3_header.png`
- Produces: `.terminal-card-photo`, `.terminal-card-photo-overlay`, `.terminal-card-photo-title`

- [x] **Step 1: Write the failing tests**

In `tests/test_homepage.js`:
Add assertions verifying:
1. `#t1-bento-card` contains `<div class="terminal-card-photo">` with `src="assets/images/cgk_terminal_1_header.png"`.
2. `#t2-bento-card` contains `<div class="terminal-card-photo">` with `src="assets/images/cgk_terminal_2_header.png"`.
3. `#t3-bento-card` contains `<div class="terminal-card-photo">` with `src="assets/images/cgk_terminal_3_header.png"`.
4. `assets/css/style.css` contains `.terminal-card-photo` rules specifying `height: 110px`, `border-radius`, and `overflow: hidden`.

- [x] **Step 2: Run test to verify it fails**

Run: `node tests/test_homepage.js`
Expected: FAIL on missing `.terminal-card-photo`

- [x] **Step 3: Implement photo banners and CSS**

1. In `index.html`:
   - Inside `#t1-bento-card`, `#t2-bento-card`, and `#t3-bento-card`, add at the top of the card:
     ```html
     <div class="terminal-card-photo">
         <img src="assets/images/cgk_terminal_1_header.png" alt="Terminal 1 CGK" loading="lazy">
         <div class="terminal-card-photo-overlay"></div>
         <span class="terminal-card-photo-title">Terminal 1</span>
     </div>
     ```
     (with appropriate image source and title for T2 and T3).
2. In `assets/css/style.css`:
   - Add `.terminal-card-photo` styles:
     ```css
     .terminal-card-photo {
         height: 110px;
         width: 100%;
         position: relative;
         overflow: hidden;
         border-radius: 10px;
         margin-bottom: 14px;
         background: #e2e8f0;
     }
     .terminal-card-photo img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         transition: transform 0.3s ease;
     }
     .bento-terminal-card:hover .terminal-card-photo img {
         transform: scale(1.05);
     }
     .terminal-card-photo-overlay {
         position: absolute;
         inset: 0;
         background: linear-gradient(to top, rgba(15, 23, 42, 0.65) 0%, transparent 60%);
         pointer-events: none;
     }
     .terminal-card-photo-title {
         position: absolute;
         bottom: 8px;
         left: 12px;
         color: #ffffff !important;
         font-weight: 800;
         font-size: 0.95rem;
         text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
         z-index: 2;
     }
     ```

- [x] **Step 4: Run test to verify it passes**

Run: `node tests/test_homepage.js`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add index.html assets/css/style.css tests/test_homepage.js
git commit -m "feat(dashboard): add authentic terminal photo banners to t1 t2 t3 bento cards"
```

---

### Task 3: Full Test Suite Verification & Integration Check

**Files:**
- Verify: `tests/*.js`

- [x] **Step 1: Run all test suites**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`
Expected: ALL 14 TEST SUITES PASS (100% green).

- [x] **Step 2: Clean up temporary session directories**

Clean up `.superpowers/brainstorm/session-3`.

- [x] **Step 3: Commit final verification**

```bash
git commit --allow-empty -m "chore: complete dashboard top sky batik backdrop and terminal photo banners"
```
