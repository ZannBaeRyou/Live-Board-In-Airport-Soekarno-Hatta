# Airlines Directory Batik Mega Mendung Banner & Segmented Control Dock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize `airlines.html` with an authentic Indonesian Batik Mega Mendung watermark header, high-contrast Deep Slate typography, and an executive 4-terminal Segmented Control Dock.

**Architecture:** Vanilla HTML5 & CSS3. The user's cropped Mega Mendung image (`assets/images/batik-megamendung-clean.jpg`) is styled as a right-aligned gradient-masked watermark in `.modern-page-banner`. The 4 terminal filter buttons are grouped into a `.segmented-terminal-dock` matching the 46px height of the adjacent search bar.

**Tech Stack:** Vanilla ES6 JS, CSS3 Custom Properties, HTML5, Node.js assert test runner.

**Spec:** [`docs/superpowers/specs/2026-11-22-airlines-megamendung-banner-segmented-dock-design.md`](../specs/2026-11-22-airlines-megamendung-banner-segmented-dock-design.md)

## Global Constraints
- High accessibility contrast ratio (WCAG AAA >= 7:1 for normal text against light background).
- Zero-build vanilla architecture (no npm build steps required to run or deploy).
- All 14 existing test suites must pass 100%.

## Review Focus
- Watermark image path resolves correctly in both `airlines.html` and root directory.
- Title and subtitle readability on small mobile screens where watermark might overlap.
- Active button state in `.segmented-terminal-dock` retains full filtering interactivity on click.
- Terminal indicator dot colors match established terminal palette: T1 Sky Blue (`#0284c7`), T2 Purple (`#7c3aed`), T3 Amber (`#d97706`).

---

### Task 1: Batik Mega Mendung Banner Watermark & High-Contrast Typography

**Files:**
- Modify: `airlines.html:55-90`
- Modify: `assets/css/style.css:435-460`
- Modify: `tests/test_airlines_page.js`

**Interfaces:**
- Consumes: `assets/images/batik-megamendung-clean.jpg`
- Produces: `.banner-batik-watermark` CSS class and updated header banner markup

- [x] **Step 1: Write the failing test**

In `tests/test_airlines_page.js`, add assertions verifying:
1. `airlines.html` contains `<div class="banner-batik-watermark"></div>`.
2. `assets/css/style.css` contains `.banner-batik-watermark` with `background-image` referencing `batik-megamendung-clean.jpg` and `mask-image` linear gradient.
3. Banner title in `airlines.html` uses `.brand-font` and has crisp Deep Slate `#0f172a` style.

- [x] **Step 2: Run test to verify it fails**

Run: `node tests/test_airlines_page.js`
Expected: FAIL with missing `.banner-batik-watermark`

- [x] **Step 3: Implement banner markup and CSS**

1. In `airlines.html`:
   - Inside `<header class="modern-page-banner">`, add `<div class="banner-batik-watermark"></div>`.
   - Update `h1.brand-font` title with explicit class and styling for `#0f172a` Deep Slate.
   - Update `p` subtitle to use `#334155` Slate 700 with clear readable font styling.
   - Update category tag badge to `background: #ffffff; border: 1px solid #bae6fd; color: #0284c7;`.
2. In `assets/css/style.css`:
   - Define `.banner-batik-watermark`:
     ```css
     .banner-batik-watermark {
         position: absolute;
         right: 0;
         top: 0;
         width: 52%;
         height: 100%;
         background-image: url('../images/batik-megamendung-clean.jpg');
         background-size: cover;
         background-position: center;
         opacity: 0.35;
         -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
         mask-image: linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%);
         pointer-events: none;
         z-index: 1;
     }
     ```
   - Ensure `.modern-page-banner` has `position: relative; overflow: hidden;`.

- [x] **Step 4: Run test to verify it passes**

