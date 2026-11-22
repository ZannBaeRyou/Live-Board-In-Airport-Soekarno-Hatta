# Dashboard Hero Card & Title Emerald Green Glow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sophisticated emerald green hover glow effect to the main Airport Hub Bento card (`#bento-airport-hero`) and its airport title (`h1[data-i18n="hero_title"]`) on the dashboard (`index.html`), harmonized with the Airlines directory theme.

**Architecture:** Pure CSS styling in `assets/css/style.css` with smooth cubic-bezier transitions for border-color, multi-layer ambient box-shadow, and text-shadow glow matching `#059669` / `#10b981`.

**Tech Stack:** Vanilla CSS3, Node.js assert test suites.

**Spec:** `docs/superpowers/specs/2026-11-23-dashboard-hero-green-glow-design.md`

## Global Constraints
- Pure CSS with zero external dependencies or build steps.
- Color codes must match Airlines emerald branding: `#059669`, `#10b981`, `#6ee7b7`, `rgba(5, 150, 105, ...)`, and `rgba(16, 185, 129, ...)`.
- All existing 27 test suites must continue to pass 100%.

## Review Focus
- High contrast and legibility maintained during hover in both default and light mode.
- Batik watermark scaling and opacity smooth on hover.
- Title glow works when hovering anywhere on the hero card or directly on the title.
- Mobile responsiveness: no horizontal scroll or layout shift.
- No flickering or abrupt jump on hover transitions.

---

### Task 1: CSS Implementation for Bento Hero Card & Title Emerald Glow

**Files:**
- Modify: `assets/css/style.css`
- Test: `tests/test_hero_glow.js`

**Interfaces:**
- Consumes: `#bento-airport-hero`, `[data-i18n="hero_title"]`, `.hero-batik-watermark` in `index.html`
- Produces: CSS rules for hover states with emerald green glow

- [ ] **Step 1: Write the failing test**

```javascript
// tests/test_hero_glow.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');

// 1. Verify card hover styling
assert(css.includes('#bento-airport-hero:hover'), 'style.css must define #bento-airport-hero:hover');
assert(css.includes('#6ee7b7') && css.includes('rgba(5, 150, 105'), 'Card hover must use emerald border #6ee7b7 and emerald box-shadow');

// 2. Verify title hover glow styling
assert(css.includes('#bento-airport-hero:hover h1') || css.includes('#bento-airport-hero:hover [data-i18n="hero_title"]'), 'style.css must define title hover glow on hero card hover');
assert(css.includes('#059669') && css.includes('rgba(16, 185, 129'), 'Title hover glow must use emerald color #059669 and text-shadow');

console.log('PASS: Hero card and title emerald glow styles verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_hero_glow.js`  
Expected: FAIL

- [ ] **Step 3: Implement emerald hover glow styles in `assets/css/style.css`**

Add CSS rules:
```css
/* ==========================================================================
   BENTO AIRPORT HERO CARD & TITLE EMERALD GLOW (Matching Airlines Theme)
   ========================================================================== */
#bento-airport-hero {
    transition: border-color 0.4s ease, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

#bento-airport-hero:hover {
    border-color: #6ee7b7 !important;
    box-shadow: 0 20px 45px rgba(5, 150, 105, 0.16), 0 0 35px rgba(16, 185, 129, 0.14) !important;
    transform: translateY(-2px);
}

#bento-airport-hero:hover .hero-batik-watermark {
    opacity: 0.35;
    transform: scale(1.03);
}

#bento-airport-hero h1,
#bento-airport-hero [data-i18n="hero_title"] {
    display: inline-block;
    transition: color 0.35s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

#bento-airport-hero:hover h1,
#bento-airport-hero:hover [data-i18n="hero_title"],
#bento-airport-hero h1:hover,
#bento-airport-hero [data-i18n="hero_title"]:hover {
    color: #059669 !important;
    text-shadow: 0 0 16px rgba(16, 185, 129, 0.45), 0 0 32px rgba(5, 150, 105, 0.22);
    transform: translateY(-1px);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_hero_glow.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css tests/test_hero_glow.js
git commit -m "feat(css): add emerald green hover glow to dashboard hero card and title"
```

---

### Task 2: Full Suite Verification & Browser Inspection

**Files:**
- Test: All test suites in `tests/*.js`

- [ ] **Step 1: Run all test suites**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`  
Expected: ALL 28 test suites PASS 100%.

- [ ] **Step 2: Browser visual verification**
- Navigate to `http://127.0.0.1:5500/index.html`.
- Hover over the Bento Airport Hero card.
- Confirm emerald green glow on the card border, box-shadow, and title.
- Capture screenshot evidence.
