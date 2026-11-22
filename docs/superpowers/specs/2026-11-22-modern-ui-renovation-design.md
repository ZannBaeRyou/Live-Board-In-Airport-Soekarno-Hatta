# Design Document: Liveboard Modern UI/UX Renovation

**Date:** 2026-11-22  
**Topic:** Modern UI Renovation ("Vibe Coder" Aviation Bento Dashboard)  
**Status:** Approved by Reviewer & Ready for User Sign-Off  
**Project:** Liveboard (Soekarno-Hatta International Airport Flight Information Display System)  
**Target Repository:** `D:\Project\Liveboard`  

---

## 1. Intent & The "Why"
The current Liveboard user interface feels outdated, clunky, and generic ("slop") in modern developer and design circles. The goal is to completely overhaul the visual design and user experience of Liveboard into a high-end, modern, "vibe coder" aesthetic inspired by **Linear, Raycast, and Apple Flight Tracker / Flighty**. 

The new UI must feel fast, premium, purposeful, and technologically sophisticated, with zero visual clutter or tacky pseudo-futuristic gimmicks.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Modern Aviation Bento Grid on Homepage (`index.html`)**: Replace the dated radar hero with an executive Bento Command Hub containing live airport metrics, dual clock (WIB & UTC), active runway telemetry, real-time METAR weather, and interactive terminal summary cards.
- **Homepage Quick Flight Search Bar**: Embed an instant search bar on the homepage that queries active flight schedules directly and provides an immediate autocomplete dropdown with terminal, gate, and status info. Clicking a result navigates directly to the terminal page (e.g. `terminal3.html?flight=GA206`) and auto-opens the 3D Canvas Globe modal.
- **Dedicated Modern FIDS Displays (`terminal1.html`, `terminal2.html`, `terminal3.html`)**: Renovate the flight board table from the old yellow-on-black digital split-flap look into an ultra-crisp, high-density aviation board featuring airline square emblems, aircraft models (e.g. B737-800, A350-900), monospace flight tags, gate badges, and pulsing-dot status indicators.
- **Unified Modern Design System (`style.css`)**: Implement a deep zinc/obsidian color palette (`#09090b`, `#13151b`), hairline 1px borders (`rgba(255,255,255,0.08)`), modern typography (Plus Jakarta Sans via Google Fonts), and silky segmented controls.
- **Dark Mode Only**: Pure dark-mode experience tailored for high-contrast dev aesthetic. The redundant light-mode toggle button is removed from the navbar.
- **Preserve All Existing Backend & Real-time Integrations**: Seamlessly maintain Supabase REST polling, AeroDataBox Edge Function sync (`?admin=fauzan`), Open-Meteo live weather, i18n language toggling (ID/EN), and the 3D Canvas Globe flight detail modal.

### Non-Goals
- Migrating to a heavy JS framework (React, Next.js, Vue) or bundling pipeline. The site remains zero-build, static, and easily deployable via cPanel/GitHub Pages.
- Altering the backend database schema in Supabase (`flights` and `system_config` tables remain untouched).

### Anti-Goals (What would make this a failure even if technically working)
- Retaining tacky AI "slop" aesthetics: over-saturated neon glowing borders, cheesy sci-fi radial animations, or low-contrast washed-out dark modes.
- Breaking responsive layout on mobile screens (especially horizontal tabs and flight table density).
- Degrading performance or adding render-blocking script dependencies.

---

## 3. Constraints
- **Hosting Environment**: The project is hosted on static hosting / cPanel (`liveboard.daeroom.my.id`). Code must run directly in the browser without an npm build/transpile step.
- **Data Source**: Live flight data is pulled from Supabase via `assets/js/supabase-service.js`. All UI components must bind directly to the existing `FLIGHT_DATABASE` and `simulateRealisticStatus` pipeline.
- **Localization (i18n)**: All new UI labels, headers, and bento tags must support `i18n.js` (`data-i18n` attributes for Indonesian and English).

---

## 4. Evaluated Approaches & Selection

### Approach 1: Modern CSS Design System & Layout Overhaul on Vanilla Stack (SELECTED)
- Re-architect `assets/css/style.css` using modern CSS variables, CSS grid for bento layouts, and modern sans typography.
- Refactor `index.html` markup for the Bento Grid and Quick Search bar.
- Refactor `terminal1.html`, `terminal2.html`, `terminal3.html` markup for the segmented controls and modern table container.
- Update `assets/js/main.js` and `assets/js/supabase-service.js` to render the modern flight rows with airline badges, aircraft info, and quick search listeners.
- **Why Chosen**: Maximum speed, zero build overhead, 100% compatibility with existing deployment and Supabase backend.

### Approach 2: Migrate to React + Tailwind CSS / shadcn/ui (REJECTED)
- Complete rewrite into a React/Vite single-page application.
- **Why Rejected**: Introduces unnecessary build step complexity, complicates simple cPanel file deployment, and risks breaking the custom Canvas 3D globe modal and Supabase REST hooks.

### Approach 3: Tailwind CSS via CDN (REJECTED)
- Injecting Tailwind CDN script into vanilla HTML.
- **Why Rejected**: Inefficient production payload, flash of unstyled content, and styling collisions with existing Bootstrap utilities.

