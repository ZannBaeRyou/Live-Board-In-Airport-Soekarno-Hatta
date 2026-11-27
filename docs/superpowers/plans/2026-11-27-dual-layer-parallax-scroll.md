# Dual-Layer Parallax Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a responsive, lightweight, hardware-accelerated dual-layer parallax scroll effect (0.10x global polka dot canvas and 0.28x hero batik watermark) with full accessibility support across Liveboard.

**Architecture:** Pure Vanilla JavaScript engine using `window.requestAnimationFrame()` and `{ passive: true }` event listener, combined with CSS GPU-accelerated transforms (`translate3d`), bound with `Math.min` clamping (~120px) to prevent element leakage and respecting `prefers-reduced-motion`.

**Tech Stack:** Vanilla JavaScript (ES6+), CSS3 (Transforms & Media Queries), Node.js (Test Runner).

**Spec:** `docs/superpowers/specs/2026-11-27-dual-layer-parallax-scroll-design.md`

## Global Constraints
- Zero external libraries/dependencies (no GSAP/ScrollTrigger/CDN scripts).
- Hardware acceleration via `translate3d(0, y, 0)` and `will-change: transform`.
- Automatic disable when `window.matchMedia('(prefers-reduced-motion: reduce)')` is active.
- All existing 36 test suites + new parallax test must pass 100% with zero regressions.

## Review Focus
1. Rapid continuous scrolling: must not cause frame stutter or memory leak (guarded by `ticking` rAF flag).
2. Deep scroll past 600px: hero batik must clamp cleanly at 120px and not leak beyond card border.
3. User with `prefers-reduced-motion: reduce`: parallax transforms must remain strictly `none` or `0px`.
4. Mobile / touch viewport: scroll listener must be passive to preserve native momentum touch scrolling.
5. Multi-page compatibility: works on `index.html` as well as terminal pages (`terminal1.html`, `terminal2.html`, `terminal3.html`).

---

### Task 1: CSS Layer Optimization & Reduced Motion Rules

**Files:**
- Modify: `assets/css/style.css`
- Test: `tests/test_parallax_scroll.js`

**Interfaces:**
- Consumes: Existing `.hero-batik-watermark` and `.terminal-hero-batik-watermark` CSS definitions.
- Produces: Hardware acceleration properties (`will-change: transform`, `pointer-events: none`) and `@media (prefers-reduced-motion: reduce)` overrides.

- [ ] **Step 1: Write the failing test in `tests/test_parallax_scroll.js`**

```javascript
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const css = fs.readFileSync(path.join(__dirname, '../assets/css/style.css'), 'utf8');

// Check CSS rules for hardware acceleration and accessibility
assert(css.includes('will-change: transform') || css.includes('will-change: opacity, transform'), 'style.css must specify will-change for watermark elements');
assert(css.includes('prefers-reduced-motion: reduce'), 'style.css must support prefers-reduced-motion: reduce');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_parallax_scroll.js`
Expected: FAIL with assertion error on prefers-reduced-motion or will-change.

- [ ] **Step 3: Implement CSS styling updates in `assets/css/style.css`**

Add `will-change: transform;` and `pointer-events: none;` to `.hero-batik-watermark` and `@media (prefers-reduced-motion: reduce)` block resetting transforms.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_parallax_scroll.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add assets/css/style.css tests/test_parallax_scroll.js
git commit -m "style(parallax): add hardware acceleration and reduced-motion rules for watermark"
```

---

### Task 2: Implement `initParallaxScroll` Engine in `assets/js/main.js`

**Files:**
- Modify: `assets/js/main.js`
- Modify: `tests/test_parallax_scroll.js`
- Modify: `tests/test_full_suite.js`

**Interfaces:**
- Consumes: Window scroll events, `document.body`, `.hero-batik-watermark`, `.terminal-hero-batik-watermark`.
- Produces: `initParallaxScroll()` function invoked on `DOMContentLoaded`.

- [ ] **Step 1: Expand `tests/test_parallax_scroll.js` with JS assertions**

```javascript
const mainJs = fs.readFileSync(path.join(__dirname, '../assets/js/main.js'), 'utf8');

assert(mainJs.includes('initParallaxScroll'), 'main.js must define initParallaxScroll');
assert(mainJs.includes('prefers-reduced-motion'), 'initParallaxScroll must check prefers-reduced-motion');
assert(mainJs.includes('requestAnimationFrame'), 'initParallaxScroll must use requestAnimationFrame');
assert(mainJs.includes('backgroundPositionY'), 'initParallaxScroll must update body backgroundPositionY');
assert(mainJs.includes('translate3d'), 'initParallaxScroll must use translate3d on batik watermark');
console.log('PASS: test_parallax_scroll verified');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_parallax_scroll.js`
Expected: FAIL with "main.js must define initParallaxScroll"

- [ ] **Step 3: Implement `initParallaxScroll` in `assets/js/main.js`**

Implement:
```javascript
function initParallaxScroll() {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const heroWatermark = document.querySelector('.hero-batik-watermark, .terminal-hero-batik-watermark');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset || document.documentElement.scrollTop || 0;
                // Layer 1: Global canvas polka dot drift (modulo 24px)
                const bgOffset = (scrolled * 0.10) % 24;
                document.body.style.backgroundPositionY = `${bgOffset}px`;

                // Layer 2: Hero batik watermark parallax (clamped at 120px)
                if (heroWatermark) {
                    const batikY = Math.min(scrolled * 0.28, 120);
                    heroWatermark.style.transform = `translate3d(0, ${batikY}px, 0)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}
```
And add call `initParallaxScroll();` in `DOMContentLoaded`.
Add `test_parallax_scroll.js` to `tests/test_full_suite.js`.

- [ ] **Step 4: Run test suite to verify it passes**

Run: `node tests/test_full_suite.js`
Expected: PASS (all 37 suites pass).

- [ ] **Step 5: Commit**

```bash
git add assets/js/main.js tests/test_parallax_scroll.js tests/test_full_suite.js
git commit -m "feat(parallax): implement dual-layer parallax scroll engine with rAF and clamping"
```

---

### Task 3: Visual & Functional Verification via Browser Subagent

**Files:**
- Verify: `http://127.0.0.1:5500/index.html`
- Verify: `http://127.0.0.1:5500/terminal1.html`

- [ ] **Step 1: Start/Verify local dev server on port 5500**

Ensure `serve.cjs` is running on `http://127.0.0.1:5500/`.

- [ ] **Step 2: Dispatch browser verification**

Navigate to `http://127.0.0.1:5500/index.html`.
Scroll down by 250px.
Evaluate in browser:
- `document.body.style.backgroundPositionY` matches `(250 * 0.10) % 24 = 1px`.
- `.hero-batik-watermark` transform matches `translate3d(0, 70px, 0)`.
Capture scrolled screenshot.
Navigate to `terminal1.html`, scroll down by 300px, verify `.terminal-hero-batik-watermark` transform.

- [ ] **Step 3: Capture evidence screenshots and save to artifacts**

Copy screenshots to artifact directory.

- [ ] **Step 4: Commit and push**

```bash
git push origin feat/compact-mobile-tablet
git checkout main
git merge feat/compact-mobile-tablet
git push origin main
git checkout feat/compact-mobile-tablet
```
