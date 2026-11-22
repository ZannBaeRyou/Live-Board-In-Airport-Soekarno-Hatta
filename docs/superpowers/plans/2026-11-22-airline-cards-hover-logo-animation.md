# Airline Cards Hover Logo Watermark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Option B3 (Top-Right Diagonal Glide) hover logo watermark for all 21 airline cards on `airlines.html`, displaying vibrant, full-color official airline logos upon cursor hover with smooth cubic-bezier animation and complete text readability.

**Architecture:** Augment `AIRLINE_DATABASE` with official 128px CloudFront logo URLs. In `initAirlinesDirectory()`, inject an absolute-positioned watermark layer underneath the card content. Style the watermark in `style.css` using `position: absolute; top: -5px; right: -5px; width: 160px; height: 160px;` with radial gradient masking, translating from `(20px, -20px)` to `(0, 0)` with opacity scaling to 0.50 on card hover.

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5, CSS3, Node.js test runner.

**Spec:** `docs/superpowers/specs/2026-11-22-airline-cards-hover-logo-animation-design.md`

## Global Constraints

- Pure zero-build vanilla stack (no bundler, npm build steps, or frameworks).
- All 21 airline cards in `AIRLINE_DATABASE` must have authentic brand logos.
- Watermark must use `pointer-events: none` and `z-index: 1` so text and buttons on `z-index: 2` remain completely clickable and legible.
- Logo opacity on hover is capped at 0.50 with a soft circular radial gradient mask.
- All existing 18 test suites plus the new test suite must pass with 100% success.

## Review Focus

1. **Missing logo fallback:** If CDN fails or an image fails to load, `onerror` must hide the watermark container gracefully without showing a broken image icon.
2. **Layering / Stacking context:** Ensure card text, phone number, and buttons have higher stacking priority (`z-index: 2`) than the watermark (`z-index: 1`).
3. **Card overflow:** `.airline-card-bento` must have `overflow: hidden` so the 160px watermark does not bleed outside card borders during diagonal translation.
4. **Mobile responsiveness:** Touch devices should not suffer from layout distortion or horizontal scrollbars from the translated watermark.
5. **No interference with terminal filters or quick search:** Ensure search by airline name/code and terminal filtering continue to work seamlessly.

---

### Task 1: Enrich `AIRLINE_DATABASE` with Logo URLs & Test Harness

**Files:**
- Create: `tests/test_airline_logo_watermark.js`
- Modify: `assets/js/main.js:1890-1925`

**Interfaces:**
- Produces: `a.logo` string for each airline in `AIRLINE_DATABASE` (`https://images.kiwi.com/airlines/128/{code}.png`).

- [ ] **Step 1: Write the failing test in `tests/test_airline_logo_watermark.js`**

```javascript
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const mainJs = fs.readFileSync(path.join(__dirname, '../assets/js/main.js'), 'utf8');

// Extract AIRLINE_DATABASE
const dbMatch = mainJs.match(/const AIRLINE_DATABASE\s*=\s*(\[[\s\S]*?\]);/);
assert(dbMatch, 'AIRLINE_DATABASE must be defined in assets/js/main.js');
const airlines = eval(dbMatch[1]);

assert.strictEqual(airlines.length, 21, 'AIRLINE_DATABASE must contain exactly 21 airlines');

// Every airline must have a logo property
airlines.forEach(airline => {
    assert(airline.logo, `Airline ${airline.code} (${airline.name}) must have a logo property`);
    assert(airline.logo.startsWith('https://images.kiwi.com/airlines/128/'), `Logo for ${airline.code} must use 128px CDN`);
    assert(airline.logo.endsWith('.png'), `Logo for ${airline.code} must be a .png file`);
});

console.log('PASS: AIRLINE_DATABASE verified with 21 valid airline logo URLs');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_airline_logo_watermark.js`  
Expected: FAIL with `AssertionError: Airline GA (Garuda Indonesia) must have a logo property`

- [ ] **Step 3: Update `AIRLINE_DATABASE` in `assets/js/main.js`**

Add `logo: 'https://images.kiwi.com/airlines/128/{code}.png'` to all 21 airlines:
- `GA`: `https://images.kiwi.com/airlines/128/GA.png`
- `SQ`: `https://images.kiwi.com/airlines/128/SQ.png`
- `QR`: `https://images.kiwi.com/airlines/128/QR.png`
- `EK`: `https://images.kiwi.com/airlines/128/EK.png`
- `NH`: `https://images.kiwi.com/airlines/128/NH.png`
- `JL`: `https://images.kiwi.com/airlines/128/JL.png`
- `CX`: `https://images.kiwi.com/airlines/128/CX.png`
- `EY`: `https://images.kiwi.com/airlines/128/EY.png`
- `SV`: `https://images.kiwi.com/airlines/128/SV.png`
- `TK`: `https://images.kiwi.com/airlines/128/TK.png`
- `QG`: `https://images.kiwi.com/airlines/128/QG.png`
- `JT`: `https://images.kiwi.com/airlines/128/JT.png`
- `ID`: `https://images.kiwi.com/airlines/128/ID.png`
- `IW`: `https://images.kiwi.com/airlines/128/IW.png`
- `SJ`: `https://images.kiwi.com/airlines/128/SJ.png`
- `IN`: `https://images.kiwi.com/airlines/128/IN.png`
- `QZ`: `https://images.kiwi.com/airlines/128/QZ.png`
- `IU`: `https://images.kiwi.com/airlines/128/IU.png`
- `IP`: `https://images.kiwi.com/airlines/128/IP.png`
- `TR`: `https://images.kiwi.com/airlines/128/TR.png`
- `3K`: `https://images.kiwi.com/airlines/128/3K.png`

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_airline_logo_watermark.js`  
Expected: PASS with "PASS: AIRLINE_DATABASE verified with 21 valid airline logo URLs"

- [ ] **Step 5: Commit**

```bash
git add tests/test_airline_logo_watermark.js assets/js/main.js
git commit -m "feat(airlines): add official 128px logo URLs to all 21 airlines in AIRLINE_DATABASE"
```

---

### Task 2: Implement Watermark DOM Structure & CSS Animations

**Files:**
- Modify: `tests/test_airline_logo_watermark.js`
- Modify: `assets/js/main.js:1955-2015`
- Modify: `assets/css/style.css`

**Interfaces:**
- Consumes: `a.logo` from Task 1.
- Produces: `.airline-card-logo-watermark` DOM element and CSS hover animations.

- [ ] **Step 1: Expand test in `tests/test_airline_logo_watermark.js` to assert card DOM & CSS rules**

```javascript
// Check renderCards template contains watermark element
assert(mainJs.includes('airline-card-logo-watermark'), 'renderCards must include airline-card-logo-watermark class');
assert(mainJs.includes('onerror="this.parentElement.style.display=\'none\'"'), 'Watermark must include error fallback handler');
assert(mainJs.includes('airline-card-body-content'), 'Card body content must be wrapped in airline-card-body-content container');

