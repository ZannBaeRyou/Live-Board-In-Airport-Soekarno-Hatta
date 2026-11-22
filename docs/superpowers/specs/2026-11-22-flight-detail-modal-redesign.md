# Design Document: Flight Detail Modal Renovation (Executive Airport FIDS HUD)

**Date:** 2026-11-22  
**Topic:** Flight Detail Modal Renovation  
**Status:** Ready for Approval  
**Author:** Antigravity & Fauzan Ayub  

---

## 1. Intent & The Why

Saat penumpang atau pengguna mengeklik baris penerbangan pada papan FIDS di terminal, tampilan popup modal yang ada saat ini terasa kaku, sempit, dan "memaksakan" bola bumi 3D di dalam kotak kecil berlatar putih dengan ruang kosong berlebih. Pengguna menginginkan renovasi antarmuka modal agar lebih elegan, informatif, proporsional, serta mengusung tema warna khas terminal masing-masing dan mendukung penuh dwibahasa (ID/EN).

---

## 2. Goals, Non-Goals & Anti-Goals

### Goals
- **Menghadirkan Tampilan Executive Airport FIDS HUD:** Desain flat modern berstandar bandara bintang lima (ala Changi Jewel / Hamad Doha) yang fokus pada kecepatan akses data dan keterbacaan tinggi.
- **Data Operasional Riil (Menggantikan Bagasi Maks):** Menampilkan **Tipe Armada Pesawat** (contoh: *Airbus A330-300*, *Boeing 737-800*, dll.) yang otomatis diidentifikasi dari fungsi `getAircraftModel(f.number)`.
- **Adaptif Keberangkatan & Kedatangan:**
  - *Keberangkatan:* Highlight Gerbang (Gate) + Sisa Waktu Boarding, Sub-info: Tujuan, Konter Check-in, Tipe Armada.
  - *Kedatangan:* Highlight Sabuk Bagasi (Baggage Belt) + Waktu Mendarat, Sub-info: Asal, Pintu Keluar, Tipe Armada.
- **Pewarnaan Sesuai Terminal Masing-Masing:**
  - Terminal 1: Crimson Red (`#e11d48`)
  - Terminal 2: Royal Violet (`#7c3aed`)
  - Terminal 3: Amber Gold (`#d97706`)
- **Dukungan Penuh Dwibahasa (ID & EN):** Seluruh label teks, status, waktu, dan tombol aksi terintegrasi dengan `i18n.js` dan switcher bahasa `ID | EN`.
- **Berlaku di Semua Halaman Terminal:** Terminal 1 (`terminal1.html`), Terminal 2 (`terminal2.html`), dan Terminal 3 (`terminal3.html`).

### Non-Goals
- Tidak mempertahankan canvas 3D globe bumi yang lambat dan sempit di dalam modal (globe radar dieliminasi demi kejelasan informasi dan performa instan).
- Tidak mengubah database penerbangan dasar (memanfaatkan data `FLIGHT_DATABASE` yang sudah ada).

### Anti-Goals
- Tidak membuat modal terasa sempit/memanjang vertikal secara canggung di layar desktop.
- Tidak menyajikan data statis atau fiktif yang tidak didukung oleh data penerbangan (misal: jatah berat bagasi yang berbeda tiap tiket penumpang).

---

## 3. Approaches Considered & Trade-offs

### Opsi A: Digital Airline Boarding Pass
- **Konsep:** Kartu tiket boarding pass ala Apple Wallet dengan garis perforasi sobekan tiket.
- **Kelebihan:** Sangat realistis dan estetik.
- **Trade-off:** Lebih berorientasi pada penumpang perorangan daripada sistem display informasi bandara resmi (FIDS).

### Opsi B: Cockpit Flight Tracker (Bento Landscape 2 Kolom)
- **Konsep:** Modal melebar dengan kolom kiri data tiket dan kolom kanan radar globe 3D berlatar gelap.
- **Kelebihan:** Futuristik dan mempertahankan globe 3D.
- **Trade-off:** Globe 3D tetap memerlukan beban render canvas dan di layar mobile terpecah secara bertingkat.

