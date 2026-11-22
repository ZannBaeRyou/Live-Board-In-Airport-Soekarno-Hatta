# Design Spec: Cyber-Aviation Full UI Renovation

**Date:** 2026-11-22  
**Status:** In Review (Builder Check)  
**Author:** Antigravity  

---

## 1. Intent & Context
While the Liveboard homepage Executive Bento Command Hub and integrated flight search were successfully upgraded to modern standards, the rest of the application remains un-renovated and exhibits critical layout and styling bugs:
1. **Terminal FIDS Board Pages (`terminal1.html`, `terminal2.html`, `terminal3.html`):** A CSS Grid conflict on `.fids-row-modern` forces the entire flight row into an 85px column, squishing all text into an unreadable blob on the far left.
2. **Flight Details 3D Radar Globe Modal (`#fids-detail-modal`):** Legacy theme detection in `i18n.js` reads OS `prefers-color-scheme: light`, leaking a blinding white/cream background onto the 3D globe canvas on dark modal backdrop. Additionally, harsh yellow borders, retro amber telemetry boxes, and dated progress steppers contradict modern design sensibilities.
3. **Airlines Directory (`airlines.html`):** Uses outdated Bootstrap card layouts with harsh yellow outlines.
4. **Quick Search Data Normalization:** `initQuickSearch()` queries `flight_no` instead of `number` and lacks `terminal` assignment, breaking flight number searches and deep-links.

The user explicitly selected **Opsi A: Cyber-Aviation Radar (High-Tech Flight Ops)**. This specification details the end-to-end renovation of all remaining pages and components.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Fix FIDS Table Layout:** Remove conflicting CSS Grid from `.fids-row-modern`, making flight rows 100% full-width, perfectly aligned with the 6-column header (`WAKTU`, `PENERBANGAN`, `TUJUAN/ASAL`, `GERBANG`, `ESTIMASI`, `STATUS`).
- **Cyber-Aviation Visual Language:** Deep obsidian canvas (`#09090b`), surface zinc (`#13151b`), hairline 1px borders, electric cyan (`#38bdf8`) accents, emerald pulses (`#22c55e`), and sharp Roboto Mono typography.
- **Lock Dark Mode Universally:** Enforce `data-theme="dark"` permanently in `assets/js/i18n.js` to eliminate all light mode theme leakage.
- **Cockpit Radar 3D Globe Overhaul:** Render the 3D globe in dark tactical radar mode (obsidian space, deep navy ocean `#080f21`, glowing neon great-circle flight arc, cyan coordinate graticule, and transparent digital cockpit HUD for speed, altitude, heading, distance).
- **Modern Modal & Flight Stepper:** 1px hairline border, subtle backdrop blur, and neon glowing flight progress stepper replacing retro orange bars.
- **Airlines Fleet Bento Cards:** Transform `airlines.html` into a modern fleet directory with square emblems, IATA/ICAO badges, fleet aircraft types, operational terminal tags, and quick-filter buttons.
- **Quick Search Data Sync:** Normalize flight objects in `main.js` so searches by flight number (e.g. `GA 204`, `JT 206`) work instantly and deep-link to the right terminal.
- **i18n Parity:** Ensure 100% translation key coverage in Indonesian (ID) and English (EN).

### Non-Goals
- Do NOT alter `index.html` layout (user confirmed: "tampilan depannya udh oke").
- Do NOT introduce npm build steps or frameworks (React, Tailwind). Keep 100% pure Vanilla HTML/CSS/JS for direct cPanel deployment.
- Do NOT alter backend Supabase table schemas.

### Anti-Goals
- No garish yellow borders (`#ffc107`).
- No light mode flash or cream-colored canvas on dark backgrounds.
- No clipped dropdowns or broken responsive wrappers.

---

## 3. Approaches Considered
- **Approach A (Cyber-Aviation Radar — SELECTED):** Glass Cockpit / ATC radar aesthetics, electric cyan accents, sharp monospace, dark tactical 3D radar globe, neon status pulses.
- **Approach B (Executive Aviation):** Muted champagne gold, velvet darks, serif/luxury styling. (Rejected by user).
- **Approach C (Minimalist Linear):** Pure monochromatic zinc, no color except status dots. (Rejected by user).

---

## 4. Detailed Component Specifications

### 4.1 Terminal FIDS Board Pages (`terminal1.html`, `terminal2.html`, `terminal3.html`)
- **Terminal Hero Header:**
  - Modernized minimalist telemetry header replacing dated gradient banner.
  - Displays Terminal Badge (T1 Cyan `#38bdf8`, T2 Purple `#a855f7`, T3 Gold `#f59e0b`), dual live clocks (WIB & UTC), and active airlines overview.
- **Sticky Controls Bar:**
  - Segmented pill controls for Keberangkatan / Kedatangan with active indicator.
  - Search input with cyan focus glow and clear button.
  - Custom dark select filter for flight status.