// Check style.css contains CSS rules for watermark
const css = fs.readFileSync(path.join(__dirname, '../assets/css/style.css'), 'utf8');
assert(css.includes('.airline-card-logo-watermark'), 'style.css must define .airline-card-logo-watermark');
assert(css.includes('.airline-card-bento:hover .airline-card-logo-watermark'), 'style.css must define hover transition for watermark');
assert(css.includes('opacity: 0.5'), 'Watermark hover opacity must be set to 0.50');
assert(css.includes('pointer-events: none;'), 'Watermark must specify pointer-events: none');

console.log('PASS: All airline card watermark DOM and CSS styling requirements verified');
```

- [ ] **Step 2: Run test to verify failure**

Run: `node tests/test_airline_logo_watermark.js`  
Expected: FAIL with `AssertionError: renderCards must include airline-card-logo-watermark class`

- [ ] **Step 3: Update `renderCards()` in `assets/js/main.js`**

Inject the watermark markup before card content, and wrap the content in `.airline-card-body-content`:
```html
<div class="col-md-6 col-lg-4">
    <div class="airline-card-bento h-100">
        <!-- Watermark Brand Logo (Layer 1) -->
        <div class="airline-card-logo-watermark">
            <img src="${a.logo}" alt="${a.name}" loading="lazy" onerror="this.parentElement.style.display='none'">
        </div>

        <!-- Content (Layer 2) -->
        <div class="airline-card-body-content d-flex flex-column h-100">
            ...
        </div>
    </div>
</div>
```

- [ ] **Step 4: Add CSS styles in `assets/css/style.css`**

Add the styling rules for `.airline-card-bento`, `.airline-card-body-content`, and `.airline-card-logo-watermark`:
```css
/* Airline Bento Card Logo Watermark (Top-Right Diagonal Glide) */
.airline-card-bento {
    position: relative;
    overflow: hidden;
}

.airline-card-body-content {
    position: relative;
    z-index: 2;
}

.airline-card-logo-watermark {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 160px;
    height: 160px;
    opacity: 0;
    transform: translate(20px, -20px) scale(0.85);
    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    z-index: 1;
    -webkit-mask-image: radial-gradient(circle at 75% 25%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 85%);
    mask-image: radial-gradient(circle at 75% 25%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 85%);
    will-change: opacity, transform;
}

.airline-card-logo-watermark img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.airline-card-bento:hover .airline-card-logo-watermark {
    opacity: 0.50;
    transform: translate(0, 0) scale(1.05);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `node tests/test_airline_logo_watermark.js`  
Expected: PASS with "PASS: All airline card watermark DOM and CSS styling requirements verified"

- [ ] **Step 6: Commit**

```bash
git add tests/test_airline_logo_watermark.js assets/js/main.js assets/css/style.css
git commit -m "feat(ui): implement top-right diagonal glide hover logo watermark on airline bento cards"
```

---

### Task 3: Full Test Suite Run, Browser Visual Verification & GitHub Push

**Files:**
- Verify: all 19 test suites in `tests/*.js`
- Test: browser live testing at `http://127.0.0.1:5500/airlines.html`

- [ ] **Step 1: Run all 19 test suites**

Run: `Get-ChildItem tests/*.js | ForEach-Object { node $_.FullName }`  
Expected: All 19 suites output PASS.

- [ ] **Step 2: Browser visual verification via subagent**

Navigate to `http://127.0.0.1:5500/airlines.html`:
- Hover over Qatar Airways card (`QR`), verify 160px maroon logo appears at top-right with 50% opacity.
- Hover over Garuda Indonesia card (`GA`), verify green eagle logo appears.
- Hover over Singapore Airlines card (`SQ`), verify blue/gold logo appears.
- Test in mobile viewport (390px) to verify cards do not clip or cause horizontal overflow.
- Capture screenshots for verification evidence.

- [ ] **Step 3: Push commits to GitHub `origin/main`**

Run: `git push origin main`  
Expected: Successfully pushed to `https://github.com/ZannBaeRyou/Live-Board-In-Airport-Soekarno-Hatta.git`.