### Opsi C: Executive Airport FIDS HUD (Dipilih & Disempurnakan)
- **Konsep:** Tampilan kartu informasi bandara modern dan ultra-clean yang berfokus pada apa yang paling dibutuhkan penumpang saat mengeklik jadwal: Gate besar, Sisa waktu, Konter, dan Tipe Pesawat.
- **Penyempurnaan yang Disepakati:**
  - Kotak "Bagasi Maks" diganti dengan **Tipe Armada Pesawat (Aircraft Model)**.
  - Mode adaptif untuk **Kedatangan** (menampilkan Sabuk Bagasi & Pintu Keluar).
  - Pewarnaan terikat dengan warna identitas terminal masing-masing (T1 Red, T2 Violet, T3 Gold).
  - Dwibahasa penuh (ID / EN).

---

## 4. Detailed Specification

### 4.1. Struktur Komponen Modal (`fids-detail-modal`)
```html
<div id="fids-detail-modal" class="fids-modal">
  <div class="fids-modal-content fids-modal-executive">
    <!-- Header: Terminal Badge, Maskapai, No Penerbangan, Status -->
    <div class="modal-header-row">...</div>

    <!-- Highlight Box: Gate & Sisa Waktu (Dep) ATAU Baggage Belt & Waktu Tiba (Arr) -->
    <div class="modal-highlight-banner terminal-theme-accent">...</div>

    <!-- 3-Column Info Grid -->
    <div class="modal-info-grid">
      <div class="info-card">Tujuan / Asal</div>
      <div class="info-card">Konter Check-in / Pintu Keluar</div>
      <div class="info-card">Tipe Armada Pesawat</div>
    </div>

    <!-- Close Button -->
    <button class="btn fids-modal-close">TUTUP DETAIL / CLOSE DETAILS</button>
  </div>
</div>
```

### 4.2. Logika Warna Terminal (`Terminal Color Mapping`)
- Ditentukan berdasarkan variabel `currentTerminal` atau attribute penerbangan:
  - Terminal 1: `--accent-color: #e11d48; --accent-bg: #ffe4e6; --accent-border: #fecdd3;`
  - Terminal 2: `--accent-color: #7c3aed; --accent-bg: #f5f3ff; --accent-border: #ddd6fe;`
  - Terminal 3: `--accent-color: #d97706; --accent-bg: #fffbeb; --accent-border: #fde68a;`

### 4.3. Kamus Multibahasa Tambahan (`i18n.js`)
- `modal_flight_status`: ID `"STATUS PENERBANGAN"`, EN `"FLIGHT STATUS"`
- `modal_gate_departure`: ID `"GERBANG KEBERANGKATAN"`, EN `"DEPARTURE GATE"`
- `modal_boarding_time_left`: ID `"SISA WAKTU BOARDING"`, EN `"TIME UNTIL BOARDING"`
- `modal_baggage_belt`: ID `"SABUK PENGAMBILAN BAGASI"`, EN `"BAGGAGE CLAIM BELT"`
- `modal_landing_time`: ID `"WAKTU MENDARAT"`, EN `"LANDED TIME"`
- `modal_destination_city`: ID `"KOTA TUJUAN"`, EN `"DESTINATION"`
- `modal_origin_city`: ID `"KOTA ASAL"`, EN `"ORIGIN"`
- `modal_counter_island`: ID `"KONTER CHECK-IN"`, EN `"CHECK-IN COUNTER"`
- `modal_exit_gate`: ID `"PINTU KELUAR"`, EN `"EXIT GATE"`
- `modal_aircraft_type`: ID `"TIPE ARMADA"`, EN `"AIRCRAFT MODEL"`

### 4.4. Perilaku Interaksi
- Klik baris tabel FIDS memanggil `openModal(flight)`.
- Mengkalkulasi estimasi sisa waktu (*countdown*) dari waktu penerbangan secara dinamis.
- Keyboard `Escape` dan klik di luar area modal (*backdrop*) menutup modal seketika.

---

## 5. Rencana Verifikasi
1. Verifikasi render di Terminal 1 (tema merah crimson `#e11d48`).
2. Verifikasi render di Terminal 2 (tema ungu violet `#7c3aed`).
3. Verifikasi render di Terminal 3 (tema kuning amber `#d97706`).
4. Verifikasi pergantian tab Keberangkatan vs Kedatangan (Gate vs Baggage Belt).
5. Verifikasi pergantian bahasa ID dan EN secara langsung.
6. Seluruh 23 test suites di `tests/*.js` tetap lulus 100%.
