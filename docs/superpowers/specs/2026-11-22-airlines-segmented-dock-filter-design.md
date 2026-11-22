# Design Spec: Airlines Directory Modern Segmented Dock Filter

## 1. Intent & Context
In `airlines.html`, the 4 terminal switcher buttons (`Semua Terminal`, `Terminal 1 (Domestik)`, `Terminal 2 (LCC)`, `Terminal 3 (Intl & GA)`) currently render as plain raw button boxes without border-radius or container alignment. The user requested transforming these into a cohesive modern design fitting the Changi Clean Light Theme.

## 2. Goals, Non-Goals, Anti-Goals
- **Goals:**
  - Modernize the 4 terminal buttons into an executive **Segmented Control Dock** (Option A, selected by user).
  - Align container height (46px) seamlessly with the adjacent search box.
  - Implement active state with a crisp white card elevation (`#ffffff`, `box-shadow: 0 2px 6px rgba(15,23,42,0.08)`), Sky Blue text (`#0284c7`), and terminal indicator dots.
  - Ensure full responsiveness on mobile screens (horizontal scroll or clean flex wrapping).
- **Non-Goals:**
  - Changing terminal filtering logic in `assets/js/main.js` (preserve `initAirlinesDirectory()` functionality).
- **Anti-Goals:**
  - No raw square unstyled buttons.
  - No breaking changes to existing test suites.

## 3. Approaches Considered
- **Option A (Chosen): Segmented Control Dock (Apple / Bento Style)**
  - Grouped dock bar (`#f1f5f9` surface, 12px radius, 46px height) with elevated active button.
  - Selected for its visual harmony, modern executive aesthetic, and alignment with the search input.
- **Option B: Executive Airport Floating Pills**
  - Standalone pill buttons with terminal badges. Rejected in favor of Option A's docked cohesion.
- **Option C: Minimalist Fleet Tabs with Counter Badge**
  - Borderless underline tabs. Rejected in favor of Option A's dock container.

## 4. Implementation Details
1. **HTML (`airlines.html`):**
   - Wrap `#terminal-filter-group` in `.segmented-terminal-dock`:
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
2. **CSS (`assets/css/style.css`):**
   - `.segmented-terminal-dock`: `display: inline-flex; align-items: center; gap: 4px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 4px; height: 46px;`
   - `.airline-term-btn`: `border: none; background: transparent; color: #475569 !important; font-weight: 600; font-size: 0.85rem; padding: 8px 16px; border-radius: 9px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;`
   - `.airline-term-btn.active`: `background: #ffffff !important; color: #0284c7 !important; font-weight: 700; box-shadow: 0 2px 6px rgba(15,23,42,0.08);`
   - `.airline-term-btn:hover:not(.active)`: `background: rgba(2, 132, 199, 0.08); color: #0284c7 !important;`
   - Dot indicators:
     - `.term-dot`: 6px diameter, border-radius 50%
     - `.dot-all`: `#0284c7`
     - `.dot-t1`: `#0284c7`
     - `.dot-t2`: `#7c3aed`
     - `.dot-t3`: `#d97706`
3. **Verification:**
   - Update tests in `tests/test_airlines_page.js` to verify `.segmented-terminal-dock` and modern button styling.
   - Run all 14 test suites to guarantee 100% pass rate.
