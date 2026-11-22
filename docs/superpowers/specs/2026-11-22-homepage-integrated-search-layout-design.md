# Design Spec: Homepage Integrated Search & Balanced Bento Layout

**Date:** 2026-11-22  
**Status:** Draft (Awaiting User Approval)  
**Author:** Antigravity  

---

## 1. Intent & Context
In the previous visual renovation, the Quick Search Bar was placed as a standalone child within `.bento-grid` without an explicit `grid-column: span 12` rule. Because `.bento-grid` uses a 12-column CSS Grid (`grid-template-columns: repeat(12, 1fr)`), the search element defaulted to a single grid track (~80px wide), squishing the input box and leaving Terminal 3 orphaned onto a third row alone.

The user selected **Opsi B (Integrated Search inside Hero)** to achieve a compact, unified executive command hub where flight search sits directly inside the Soekarno-Hatta Hero Hub card, allowing Terminal 1, 2, and 3 to line up side-by-side in a balanced 3-column row (4 + 4 + 4 = 12 columns).

---

## 2. Approaches Considered
- **Approach A (Unified Bento Flow - 12-col divider):** Search as a full 12-column row between Hero and Terminals.  
  *Trade-off:* Spreads layout across 3 vertical tiers; user preferred a more compact footprint.
- **Approach B (Integrated Search inside Hero) — SELECTED:** Search bar embedded directly inside the 8-column Hero Airport Hub card beneath the live telemetry metrics.  
  *Trade-off:* Maximizes density, unifies CGK telemetry with immediate flight lookup, and leaves Row 2 entirely for a clean 3-terminal symmetry (T1, T2, T3).
- **Approach C (Top Command Bar):** Search placed above the hero as a standalone command line bar.  
  *Trade-off:* Detaches flight search from airport context and crowds the fixed navigation bar.

---

## 3. Detailed Design

### 3.1 Markup Structure (`index.html`)
Inside `<main class="container my-4" style="margin-top: 100px !important;">`:
```html
<div class="bento-grid">
    <!-- Bento 1: Hero Airport Hub (8 cols) -->
    <div class="bento-card bento-hero overflow-visible" id="bento-airport-hero">
        <!-- Top: Header & Live Clocks -->
        ...
        <!-- Middle: Telemetry Row (Runway, OTP, Flights) -->
        ...
        <!-- Bottom: Integrated Quick Search Bar -->
        <div class="quick-search-wrapper mt-3" id="quick-search-container">
            <div class="quick-search-input-box">
                <i class="fa-solid fa-magnifying-glass text-cyan"></i>
                <input type="text" id="quick-search-input" class="quick-search-input" placeholder="..." data-i18n="quick_search_placeholder">
                <span class="badge bg-secondary bg-opacity-25 text-secondary font-digital small">ESC</span>
            </div>
            <div id="quick-search-dropdown" class="quick-search-dropdown"></div>
        </div>
    </div>

    <!-- Bento 2: Metar Weather (4 cols) -->
    <div class="bento-card bento-weather ..." id="bento-weather-card">...</div>

    <!-- Bento 3: Terminal 1 Card (4 cols) -->
    <div class="bento-card bento-terminal-card ..." id="t1-bento-card">...</div>

    <!-- Bento 4: Terminal 2 Card (4 cols) -->
    <div class="bento-card bento-terminal-card ..." id="t2-bento-card">...</div>

    <!-- Bento 5: Terminal 3 Card (4 cols) -->
    <div class="bento-card bento-terminal-card ..." id="t3-bento-card">...</div>
</div>
```

### 3.2 Styling Updates (`assets/css/style.css`)
1. **Overflow Handling:** Add `.overflow-visible { overflow: visible !important; }` or apply `overflow: visible` to `#bento-airport-hero` so `.quick-search-dropdown` is not clipped when suggestions appear.
2. **Search Box Sizing:** Update `.quick-search-wrapper`:
   ```css
   .quick-search-wrapper {
       position: relative;
       width: 100%;
       max-width: 100%;
       margin: 1.25rem 0 0 0;
   }
   ```
3. **Contrast & Aesthetics:** `.quick-search-input-box` gets a slightly deeper backdrop (`rgba(9, 9, 11, 0.75)` or `#09090b`) with a 1px border to clearly delineate the search input within the Hero card.
4. **Dropdown Layering:** `.quick-search-dropdown` has `z-index: 100` and high-contrast surface styling with smooth box-shadow.
5. **Terminal Cards Symmetry:** T1, T2, and T3 cards naturally occupy row 2 with 4 columns each, creating an even 3-column grid layout across desktop viewports (`grid-column: span 4`).

### 3.3 JavaScript Compatibility (`assets/js/main.js`)
All element IDs (`#quick-search-input`, `#quick-search-dropdown`, `#bento-airport-hero`) remain intact. `initQuickSearch()` requires zero logic changes, preserving debounce, cross-terminal aggregation, autocomplete rendering, and terminal deep-linking.

---

## 4. Verification Plan
- **DOM Hierarchy Test:** Verify `#quick-search-container` is a descendant of `#bento-airport-hero`.
- **Bento Direct Children Test:** Verify `.bento-grid` has exactly 5 direct `.bento-card` children: Hero (span 8), Weather (span 4), T1 (span 4), T2 (span 4), T3 (span 4).
- **Search Dropdown Test:** Verify autocomplete dropdown renders without clipping.
- **Full Suite Regression:** All 7 unit/DOM test suites pass.