Run: `node tests/test_airlines_page.js`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add airlines.html assets/css/style.css tests/test_airlines_page.js
git commit -m "feat(airlines): add batik mega mendung watermark banner and high-contrast typography"
```

---

### Task 2: Segmented Control Dock Terminal Filter Bar

**Files:**
- Modify: `airlines.html:95-125`
- Modify: `assets/css/style.css:480-515`
- Modify: `tests/test_airlines_page.js`

**Interfaces:**
- Consumes: `.airline-term-btn` click handler in `assets/js/main.js` (`data-terminal="all|1|2|3"`)
- Produces: `.segmented-terminal-dock`, `.term-dot`, and modernized `.airline-term-btn` styles

- [x] **Step 1: Write the failing test**

In `tests/test_airlines_page.js`, add assertions verifying:
1. `airlines.html` contains `.segmented-terminal-dock` containing 4 `.airline-term-btn` buttons.
2. Each button contains a `.term-dot` (`.dot-all`, `.dot-t1`, `.dot-t2`, `.dot-t3`).
3. `assets/css/style.css` defines `.segmented-terminal-dock` with `height: 46px` and `border-radius: 12px`.
4. `assets/css/style.css` defines `.airline-term-btn.active` with `background: #ffffff` and `box-shadow`.

- [x] **Step 2: Run test to verify it fails**

Run: `node tests/test_airlines_page.js`
Expected: FAIL with missing `.segmented-terminal-dock`

- [x] **Step 3: Implement dock markup and styles**

1. In `airlines.html`:
   - Replace `<div class="d-flex flex-wrap gap-2" id="terminal-filter-group">` with:
     ```html
     <div class="segmented-terminal-dock" id="terminal-filter-group">
         <button class="airline-term-btn active" data-terminal="all">
             <span class="term-dot dot-all"></span> Semua
         </button>
         <button class="airline-term-btn" data-terminal="1">
             <span class="term-dot dot-t1"></span> T1 Domestik
         </button>
         <button class="airline-term-btn" data-terminal="2">
             <span class="term-dot dot-t2"></span> T2 LCC
         </button>
         <button class="airline-term-btn" data-terminal="3">
             <span class="term-dot dot-t3"></span> T3 Intl & GA
         </button>
     </div>
     ```
2. In `assets/css/style.css`:
   - Style `.segmented-terminal-dock`:
     ```css
     .segmented-terminal-dock {
         display: inline-flex;
         align-items: center;
         gap: 4px;
         background: #f1f5f9;
         border: 1px solid #e2e8f0;
         border-radius: 12px;
         padding: 4px;
         height: 46px;
         max-width: 100%;
         overflow-x: auto;
     }
     ```
   - Style `.airline-term-btn` and `.airline-term-btn.active`:
     ```css
     .airline-term-btn {
         border: none;
         background: transparent;
         color: #475569 !important;
         font-weight: 600;
         font-size: 0.85rem;
         padding: 8px 16px;
         border-radius: 9px;
         cursor: pointer;
         transition: all 0.2s ease;
         display: inline-flex;
         align-items: center;
         gap: 6px;
         white-space: nowrap;
     }
     .airline-term-btn.active {
         background: #ffffff !important;
         color: #0284c7 !important;
         font-weight: 700;
         box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
     }
     .airline-term-btn:hover:not(.active) {
         background: rgba(2, 132, 199, 0.08);
         color: #0284c7 !important;
     }
     ```
   - Style `.term-dot`:
     ```css
     .term-dot {
         width: 6px;
         height: 6px;
         border-radius: 50%;
         display: inline-block;
     }
     .dot-all, .dot-t1 { background-color: #0284c7; }
     .dot-t2 { background-color: #7c3aed; }
     .dot-t3 { background-color: #d97706; }
     ```

- [x] **Step 4: Run test to verify it passes**

Run: `node tests/test_airlines_page.js`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add airlines.html assets/css/style.css tests/test_airlines_page.js
git commit -m "feat(airlines): implement segmented control dock for terminal filtering"
```

---

### Task 3: Full Test Suite Verification & Integration Check

**Files:**
- Verify: `tests/*.js`

- [x] **Step 1: Run all test suites**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`
Expected: ALL 14 TEST SUITES PASS (100% green).

- [x] **Step 2: Clean up scratch brainstorming sessions**

Run: `node C:\Users\Fauzy Ayub\.gemini\config\plugins\superpowers\skills\brainstorming\scripts\server.cjs stop` or remove temporary scratch scripts.

- [x] **Step 3: Commit final verification**

```bash
git commit --allow-empty -m "chore: complete airlines batik watermark banner and segmented dock filter"
```
