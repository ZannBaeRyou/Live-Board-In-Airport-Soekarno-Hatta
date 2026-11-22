# Design Document: Dashboard Hero Card & Title Emerald Green Glow Effect

**Date:** 2026-11-23  
**Status:** Approved by User  
**Author:** Antigravity  

---

## 1. Intent & Scope
Provide a sophisticated, non-basic emerald green hover glow effect on the main Airport Hub Bento card (`#bento-airport-hero`) and its airport title (`h1[data-i18n="hero_title"]`) on the dashboard (`index.html`), visually harmonizing with the emerald theme used in the Airlines directory (`#059669`, `#10b981`, `#6ee7b7`).

---

## 2. Visual & Interaction Specifications

### 2.1 Bento Airport Hero Card (`#bento-airport-hero`)
- **Default State:**
  - Transition properties: `border-color 0.4s ease, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`.
- **Hover State (`#bento-airport-hero:hover`):**
  - **Border:** `border-color: #6ee7b7 !important;`
  - **Ambient Glow Behind Card:** `box-shadow: 0 20px 45px rgba(5, 150, 105, 0.16), 0 0 35px rgba(16, 185, 129, 0.14) !important;`
  - **Micro-elevation:** `transform: translateY(-2px);`
  - **Batik Watermark Interaction (`.hero-batik-watermark`):** Opacity increases subtly on hover with a smooth scale (`transform: scale(1.03)`).

### 2.2 Airport Title (`#bento-airport-hero h1`, `[data-i18n="hero_title"]`)
- **Default State:**
  - Transition properties: `color 0.35s cubic-bezier(0.16, 1, 0.3, 1), text-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)`.
  - Display: `inline-block`.
- **Hover State (`#bento-airport-hero:hover h1`, or direct hover on title):**
  - **Color:** `color: #059669 !important;` (Matching Airlines Emerald Theme).
  - **Luminous Glow:** `text-shadow: 0 0 16px rgba(16, 185, 129, 0.45), 0 0 32px rgba(5, 150, 105, 0.22);`
  - **Micro-lift:** `transform: translateY(-1px);`

---

## 3. Files Touched
- `assets/css/style.css`: Add CSS rules for `#bento-airport-hero:hover`, `#bento-airport-hero:hover h1`, and `#bento-airport-hero:hover .hero-batik-watermark`.
- `tests/test_hero_glow.js`: New test suite verifying that the hover glow styles exist in `style.css` and use the approved emerald colors.

---

## 4. Verification
- `node tests/test_hero_glow.js` passes.
- All existing 27 test suites pass 100%.
- Visual browser verification confirms the card and title illuminate emerald green on hover.
