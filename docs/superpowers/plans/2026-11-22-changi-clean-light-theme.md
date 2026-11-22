# Changi Clean Light Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Liveboard web application into a high-accessibility, world-class Changi/Incheon-style Clean Light Theme (Option A) with default light mode, daylight 3D radar globe, and an interactive Sun/Moon theme switcher across all pages.

**Architecture:** Pure zero-build vanilla web architecture (HTML5, CSS3 Custom Properties, Vanilla ES6 JavaScript). The theming is powered by semantic CSS tokens under `:root` and `[data-theme="light"]` / `[data-theme="dark"]`, managed dynamically by `i18n.js` with `localStorage` persistence, while the HTML5 canvas 3D radar globe in `main.js` dynamically adapts colors between Daylight Aviation Chart and Stealth Cyber Dark.

**Tech Stack:** Vanilla JavaScript (ES6+), CSS3 Variables, Bootstrap 5.3 (grid/utility), HTML5 Canvas 3D vector renderer, Node.js (test runner).

**Spec:** `docs/superpowers/specs/2026-11-22-changi-clean-light-theme-design.md`

## Global Constraints

- **Pure Zero-Build Vanilla:** No build tool, bundler, or Node.js runtime required for deployment (cPanel static hosting ready).
- **Default Theme:** `light` mode is the primary default theme on first visit.
- **Accessibility Standard:** Text contrast ratio must meet WCAG AAA (>= 14:1) for primary text (`#0f172a` on `#ffffff` / `#f8fafc`).
- **Persistence:** User theme preference is saved to `localStorage.getItem('liveboard_theme')`.
- **Zero Layout Breaking:** Keep 6-column FIDS board layout, responsive tables, quick search, and airline bento filters 100% intact.

## Review Focus

1. **First-Time Visitor Theme:** Default to `light` mode immediately without flashing dark mode.
2. **Text Contrast in Light Mode:** Ensure table headers, badge texts, and flight numbers are deep slate `#0f172a` / `#475569`, never light grey or white on white.
3. **Canvas Adaptation:** 3D radar canvas must redraw immediately with daylight sky blue ocean (`#e0f2fe`) and soft background (`#f8fafc`) when in light mode.
4. **Theme Switcher Sync:** Toggling theme in navbar updates all open components, modal, and persists across page navigations.
5. **Mobile Responsiveness:** Ensure modal and navbar theme button don't overflow on small phone screens (<= 375px).

---

### Task 1: Light Theme Design Tokens & Global CSS System

**Files:**
- Modify: `assets/css/style.css:1-120, 200-350, 850-950, 1720-1820`
- Test: `tests/test_light_theme_styles.js`

**Interfaces:**
- Consumes: CSS variables under `:root` and `[data-theme="light"]`.
- Produces: Complete light-mode styling for background (`#f8fafc`), card surfaces (`#ffffff`), borders (`#e2e8f0`), text (`#0f172a`), status badges (`.status-pill-*`), and bento cards.

- [ ] **Step 1: Write test for light theme CSS tokens and contrast**

Create `tests/test_light_theme_styles.js` asserting:
- `assets/css/style.css` declares `[data-theme="light"]` or `:root` with `--bg-primary: #f8fafc;`, `--text-primary: #0f172a;`, `--bg-surface: #ffffff;`.
- Light mode status pills have distinct background and text colors.
- `.airline-card-bento` and `.fids-row-modern` have light theme rules.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_light_theme_styles.js`  
Expected: FAIL

- [ ] **Step 3: Implement Light Theme Tokens and Component Styles**

1. In `assets/css/style.css`:
- Update `:root` and `[data-theme="light"]`:
  - `--bg-primary: #f8fafc`
  - `--bg-surface: #ffffff`
  - `--bg-surface-elevated: #f1f5f9`
  - `--border-subtle: #e2e8f0`
  - `--border-strong: #cbd5e1`
  - `--text-primary: #0f172a`
  - `--text-secondary: #475569`
  - `--text-muted: #64748b`
  - `--accent-sky: #0284c7`
- Update status badges in light mode:
  - `.status-pill-boarding`: background `#dcfce7`, text `#15803d`, dot `#16a34a`.
  - `.status-pill-delayed`: background `#fef3c7`, text `#b45309`, dot `#d97706`.
  - `.status-pill-final-call`: background `#ffedd5`, text `#c2410c`, dot `#ea580c`.
  - `.status-pill-scheduled`: background `#f1f5f9`, text `#475569`, dot `#64748b`.
- Update `.fids-row-modern`: white card surface with border `#e2e8f0`, soft hover elevation, dark text.
- Update `.hero-fids-container`, `.modern-page-banner`, and `.airline-card-bento` for light mode.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_light_theme_styles.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css tests/test_light_theme_styles.js
git commit -m "feat(styles): implement changi clean light theme tokens and component styles"
```

---

### Task 2: Theme Switcher & Persistence Engine

**Files:**
- Modify: `assets/js/i18n.js:210-250`
- Modify: `index.html:45-55`, `terminal1.html:45-55`, `terminal2.html:45-55`, `terminal3.html:45-55`, `airlines.html:45-55`
- Test: `tests/test_theme_toggle.js`

**Interfaces:**
- Consumes: `initTheme()` and `toggleTheme()` in `i18n.js`.
- Produces: Navbar theme toggle button (`#theme-toggle-btn`) with Sun/Moon icon, `localStorage` syncing, and default light mode.