---

## 5. Architectural & Component Specifications

### 5.1 Design System & Typography
- **Font Stack**: 
  - Primary Sans: `Plus Jakarta Sans`, system-ui.
  - Telemetry & Codes: `Roboto Mono`, `SFMono-Regular`, monospace (applied to flight numbers, gates, times, IATA/ICAO codes).
- **Color Tokens**:
  - Background Canvas: `#09090b` (Deep Zinc)
  - Card / Bento Surface: `#13151b` with 1px border `rgba(255, 255, 255, 0.08)`
  - Card Hover Surface: `#181a22` with border `rgba(255, 255, 255, 0.14)`
  - Text Primary: `#f8fafc`
  - Text Secondary: `#94a3b8`
  - Text Muted: `#64748b`
  - Accent T1 (Domestic): `#38bdf8` (Sky)
  - Accent T2 (LCC/Regional): `#a855f7` (Purple)
  - Accent T3 (International): `#f59e0b` (Amber/Gold)
  - Status Indicators:
    - Boarding: `#22c55e` (Emerald) with soft pulsing radial ring
    - Final Call: `#f59e0b` (Amber) with pulsing radial ring
    - Check-in: `#38bdf8` (Sky)
    - Scheduled: `#94a3b8` (Slate)
    - Delayed: `#f43f5e` (Rose)
    - Departed / Landed: `#64748b` (Muted)

### 5.2 Homepage Bento Grid (`index.html`)
The homepage grid is arranged in a responsive Bento layout:
1. **Hero Airport Card (2-column span on desktop)**:
   - Header: Airport Identity `Soekarno-Hatta International (CGK / WIII)`.
   - Dual Real-Time Clock: Local `WIB` (UTC+7) and Aviation Standard `UTC`.
   - Operations Telemetry: Active Runways (`07L/25R & 07R/25L Active`), Dynamic On-Time Performance (calculated as `(total - delayed) / total * 100%`), and Total Scheduled Flights counter.
2. **METAR Weather Bento Card (1-column span)**:
   - Live temperature (°C), weather icon/condition from Open-Meteo.
   - Wind speed/direction and atmospheric visibility.
3. **Quick Flight Search Bar**:
   - Integrated input with magnifying icon, placeholder `Cari nomor penerbangan, maskapai, kota tujuan...`.
   - Live client-side filter against aggregated `FLIGHT_DATABASE`: displays top 5 matching flights in a floating glassmorphic dropdown with instant terminal location and status badge.
   - Click journey: Directs to `terminalX.html?flight=<flight_no>`, automatically scrolling to the flight row and opening the 3D Canvas Globe modal.
4. **Terminal Bento Hub Cards (3 equal columns on desktop)**:
   - Terminal 1 (Sky Accent): Domestic hub, active flight counters, departure/arrival breakdown, direct link to `terminal1.html`.
   - Terminal 2 (Purple Accent): LCC & regional hub, active flight counters, direct link to `terminal2.html`.
   - Terminal 3 (Amber Accent): International & Garuda flagship, active flight counters, direct link to `terminal3.html`.

### 5.3 Dedicated Terminal FIDS Board (`terminal1-3.html`)
- **Navigation Breadcrumb & Controls**:
  - Segmented control pills for `[🛫 Keberangkatan | 🛬 Kedatangan]` with smooth transition.
  - In-page search input and status filter dropdown (`Semua Status`, `Boarding`, `Final Call`, etc.).
  - Auto-sync status badge (`Sync: 60s ⟳`).
- **Flight Schedule Table Rows**:
  - Time column: Scheduled time in bold monospace, timezone subtext.
  - Flight column: Square airline emblem (using `pics.avs.io` CDN or fallback IATA tag), bold flight number (`GA-206`), airline name, and client-side aircraft model lookup (e.g. `B737-800`, `A350-900`, `A320`) with graceful omission if unknown.
  - Destination / Origin column: City name and 3-letter IATA code.
  - Gate column: Clean tactile gate badge (`Gate 15` or `Counter A1-A6`).
  - Status column: Pill badge with pulsing dot indicator matching the color token.
  - Click interaction: Opens the 3D Canvas Globe modal with detailed flight telemetry.

### 5.4 Builder Decisions (Calls Settled)
- **Aircraft Model & Secondary Airport Names**: Sourced via client-side smart lookup mapping in `main.js` based on airline IATA codes (e.g. GA -> B737-800 / A330, SQ -> A350-900, QZ -> A320, JT -> B737-900ER). If not found, gracefully omitted without leaving awkward whitespace. Zero schema changes required.
- **Operations Telemetry (OTP & Runways)**: On-Time Performance is calculated dynamically from `FLIGHT_DATABASE`. Runways are displayed cleanly as `07L/25R & 07R/25L Active` as standard operations baseline.
- **Theme**: Dark Mode Only (obsidian/zinc). Legacy light mode overrides in CSS will be cleaned up.
- **Search Click Interaction**: Deep-links to the terminal page with URL parameter `?flight=...`, which automatically scrolls and highlights the selected flight and triggers the 3D globe modal.
