# Design Document: Airline Cards Hover Logo Watermark Animation

**Date:** 2026-11-22  
**Status:** Pending Approval  
**Scope:** Small Change (UI/UX enhancement in Airlines Directory `airlines.html`)  

---

## 1. Intent & Purpose
Enhance the user experience and visual polish of the Airlines Directory (`airlines.html`) by revealing the authentic, full-color logo of each airline upon hovering over its Bento card. When a user hovers over an airline card (e.g., Qatar Airways, Garuda Indonesia, Singapore Airlines), the official airline logo smoothly glides in from the top-right corner as a rich, colorful watermark.

---

## 2. Goals, Non-Goals & Anti-Goals
- **Goals:**
  - Support all 21 airlines active in `AIRLINE_DATABASE` with authentic, high-resolution logo assets.
  - Implement user-selected **Option B3 (Top-Right Diagonal Glide)**: 160px logo size, full brand color, 50% hover opacity, radial fade mask, and smooth cubic-bezier easing.
  - Maintain complete text contrast and readability: airline titles, categories, check-in zones, and action buttons remain 100% crisp and legible on top of the logo.
  - Zero layout shift: the logo is rendered via an absolute-positioned overlay with `pointer-events: none`.
  - 100% pass across all unit test suites.
- **Non-Goals:**
  - Altering FIDS schedule tables, search filters, or terminal docking tabs.
  - Replacing the standard mono-font IATA code badge (`GA`, `SQ`, `QR`).
- **Anti-Goals:**
  - No faded/monochrome grey logos: brand logos must maintain their authentic, vibrant colors as explicitly requested.
  - No text occlusion: watermark opacity must not exceed 0.55 or obscure underlying data.
  - No blocking network calls: images load asynchronously via CDN with lazy loading and error fallback.

---

## 3. Approaches Considered & Trade-offs
1. **Option A: Top-Right Floating Emblem Badge (48px pop-in)**
   - *Pros:* Clean, sharp, isolated in a small badge.
   - *Cons:* Did not feel immersive or cohesive with the large Bento aesthetic of Liveboard.
2. **Option B (Initial): Subtle Monochromatic Watermark (Bottom-Right)**
   - *Pros:* Minimalist.
   - *Cons:* Rejected by user — too small, faint grey silhouette, lacked visual presence.
3. **Option B1: Large Vibrant Watermark (180px Bottom-Right)**
   - *Pros:* Colorful and large.
   - *Cons:* Slightly interfered with the "Lihat Jadwal" action buttons at the bottom.
4. **Option B2: Extra Large Watermark (210px Center-Right)**
   - *Pros:* Highly prominent.
   - *Cons:* Heavy overlap with check-in zone details.
5. **Option B3: Top-Right Diagonal Glide Watermark (160px, Opacity 50%) — [SELECTED]**
   - *Pros:* Glides from the top-right corner smoothly behind the airline name and IATA badge, leaving the check-in details and buttons completely unobstructed. Full brand colors shine through with high visual appeal.

---

## 4. Technical Architecture & Implementation Details

### A. Data Schema (`assets/js/main.js`)
Update `AIRLINE_DATABASE` entries to include the `logo` property targeting the Kiwi CloudFront CDN (`https://images.kiwi.com/airlines/128/{CODE}.png`), with fallback support:
```javascript
{ 
  code: 'QR', 
  name: 'Qatar Airways', 
  country: 'Qatar', 
  category: '5-Star Airline Intl', 
  terminals: ['3'], 
  zone: 'Row A11 - A20 (Intl)', 
  contact: '(021) 550-2525', 
  website: 'https://www.qatarairways.com',
  logo: 'https://images.kiwi.com/airlines/128/QR.png'
}
```

### B. Card DOM Rendering (`initAirlinesDirectory`)
Inject the watermark container into `.airline-card-bento`:
```html
<div class="airline-card-bento h-100">
    <!-- Watermark Logo (Layer 1) -->
    <div class="airline-card-logo-watermark">
        <img src="${a.logo}" alt="${a.name}" loading="lazy" onerror="this.parentElement.style.display='none'">
    </div>

    <!-- Content (Layer 2, z-index: 2) -->
    <div class="airline-card-body-content">
        ... [Existing Badges, Name, Details, Buttons] ...
    </div>
</div>
```

### C. CSS Styling & Animation (`assets/css/style.css`)
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

---

## 5. Verification & Testing Plan
1. Create `tests/test_airline_logo_watermark.js` verifying:
   - All 21 airlines have a valid `logo` attribute in `AIRLINE_DATABASE`.
   - Card rendering logic injects `.airline-card-logo-watermark` with `onerror` fallback.
   - CSS rules for `.airline-card-logo-watermark` and hover transitions are present.
2. Run full 19 unit test suites (`node tests/*.js`).
3. Visual verification in browser subagent on both Desktop and Mobile viewports.