- [ ] **Step 1: Write test for theme switcher and persistence**

Create `tests/test_theme_toggle.js` asserting:
- `i18n.js` defaults to `'light'` if no `localStorage` item is present.
- `i18n.js` defines `toggleTheme()` function.
- All 5 HTML files have the theme toggle button `#theme-toggle-btn` in the navbar.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_theme_toggle.js`  
Expected: FAIL

- [ ] **Step 3: Implement Theme Engine & Navbar Toggle Button**

1. In `assets/js/i18n.js`:
- Set default `currentTheme = localStorage.getItem('liveboard_theme') || 'light';`
- Implement:
  ```javascript
  function initTheme() {
      currentTheme = localStorage.getItem('liveboard_theme') || 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      updateThemeIcon(currentTheme);
  }
  function toggleTheme() {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('liveboard_theme', currentTheme);
      updateThemeIcon(currentTheme);
      window.dispatchEvent(new Event('themechange'));
  }
  function updateThemeIcon(theme) {
      const icon = document.getElementById('theme-toggle-icon');
      if (icon) {
          icon.className = theme === 'light' ? 'fa-solid fa-moon text-slate-700' : 'fa-solid fa-sun text-amber-400';
      }
  }
  ```
2. In `index.html`, `terminal1.html`, `terminal2.html`, `terminal3.html`, and `airlines.html`:
- Add theme toggle button in navbar next to language dropdown:
  ```html
  <button id="theme-toggle-btn" class="btn btn-sm btn-theme-toggle me-2" onclick="toggleTheme()" aria-label="Toggle Theme">
      <i id="theme-toggle-icon" class="fa-solid fa-moon"></i>
  </button>
  ```
3. In `assets/css/style.css`:
- Add `.btn-theme-toggle` styling (circular, subtle border, smooth hover).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_theme_toggle.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/js/i18n.js assets/css/style.css index.html terminal1.html terminal2.html terminal3.html airlines.html tests/test_theme_toggle.js
git commit -m "feat(theme): add interactive theme switcher with light-mode default and local storage persistence"
```

---

### Task 3: Daylight 3D Radar Globe & Modal Overhaul

**Files:**
- Modify: `assets/js/main.js:1070-1380`
- Modify: `assets/css/style.css:920-1040`
- Test: `tests/test_daylight_globe.js`

**Interfaces:**
- Consumes: `drawGlobeLoop()` in `main.js`, `[data-theme="light"] .fids-modal-content` in `style.css`.
- Produces: Dynamic daylight radar canvas when `data-theme="light"` (sky-blue ocean `#e0f2fe`, white continents, daylight cockpit HUD).

- [ ] **Step 1: Write test for daylight globe canvas**

Create `tests/test_daylight_globe.js` asserting:
- `drawGlobeLoop()` inspects `data-theme` and sets daylight colors `#f8fafc`, `#e0f2fe`, `#0284c7` when theme is light.
- Modal CSS has explicit light theme background `rgba(255, 255, 255, 0.98)` and dark text.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_daylight_globe.js`  
Expected: FAIL

- [ ] **Step 3: Implement Daylight Globe Radar & Light Modal**

1. In `assets/js/main.js` `drawGlobeLoop()`:
- Check `const isLight = document.documentElement.getAttribute('data-theme') === 'light';`
- Background space: `isLight ? '#f8fafc' : '#09090b'`
- Ocean sphere: `isLight ? '#e0f2fe' : '#080f21'`
- Atmospheric glow: `isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.35)'`
- Graticule lat/lon: `isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.08)'`
- Continents:
  - Light mode: fill `#ffffff`, stroke `#94a3b8`
  - Dark mode: fill `rgba(56, 189, 248, 0.05)`, stroke cyan
- Flight path arc: `isLight ? '#0284c7' : '#38bdf8'`
- Cockpit HUD Telemetry:
  - Fill: `isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(9, 9, 11, 0.88)'`
  - Stroke: `isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(56, 189, 248, 0.35)'`
  - Text header: `isLight ? '#0284c7' : '#38bdf8'`
  - Metric labels: `isLight ? '#64748b' : 'rgba(255, 255, 255, 0.5)'`
  - Metric values: `isLight ? '#0f172a' : '#f8fafc'`
2. In `assets/css/style.css`:
- Update `.fids-modal-content` for light mode: white surface, subtle border, high-contrast typography, and glowing stepper checkpoints.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_daylight_globe.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js assets/css/style.css tests/test_daylight_globe.js
git commit -m "feat(radar): implement daylight 3d globe radar canvas and light modal styles"
```

---

### Task 4: Full Regression & E2E Verification

**Files:**
- Test: all test suites in `tests/*.js`

**Interfaces:**
- Consumes: Entire Liveboard codebase.
- Produces: 100% test pass rate across all 11+ test suites.

- [ ] **Step 1: Run all test suites**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`  
Expected: All suites PASS

- [ ] **Step 2: Commit final ledger**

```bash
git add .superpowers/sdd/
git commit -m "chore: complete changi clean light theme implementation"
```
