# Design Spec: Airlines Directory Batik Mega Mendung Banner & Segmented Control Dock

## 1. Intent & Context
In `airlines.html`, two visual issues were identified by the user:
1. The 4 terminal filter buttons (`Semua Terminal`, `Terminal 1 (Domestik)`, `Terminal 2 (LCC)`, `Terminal 3 (Intl & GA)`) rendered as raw unstyled rectangular buttons without modern polish or alignment.
2. The directory header banner title was washed-out/faint, and the user specifically requested an authentic Indonesian airport touch: incorporating an authentic **Batik Mega Mendung** pattern (uploaded by the user) into the banner background.

Both choices were prototyped and verified in the Visual Companion, where the user enthusiastically approved **Option A: Segmented Control Dock** and **Option A: Soft Watermark Fade** for the Batik Mega Mendung background.

---

## 2. Goals, Non-Goals, Anti-Goals
- **Goals:**
  - Enhance `airlines.html` banner with the user's authentic Batik Mega Mendung motif (`assets/images/batik-megamendung-clean.jpg`) applied as an elegant, non-intrusive watermark on the right side with a smooth fade mask.
  - Render the directory title in ultra-crisp, high-contrast **Deep Slate (`#0f172a`, font-weight 800)** and subtitle in **Slate 700 (`#334155`)** for 100% readability under all lighting conditions (WCAG AAA 15.9:1).
  - Transform the 4 terminal buttons into a modern **Segmented Control Dock** with a 46px height perfectly flush with the search bar, 12px rounded dock container, and elevated active card state with terminal indicator dots.
  - Maintain vanilla zero-build architecture, responsive across desktop and mobile.
- **Non-Goals:**
  - Changing terminal filter functional logic in `assets/js/main.js` (preserve `initAirlinesDirectory()` functionality).
  - Modifying FIDS flight board logic or other pages.
- **Anti-Goals:**
  - No overwhelming or noisy background patterns behind the text that reduce readability.
  - No raw square buttons.
  - No breaking of existing test suites.

---

## 3. Approaches & User Selection
### Part 1: Terminal Filter Buttons
- **Option A (Selected): Segmented Control Dock (Apple / Bento Style)**
  - 4 buttons docked in a unified `#f1f5f9` pill bar with an elevated white card active state (`#ffffff`, `box-shadow: 0 2px 6px rgba(15,23,42,0.08)`).
- **Option B (Rejected): Floating Individual Pill Badges.**
- **Option C (Rejected): Minimalist Fleet Tabs with Underline.**

### Part 2: Indonesian Airport Batik Background
- **Option A (Selected): Soft Watermark Fade (Harmoni Clean Light)**
  - User's Mega Mendung image cropped of search chrome (`batik-megamendung-clean.jpg`) positioned on the right half of the banner, masked with a smooth linear gradient fading into the light background. Text on the left remains on pure light canvas.
- **Option B (Rejected): Royal Nusantara Deep Navy Card.**
- **Option C (Rejected): Modern White Canvas with Thin Top Ribbon.**

---

## 4. Technical Specifications

### A. Asset Preparation
- File: `assets/images/batik-megamendung-clean.jpg` (already cropped and stored in repository).
- Dimensions: 653x340 px, pure pattern, no search UI or watermarks.

### B. Banner Styling (`assets/css/style.css` & `airlines.html`)
- Container `.modern-page-banner`:
  - `position: relative; overflow: hidden; background: linear-gradient(135deg, #f8fafc 0%, #edf8ff 60%, #e2f2fe 100%) !important; border-bottom: 1px solid #cbd5e1 !important; padding: 48px 0 36px;`
- Watermark element `.banner-batik-watermark`:
  - `position: absolute; right: 0; top: 0; width: 52%; height: 100%; background-image: url('../images/batik-megamendung-clean.jpg'); background-size: cover; background-position: center; opacity: 0.35; -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%); mask-image: linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%); pointer-events: none; z-index: 1;`
- Typography in Banner:
  - Title: `.modern-page-banner h1, .modern-page-banner .brand-font { color: #0f172a !important; font-weight: 800; font-size: 2.2rem; }`
  - Subtitle: `.modern-page-banner p { color: #334155 !important; font-weight: 500; font-size: 0.95rem; line-height: 1.6; }`
  - Breadcrumb: `.terminal-breadcrumb a { color: #0284c7 !important; font-weight: 600; } .terminal-breadcrumb span { color: #334155 !important; }`
  - Tag badge: `background: #ffffff; border: 1px solid #bae6fd; color: #0284c7 !important; font-weight: 700;`

### C. Segmented Control Dock Styling
- Dock container `.segmented-terminal-dock`:
  - `display: inline-flex; align-items: center; gap: 4px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 12px; padding: 4px; height: 46px;`
- Buttons `.airline-term-btn`:
  - `border: none; background: transparent; color: #475569 !important; font-weight: 600; font-size: 0.85rem; padding: 8px 16px; border-radius: 9px; cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 6px;`
- Active button `.airline-term-btn.active`:
  - `background: #ffffff !important; color: #0284c7 !important; font-weight: 700; box-shadow: 0 2px 6px rgba(15,23,42,0.08);`
- Terminal indicator dots `.term-dot`:
  - Size: 6px x 6px, `border-radius: 50%`
  - `.dot-all`: `#0284c7`
  - `.dot-t1`: `#0284c7`
  - `.dot-t2`: `#7c3aed`
  - `.dot-t3`: `#d97706`

### D. Verification Criteria
- All 14 existing test suites pass.
- `tests/test_airlines_page.js` asserts presence of `.banner-batik-watermark`, `.segmented-terminal-dock`, and high-contrast banner typography.
