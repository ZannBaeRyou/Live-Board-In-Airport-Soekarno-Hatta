# Design Spec — Changi Clean Light Theme (Option A)

- **Date:** 2026-11-22
- **Author:** Antigravity & Fauzan Ayub
- **Status:** Proposed (Awaiting Approval)
- **Branch:** `feature/modern-ui-renovation`
- **Scope:** Complete visual transition to high-accessibility Light Theme across the entire Liveboard platform (Homepage, Terminal 1/2/3 FIDS, Airlines Directory, and 3D Radar Modal).

---

## 1. Problem & Objectives

### 1.1 Problem
The current dark theme (`#09090b`), while high-tech and sleek, can be challenging to read in bright outdoor conditions, high-glare airport kiosks, or for passengers with visual impairments/elderly demographics who require higher luminance contrast.

### 1.2 Objective
Implement **Option A (Modern Clean Airport Hub — Changi / Incheon Style)** as the primary default theme:
- Deliver maximum universal readability with **WCAG AAA Contrast Ratio (14.5:1)** for text elements.
- Maintain a clean, professional international airport look: crisp off-white background (`#f8fafc`), pure white elevated surfaces (`#ffffff`), soft slate borders (`#e2e8f0`), and aviation sky blue accents (`#0284c7`).
- Upgrade the 3D Globe Radar into a **Daylight Aviation Chart** with sky-blue oceans (`#e0f2fe`), crisp white continent landmasses, bold navy flight routes, and clean daylight cockpit HUD telemetry.
- Provide a smooth, accessible **Theme Switcher (Matahari/Bulan)** in the navbar header with `localStorage` persistence, defaulting to **Light Mode**.

---

## 2. Design Tokens & Color Palette

### 2.1 CSS Variables (`assets/css/style.css`)
```css
/* LIGHT THEME (Option A: Clean Changi Hub - Default) */
:root,
[data-theme="light"] {
    --bg-primary: #f8fafc;            /* Crisp Slate-50 */
    --bg-surface: #ffffff;            /* Pure White card surfaces */
    --bg-surface-elevated: #f1f5f9;   /* Soft Slate-100 hover/elevated */
    --bg-surface-translucent: rgba(255, 255, 255, 0.88);
    
    --border-subtle: #e2e8f0;         /* Slate-200 hairline border */
    --border-strong: #cbd5e1;         /* Slate-300 active/focus */
    
    --text-primary: #0f172a;          /* Slate-900 (High contrast WCAG AAA) */
    --text-secondary: #475569;        /* Slate-600 */
    --text-muted: #64748b;            /* Slate-500 */
    
    /* Aviation Accents */
    --accent-sky: #0284c7;            /* Sky-600 (Primary Navigation & Telemetry) */
    --accent-sky-tint: #e0f2fe;       /* Sky-100 (Badge background) */
    --accent-t1: #0284c7;             /* Terminal 1 Cyan/Sky */
    --accent-t2: #7c3aed;             /* Terminal 2 Violet/Purple */
    --accent-t3: #d97706;             /* Terminal 3 Amber Gold */
    
    /* Flight Status System */
    --status-boarding-bg: #dcfce7;
    --status-boarding-text: #15803d;
    --status-delayed-bg: #fef3c7;
    --status-delayed-text: #b45309;
    --status-final-call-bg: #ffedd5;
    --status-final-call-text: #c2410c;
    --status-scheduled-bg: #f1f5f9;
    --status-scheduled-text: #475569;
    
    /* Shadow Elevation */
    --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05);
    --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04);
}
```

---

## 3. Component Specifications

### 3.1 Homepage Bento Hub (`index.html`)
- **Hero & Search:** White search bar with `#e2e8f0` border, `#0f172a` input text, and dropdown items with soft slate hover highlight.
- **Runway & Metar Cards:** White cards with subtle border and crisp dark telemetry metrics.
- **Terminal Cards (T1, T2, T3):**
  - White background with soft border.
  - Coloured top badge pill (`Domestic Hub`, `LCC & Regional`, `International & Flagship`).
  - Numbers in bold dark slate with on-time percentage badges.

### 3.2 Terminal FIDS Boards (`terminal1.html`, `terminal2.html`, `terminal3.html`)
- **Table Headers:** `#f1f5f9` slate background with bold dark text `#475569`.
- **FIDS Rows (`.fids-row-modern`):**
  - Pure white background with border `#e2e8f0`.
  - Hover state with soft elevation (`translateY(-2px)`, shadow-md).
  - High-contrast flight time, carrier name, and destination.
  - Status badges with distinct tinted backgrounds and bold colored text.
  - Airline quick-filter pills styled with white background and sky-blue active ring.

### 3.3 Flight Details Modal & Daylight Radar Canvas (`main.js` & `style.css`)
- **Modal Container:** White backdrop blur card (`rgba(255, 255, 255, 0.98)`), hairline border `#e2e8f0`, dark text.
- **Daylight 3D Globe Radar Canvas:**
  - Background space: `#f8fafc` (Soft crisp white).
  - Ocean sphere: `#e0f2fe` (Clean daylight sky blue).
  - Continental landmasses: Pure white `#ffffff` with stroke `#94a3b8` (Slate-400).
  - Atmospheric glow: `rgba(2, 132, 199, 0.25)`.
  - Flight great-circle arc: `#0284c7` (Aviation Blue) with pulsing chevron.
  - Cockpit Telemetry HUD: Daylight glass box (`rgba(255, 255, 255, 0.92)`), border `#bae6fd`, text `#0f172a`, values `#0284c7`.

### 3.4 Airlines Fleet Bento (`airlines.html`)
- **Cards (`.airline-card-bento`):**
  - White surface with border `#e2e8f0`.
  - Carrier IATA code badges with tinted backgrounds.
  - "Lihat Jadwal" button in sky-blue outline with dark hover state.

---

## 4. Theme Toggle Implementation (`i18n.js`)

- Store current theme in `localStorage.getItem('liveboard_theme') || 'light'`.
- Default to `'light'` upon first load.
- In `index.html`, `terminal1/2/3.html`, and `airlines.html`, render a Theme Switcher button (Sun/Moon icon) next to the ID/EN language toggle in the navbar.
- Clicking the toggle smoothly transitions `data-theme` between `'light'` and `'dark'`.
- 3D Globe Radar canvas dynamically detects current theme on redraw.

---

## 5. Verification & Testing Plan

1. **DOM & Token Verification:**
   - Assert `data-theme="light"` is default.
   - Assert all light-theme design tokens exist in `assets/css/style.css`.
   - Assert contrast ratios meet WCAG AAA standards.
2. **Canvas Rendering Verification:**
   - Verify `main.js` renders `#f8fafc` and `#e0f2fe` when in light mode.
3. **Interactive Switching Verification:**
   - Verify theme toggle button successfully flips `data-theme` attribute and updates `localStorage`.
4. **Full Regression Suite:**
   - Re-run all existing test suites to ensure 100% pass rate.
