# Design Spec: Dual Admin Manual Sync Buttons

- **Date:** 2026-11-22
- **Topic:** Dual Admin Manual Sync Trigger (Dashboard + Homepage `?admin=fauzan`)
- **Status:** Proposed (Awaiting Approval)

## 1. Intent & Why
The user wants to manually trigger flight schedule synchronization from the AeroDataBox API via RapidAPI without burning through their free tier quota (400 API units/month). The user chose **Option 3: Dual Sync Buttons**, keeping the legacy `?admin=fauzan` quick-access button on the homepage while also adding a dedicated manual sync button inside the newly secured `admin-status.html` dashboard.

## 2. Goals & Non-Goals
### Goals
- Add a prominent, responsive "Tarik Jadwal Sekarang" (Manual Sync) button inside `admin-status.html`.
- Preserve the existing `initSyncButton()` in `assets/js/main.js` activated by `?admin=fauzan`.
- Provide clear user confirmation (reminding that 1 sync uses ~2 API units), visual loading spinner, and instant status/log refresh upon completion.

### Non-Goals
- Changing the secret parameter `?admin=fauzan` to something else (kept as-is for backward compatibility).
- Automatically running cron jobs on client load (sync remains strictly manual on-demand).

## 3. Approaches Considered
1. **Approach 1: Homepage Only (`?admin=fauzan`)**
   - *Pros:* Quick access from the main flight board.
   - *Cons:* Disconnected from `admin-status.html` where sync logs and error messages are viewed.
2. **Approach 2: Dashboard Only (`admin-status.html`)**
   - *Pros:* Centralized under PIN security.
   - *Cons:* Slower workflow when the user just wants a rapid update while viewing the live board.
3. **Approach 3: Dual Sync Buttons (Selected)**
   - *Pros:* Gives full flexibility: the user can sync directly while monitoring logs in `admin-status.html`, or trigger it instantly from `index.html?admin=fauzan`.
   - *Cons:* Slight logic duplication, easily mitigated by calling the same Edge Function endpoint.

## 4. Implementation Details
### In `admin-status.html`:
- In the top header or the `API Sync Status` card, add a button:
  `<button id="btn-manual-sync" class="btn btn-warning btn-sm" onclick="triggerManualSync()"><i class="fa-solid fa-cloud-arrow-down me-1"></i> Tarik Jadwal Sekarang</button>`
- Implement `triggerManualSync()`:
  1. Confirmation modal/alert ("Tarik jadwal penerbangan hari ini dari satelit AeroDataBox? Memakan 2 kuota API").
  2. Disable button & show spinner `<i class="fa-solid fa-spinner fa-spin"></i>`.
  3. POST to `https://qqeyrvrekivrribftvwk.supabase.co/functions/v1/sync-flights`.
  4. On response: alert success/error, re-enable button, and automatically invoke `loadStatusData()` to refresh logs and stats immediately.

### In `assets/js/main.js`:
- Keep `initSyncButton()` fully functional and synchronized with the latest Edge Function headers.