- **FIDS Table Alignment:**
  - Header: `.fids-board-header` 6-column grid:
    1. `col-md-1` (10%): Waktu (WIB)
    2. `col-md-3` (25%): Penerbangan & Maskapai
    3. `col-md-3` (25%): Tujuan / Asal
    4. `col-md-2` (15%): Gerbang / Konter
    5. `col-md-1` (10%): Estimasi
    6. `col-md-2` (15%): Status
  - Row fix: Change `.fids-row-modern` in `assets/css/style.css` to `display: block; width: 100%;` (removing `grid-template-columns: 85px ...`).
  - Left border status indicator:
    - Boarding: `border-left: 3px solid #22c55e;`
    - Final Call: `border-left: 3px solid #f59e0b;`
    - Delayed: `border-left: 3px solid #f43f5e;`
    - Other: `border-left: 3px solid transparent;`
  - Airline Emblem: 34x34px square with rounded corners and subtle hairline border.
  - Aircraft Model: Automatically resolved via `getAircraftModel(flight.number, flight.airline)` and displayed in subtle monospace text next to airline name.

### 4.2 Flight Details Modal & 3D Globe Radar (`#fids-detail-modal` & `main.js`)
- **Universal Dark Mode Lock:**
  - In `assets/js/i18n.js`: Enforce `currentTheme = 'dark'` and `document.documentElement.setAttribute('data-theme', 'dark')`. Deprecate `getSystemTheme()` light sniffing.
- **Modal Styling:**
  - Background: `rgba(15, 17, 23, 0.95)`, `backdrop-filter: blur(16px)`, border: `1px solid var(--border-subtle)` (removing yellow border).
  - Modern drag-handle for touch gesture swipe-to-close.
  - Header: Brand font flight number with glowing status badge.
- **3D Globe Radar Canvas (`startFlightMapAnimation` in `main.js`):**
  - Space background: `#09090b` (matches app canvas).
  - Ocean sphere: `#080f21` (deep tactical navy).
  - Atmosphere halo: Radial cyan glow `rgba(56, 189, 248, 0.25)`.
  - Coordinates graticule: Lat/Lon grid in `rgba(56, 189, 248, 0.1)`.
  - Land masses: Real GeoJSON stroke `rgba(56, 189, 248, 0.45)`, fill `rgba(56, 189, 248, 0.06)`.
  - Flight path: Great circle arc in glowing cyan (`#38bdf8`) with animated heading chevron.
  - HUD Telemetry Overlay: Replaces retro amber box with digital cockpit glass HUD (Speed, Alt, Heading, Distance) using monospace typography in a translucent pill badge (`background: rgba(9, 9, 11, 0.85); border: 1px solid rgba(56, 189, 248, 0.25)`).
- **Flight Stepper (Progress Tracker):**
  - Clean horizontal timeline with 4 states: *Check-in*, *Boarding*, *Final Call*, *Departed*.
  - Gradient progress fill with pulsing active checkpoint.
- **Flight Specifications Cards:**
  - 4 clean info cards (Scheduled, Estimated, Gate, Counter) with uppercase sublabels.

### 4.3 Airlines Directory Page (`airlines.html`)
- **Hero Header:**
  - Modernized header matching executive styling with live airline count.
- **Search & Filter Bar:**
  - Filter by terminal (All, Terminal 1, Terminal 2, Terminal 3).
  - Real-time search filter for airline name, IATA code, and country.
- **Airlines Fleet Bento Cards:**
  - Grid of modern cards with square airline logos.
  - Key metadata: IATA/ICAO code badge, primary terminal badge, typical fleet aircraft (e.g. `B737-800, B777-300ER, A330neo`), and operational destinations.
  - "Lihat Penerbangan" action button linking directly to that airline's terminal board.

### 4.4 Quick Search Data Fix (`assets/js/main.js`)
- In `initQuickSearch()`:
  - Aggregate flights with explicit terminal assignments:
    ```javascript
    const allFlights = [
        ...TERMINAL_1_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '1' })),
        ...TERMINAL_2_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '2' })),
        ...TERMINAL_3_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '3' }))
    ];
    ```
  - Normalize query matching using `f.number || f.flight_no`.
  - Construct result links using `terminal${f.terminal}.html?flight=${encodeURIComponent(f.number || f.flight_no)}`.

### 4.5 Builder Check Decisions & Refinements
Following the builder review check, the following architectural choices have been codified:
1. **Airlines Directory Scope & Filtering:**
   - `AIRLINE_DATABASE` encompasses all active tenant airlines across CGK (including Terminal 2 LCC carriers: Scoot, Jetstar Asia, Cebu Pacific, Super Air Jet, Wings Air, Sriwijaya Air, NAM Air) so terminal filter buttons (All, T1, T2, T3) render complete fleet sets.
   - For carriers operating across multiple terminals (e.g., Lion Air at T1 & T2), the bento card displays operational badges for both terminals.
   - Clicking "Lihat Penerbangan" links to `terminal{N}.html?search={AirlineName}`.
2. **Terminal Board Search Query Parameter Support:**
   - `initFIDSBoard()` in `main.js` checks for `?search=` or `?airline=` in `window.location.search`. When present, it automatically populates `#fids-search-input` and executes `renderFIDS()`.
3. **Terminal Hero Header Airline Badges:**
   - Displays a row of sleek airline emblem pill badges. Clicking an emblem filters the board below directly to that carrier.
4. **Dual-Mode Flight Stepper Lifecycle:**
   - Departures: *Check-in* → *Boarding* → *Final Call* → *Departed*.
   - Arrivals: *Scheduled* → *In Flight* → *Landed* → *Baggage Claim*.
   - Both modes share the cyber-aviation glowing cyan/emerald checkpoint and line styling.

---

## 5. What is Left to the Builder
- Precise pixel padding adjustments for mobile viewport breakpoints (<768px).
- Execution ordering and test writing for regression prevention.
