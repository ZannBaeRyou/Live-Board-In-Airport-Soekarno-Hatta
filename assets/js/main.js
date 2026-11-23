/**
 * CGK Soekarno-Hatta FIDS (Flight Information Display System)
 * Supports Terminal 1, 2, and 3
 * Controls tabs, search filters, live clock, and flight details tracking modal.
 */

// Utility: XSS Protection / Sanitization
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ============================================
// FLIGHT DATABASES PER TERMINAL
// ============================================

let TERMINAL_1_FLIGHTS = [
    // DEPARTURES - Terminal 1 (Domestic: Lion Air, Batik Air, Wings Air, Sriwijaya, NAM Air)
    { id: 't1-dep-jt510', type: 'departure', number: 'JT 510', airline: 'Lion Air', logo: '✈️', destination: 'Surabaya (SUB)', time: '06:15', estimatedTime: '06:15 (On Time)', status: 'Departed', progress: 100, gate: 'Gate A1', counter: 'Row 1-4' },
    { id: 't1-dep-jt370', type: 'departure', number: 'JT 370', airline: 'Lion Air', logo: '✈️', destination: 'Yogyakarta (JOG)', time: '07:00', estimatedTime: '07:00 (On Time)', status: 'Departed', progress: 100, gate: 'Gate A3', counter: 'Row 1-4' },
    { id: 't1-dep-id6570', type: 'departure', number: 'ID 6570', airline: 'Batik Air', logo: '✈️', destination: 'Bali (DPS)', time: '08:20', estimatedTime: '08:20 (On Time)', status: 'Departed', progress: 100, gate: 'Gate A5', counter: 'Row 5-8' },
    { id: 't1-dep-iw1812', type: 'departure', number: 'IW 1812', airline: 'Wings Air', logo: '✈️', destination: 'Semarang (SRG)', time: '09:30', estimatedTime: '09:45 (Estimasi)', status: 'Delayed', progress: 10, gate: 'Gate B2', counter: 'Row 9-10' },
    { id: 't1-dep-jt690', type: 'departure', number: 'JT 690', airline: 'Lion Air', logo: '✈️', destination: 'Makassar (UPG)', time: '10:45', estimatedTime: '10:45 (On Time)', status: 'Boarding', progress: 70, gate: 'Gate A7', counter: 'Row 1-4' },
    { id: 't1-dep-sj234', type: 'departure', number: 'SJ 234', airline: 'Sriwijaya Air', logo: '✈️', destination: 'Palembang (PLM)', time: '11:30', estimatedTime: '11:30 (On Time)', status: 'Check-in', progress: 30, gate: 'Gate B4', counter: 'Row 11-14' },
    { id: 't1-dep-in277', type: 'departure', number: 'IN 277', airline: 'NAM Air', logo: '✈️', destination: 'Banjarmasin (BDJ)', time: '12:15', estimatedTime: '12:15 (On Time)', status: 'Check-in', progress: 25, gate: 'Gate B6', counter: 'Row 15-16' },
    { id: 't1-dep-jt860', type: 'departure', number: 'JT 860', airline: 'Lion Air', logo: '✈️', destination: 'Balikpapan (BPN)', time: '13:00', estimatedTime: '13:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A2', counter: 'Row 1-4' },
    { id: 't1-dep-id6130', type: 'departure', number: 'ID 6130', airline: 'Batik Air', logo: '✈️', destination: 'Surabaya (SUB)', time: '14:30', estimatedTime: '14:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A4', counter: 'Row 5-8' },
    { id: 't1-dep-jt174', type: 'departure', number: 'JT 174', airline: 'Lion Air', logo: '✈️', destination: 'Medan (KNO)', time: '15:45', estimatedTime: '15:45 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A6', counter: 'Row 1-4' },
    { id: 't1-dep-sj568', type: 'departure', number: 'SJ 568', airline: 'Sriwijaya Air', logo: '✈️', destination: 'Pontianak (PNK)', time: '17:00', estimatedTime: '17:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate B3', counter: 'Row 11-14' },
    { id: 't1-dep-jt314', type: 'departure', number: 'JT 314', airline: 'Lion Air', logo: '✈️', destination: 'Solo (SOC)', time: '18:30', estimatedTime: '18:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A8', counter: 'Row 1-4' },
    { id: 't1-dep-id7510', type: 'departure', number: 'ID 7510', airline: 'Batik Air', logo: '✈️', destination: 'Bali (DPS)', time: '20:00', estimatedTime: '20:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A5', counter: 'Row 5-8' },
    { id: 't1-dep-jt918', type: 'departure', number: 'JT 918', airline: 'Lion Air', logo: '✈️', destination: 'Manado (MDC)', time: '21:15', estimatedTime: '21:15 (On Time)', status: 'Cancelled', progress: 0, gate: 'Gate -', counter: 'Row -' },
    { id: 't1-dep-jt740', type: 'departure', number: 'JT 740', airline: 'Lion Air', logo: '✈️', destination: 'Kupang (KOE)', time: '22:30', estimatedTime: '22:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A1', counter: 'Row 1-4' },
    // ARRIVALS - Terminal 1
    { id: 't1-arr-jt511', type: 'arrival', number: 'JT 511', airline: 'Lion Air', logo: '✈️', origin: 'Surabaya (SUB)', time: '07:30', estimatedTime: '07:25 (Aktual)', status: 'Landed', progress: 100, gate: 'Gate A1', baggage: 'Belt 1' },
    { id: 't1-arr-jt371', type: 'arrival', number: 'JT 371', airline: 'Lion Air', logo: '✈️', origin: 'Yogyakarta (JOG)', time: '08:15', estimatedTime: '08:15 (Aktual)', status: 'Landed', progress: 100, gate: 'Gate A3', baggage: 'Belt 2' },
    { id: 't1-arr-id6571', type: 'arrival', number: 'ID 6571', airline: 'Batik Air', logo: '✈️', origin: 'Bali (DPS)', time: '09:00', estimatedTime: '09:10 (Aktual)', status: 'Baggage Claim', progress: 100, gate: 'Gate A5', baggage: 'Belt 3' },
    { id: 't1-arr-iw1813', type: 'arrival', number: 'IW 1813', airline: 'Wings Air', logo: '✈️', origin: 'Semarang (SRG)', time: '10:30', estimatedTime: '10:30 (Aktual)', status: 'Landed', progress: 100, gate: 'Gate B2', baggage: 'Belt 1' },
    { id: 't1-arr-jt691', type: 'arrival', number: 'JT 691', airline: 'Lion Air', logo: '✈️', origin: 'Makassar (UPG)', time: '12:15', estimatedTime: '12:40 (Estimasi)', status: 'Delayed', progress: 55, gate: 'Gate A7', baggage: 'Belt 2' },
    { id: 't1-arr-sj235', type: 'arrival', number: 'SJ 235', airline: 'Sriwijaya Air', logo: '✈️', origin: 'Palembang (PLM)', time: '13:30', estimatedTime: '13:30 (On Time)', status: 'Scheduled', progress: 20, gate: 'Gate B4', baggage: 'Belt 4' },
    { id: 't1-arr-jt861', type: 'arrival', number: 'JT 861', airline: 'Lion Air', logo: '✈️', origin: 'Balikpapan (BPN)', time: '15:00', estimatedTime: '15:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A2', baggage: 'Belt 1' },
    { id: 't1-arr-id6131', type: 'arrival', number: 'ID 6131', airline: 'Batik Air', logo: '✈️', origin: 'Surabaya (SUB)', time: '16:45', estimatedTime: '16:45 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A4', baggage: 'Belt 3' },
    { id: 't1-arr-jt175', type: 'arrival', number: 'JT 175', airline: 'Lion Air', logo: '✈️', origin: 'Medan (KNO)', time: '18:00', estimatedTime: '18:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A6', baggage: 'Belt 2' },
    { id: 't1-arr-sj569', type: 'arrival', number: 'SJ 569', airline: 'Sriwijaya Air', logo: '✈️', origin: 'Pontianak (PNK)', time: '19:30', estimatedTime: '19:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate B3', baggage: 'Belt 4' },
    { id: 't1-arr-jt315', type: 'arrival', number: 'JT 315', airline: 'Lion Air', logo: '✈️', origin: 'Solo (SOC)', time: '20:30', estimatedTime: '20:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate A8', baggage: 'Belt 1' },
    { id: 't1-arr-jt919', type: 'arrival', number: 'JT 919', airline: 'Lion Air', logo: '✈️', origin: 'Manado (MDC)', time: '22:00', estimatedTime: '22:00 (On Time)', status: 'Cancelled', progress: 0, gate: 'Gate -', baggage: 'Belt -' },
];

let TERMINAL_2_FLIGHTS = [
    // DEPARTURES - Terminal 2 (AirAsia, Lion Intl, Scoot, Jetstar, Cebu Pacific, etc.)
    { id: 't2-dep-qz7520', type: 'departure', number: 'QZ 7520', airline: 'AirAsia Indonesia', logo: '✈️', destination: 'Kuala Lumpur (KUL)', time: '06:45', estimatedTime: '06:45 (On Time)', status: 'Departed', progress: 100, gate: 'Gate D1', counter: 'Row E01-E06' },
    { id: 't2-dep-xt272', type: 'departure', number: 'XT 272', airline: 'Indonesia AirAsia X', logo: '✈️', destination: 'Melbourne (MEL)', time: '07:30', estimatedTime: '07:30 (On Time)', status: 'Departed', progress: 100, gate: 'Gate D5', counter: 'Row E01-E06' },
    { id: 't2-dep-jt2640', type: 'departure', number: 'JT 2640', airline: 'Lion Air (Intl)', logo: '✈️', destination: 'Singapore (SIN)', time: '08:40', estimatedTime: '08:40 (On Time)', status: 'Departed', progress: 100, gate: 'Gate D3', counter: 'Row F01-F06' },
    { id: 't2-dep-tr272', type: 'departure', number: 'TR 272', airline: 'Scoot', logo: '✈️', destination: 'Singapore (SIN)', time: '09:20', estimatedTime: '09:45 (Estimasi)', status: 'Delayed', progress: 15, gate: 'Gate D7', counter: 'Row G01-G04' },
    { id: 't2-dep-3k248', type: 'departure', number: '3K 248', airline: 'Jetstar Asia', logo: '✈️', destination: 'Singapore (SIN)', time: '10:50', estimatedTime: '10:50 (On Time)', status: 'Boarding', progress: 65, gate: 'Gate D2', counter: 'Row G05-G08' },
    { id: 't2-dep-5j780', type: 'departure', number: '5J 780', airline: 'Cebu Pacific', logo: '✈️', destination: 'Manila (MNL)', time: '11:30', estimatedTime: '11:30 (On Time)', status: 'Final Call', progress: 85, gate: 'Gate D8', counter: 'Row H01-H04' },
    { id: 't2-dep-qz267', type: 'departure', number: 'QZ 267', airline: 'AirAsia Indonesia', logo: '✈️', destination: 'Bangkok (DMK)', time: '12:45', estimatedTime: '12:45 (On Time)', status: 'Check-in', progress: 35, gate: 'Gate D4', counter: 'Row E01-E06' },
    { id: 't2-dep-jt2770', type: 'departure', number: 'JT 2770', airline: 'Lion Air (Intl)', logo: '✈️', destination: 'Jeddah (JED)', time: '14:00', estimatedTime: '14:00 (On Time)', status: 'Check-in', progress: 25, gate: 'Gate D6', counter: 'Row F01-F06' },
    { id: 't2-dep-qz540', type: 'departure', number: 'QZ 540', airline: 'AirAsia Indonesia', logo: '✈️', destination: 'Bali (DPS)', time: '15:15', estimatedTime: '15:15 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D1', counter: 'Row E01-E06' },
    { id: 't2-dep-tr274', type: 'departure', number: 'TR 274', airline: 'Scoot', logo: '✈️', destination: 'Singapore (SIN)', time: '16:30', estimatedTime: '16:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D7', counter: 'Row G01-G04' },
    { id: 't2-dep-qz320', type: 'departure', number: 'QZ 320', airline: 'AirAsia Indonesia', logo: '✈️', destination: 'Ho Chi Minh (SGN)', time: '18:00', estimatedTime: '18:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D3', counter: 'Row E01-E06' },
    { id: 't2-dep-jt2800', type: 'departure', number: 'JT 2800', airline: 'Lion Air (Intl)', logo: '✈️', destination: 'Kuala Lumpur (KUL)', time: '19:45', estimatedTime: '19:45 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D5', counter: 'Row F01-F06' },
    { id: 't2-dep-qz188', type: 'departure', number: 'QZ 188', airline: 'AirAsia Indonesia', logo: '✈️', destination: 'Taipei (TPE)', time: '21:00', estimatedTime: '21:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D2', counter: 'Row E01-E06' },
    { id: 't2-dep-5j781', type: 'departure', number: '5J 781', airline: 'Cebu Pacific', logo: '✈️', destination: 'Manila (MNL)', time: '22:30', estimatedTime: '22:30 (On Time)', status: 'Cancelled', progress: 0, gate: 'Gate -', counter: 'Row -' },
    // ARRIVALS - Terminal 2
    { id: 't2-arr-qz7521', type: 'arrival', number: 'QZ 7521', airline: 'AirAsia Indonesia', logo: '✈️', origin: 'Kuala Lumpur (KUL)', time: '07:15', estimatedTime: '07:10 (Aktual)', status: 'Landed', progress: 100, gate: 'Gate D1', baggage: 'Belt 5' },
    { id: 't2-arr-xt273', type: 'arrival', number: 'XT 273', airline: 'Indonesia AirAsia X', logo: '✈️', origin: 'Melbourne (MEL)', time: '08:00', estimatedTime: '08:05 (Aktual)', status: 'Baggage Claim', progress: 100, gate: 'Gate D5', baggage: 'Belt 7' },
    { id: 't2-arr-jt2641', type: 'arrival', number: 'JT 2641', airline: 'Lion Air (Intl)', logo: '✈️', origin: 'Singapore (SIN)', time: '09:30', estimatedTime: '09:30 (Aktual)', status: 'Landed', progress: 100, gate: 'Gate D3', baggage: 'Belt 6' },
    { id: 't2-arr-tr273', type: 'arrival', number: 'TR 273', airline: 'Scoot', logo: '✈️', origin: 'Singapore (SIN)', time: '10:45', estimatedTime: '10:45 (Aktual)', status: 'Landed', progress: 100, gate: 'Gate D7', baggage: 'Belt 8' },
    { id: 't2-arr-3k249', type: 'arrival', number: '3K 249', airline: 'Jetstar Asia', logo: '✈️', origin: 'Singapore (SIN)', time: '12:00', estimatedTime: '12:25 (Estimasi)', status: 'Delayed', progress: 50, gate: 'Gate D2', baggage: 'Belt 5' },
    { id: 't2-arr-5j779', type: 'arrival', number: '5J 779', airline: 'Cebu Pacific', logo: '✈️', origin: 'Manila (MNL)', time: '13:15', estimatedTime: '13:15 (On Time)', status: 'Landed', progress: 100, gate: 'Gate D8', baggage: 'Belt 7' },
    { id: 't2-arr-qz268', type: 'arrival', number: 'QZ 268', airline: 'AirAsia Indonesia', logo: '✈️', origin: 'Bangkok (DMK)', time: '14:30', estimatedTime: '14:30 (On Time)', status: 'Scheduled', progress: 15, gate: 'Gate D4', baggage: 'Belt 6' },
    { id: 't2-arr-jt2771', type: 'arrival', number: 'JT 2771', airline: 'Lion Air (Intl)', logo: '✈️', origin: 'Jeddah (JED)', time: '16:00', estimatedTime: '16:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D6', baggage: 'Belt 8' },
    { id: 't2-arr-qz541', type: 'arrival', number: 'QZ 541', airline: 'AirAsia Indonesia', logo: '✈️', origin: 'Bali (DPS)', time: '17:30', estimatedTime: '17:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D1', baggage: 'Belt 5' },
    { id: 't2-arr-tr275', type: 'arrival', number: 'TR 275', airline: 'Scoot', logo: '✈️', origin: 'Singapore (SIN)', time: '19:00', estimatedTime: '19:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D7', baggage: 'Belt 6' },
    { id: 't2-arr-qz321', type: 'arrival', number: 'QZ 321', airline: 'AirAsia Indonesia', logo: '✈️', origin: 'Ho Chi Minh (SGN)', time: '20:30', estimatedTime: '20:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate D3', baggage: 'Belt 7' },
    { id: 't2-arr-qz189', type: 'arrival', number: 'QZ 189', airline: 'AirAsia Indonesia', logo: '✈️', origin: 'Taipei (TPE)', time: '22:15', estimatedTime: '22:15 (On Time)', status: 'Cancelled', progress: 0, gate: 'Gate -', baggage: 'Belt -' },
];

let TERMINAL_3_FLIGHTS = [
    // DEPARTURES - Terminal 3 (Garuda, Citilink, SQ, EK, QR, NH, etc.)
    { id: 't3-dep-ga204', type: 'departure', number: 'GA 204', airline: 'Garuda Indonesia', logo: '✈️', destination: 'Bali (DPS)', time: '08:30', estimatedTime: '08:30 (On Time)', status: 'Departed', progress: 100, gate: 'Gate 11', counter: 'Row F01-F08' },
    { id: 't3-dep-sq951', type: 'departure', number: 'SQ 951', airline: 'Singapore Airlines', logo: '✈️', destination: 'Singapore (SIN)', time: '09:15', estimatedTime: '09:15 (On Time)', status: 'Departed', progress: 100, gate: 'Gate 22', counter: 'Row C11-C18' },
    { id: 't3-dep-ga182', type: 'departure', number: 'GA 182', airline: 'Garuda Indonesia', logo: '✈️', destination: 'Medan (KNO)', time: '10:00', estimatedTime: '10:00 (On Time)', status: 'Departed', progress: 100, gate: 'Gate 15', counter: 'Row F01-F08' },
    { id: 't3-dep-qg142', type: 'departure', number: 'QG 142', airline: 'Citilink', logo: '✈️', destination: 'Surabaya (SUB)', time: '11:10', estimatedTime: '11:25 (Estimasi)', status: 'Delayed', progress: 10, gate: 'Gate 8', counter: 'Row D01-D08' },
    { id: 't3-dep-ek357', type: 'departure', number: 'EK 357', airline: 'Emirates', logo: '✈️', destination: 'Dubai (DXB)', time: '12:45', estimatedTime: '12:45 (On Time)', status: 'Final Call', progress: 85, gate: 'Gate 26', counter: 'Row B01-B10' },
    { id: 't3-dep-qr959', type: 'departure', number: 'QR 959', airline: 'Qatar Airways', logo: '✈️', destination: 'Doha (DOH)', time: '13:55', estimatedTime: '13:55 (On Time)', status: 'Boarding', progress: 65, gate: 'Gate 28', counter: 'Row A11-A20' },
    { id: 't3-dep-nh856', type: 'departure', number: 'NH 856', airline: 'All Nippon Airways', logo: '✈️', destination: 'Tokyo (HND)', time: '15:10', estimatedTime: '15:10 (On Time)', status: 'Check-in', progress: 35, gate: 'Gate 24', counter: 'Row C01-C10' },
    { id: 't3-dep-ga868', type: 'departure', number: 'GA 868', airline: 'Garuda Indonesia', logo: '✈️', destination: 'Seoul (ICN)', time: '16:30', estimatedTime: '16:30 (On Time)', status: 'Check-in', progress: 25, gate: 'Gate 12', counter: 'Row F09-F16' },
    { id: 't3-dep-mh712', type: 'departure', number: 'MH 712', airline: 'Malaysia Airlines', logo: '✈️', destination: 'Kuala Lumpur (KUL)', time: '17:20', estimatedTime: '17:20 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 21', counter: 'Row B11-B18' },
    { id: 't3-dep-ga196', type: 'departure', number: 'GA 196', airline: 'Garuda Indonesia', logo: '✈️', destination: 'Bali (DPS)', time: '18:15', estimatedTime: '18:15 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 14', counter: 'Row F01-F08' },
    { id: 't3-dep-ey475', type: 'departure', number: 'EY 475', airline: 'Etihad Airways', logo: '✈️', destination: 'Abu Dhabi (AUH)', time: '19:40', estimatedTime: '19:40 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 27', counter: 'Row A01-A10' },
    { id: 't3-dep-sq967', type: 'departure', number: 'SQ 967', airline: 'Singapore Airlines', logo: '✈️', destination: 'Singapore (SIN)', time: '20:20', estimatedTime: '20:20 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 23', counter: 'Row C11-C18' },
    { id: 't3-dep-ga88', type: 'departure', number: 'GA 88', airline: 'Garuda Indonesia', logo: '✈️', destination: 'Amsterdam (AMS)', time: '21:50', estimatedTime: '21:50 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 16', counter: 'Row F09-F20' },
    { id: 't3-dep-ke628', type: 'departure', number: 'KE 628', airline: 'Korean Air', logo: '✈️', destination: 'Seoul (ICN)', time: '22:35', estimatedTime: '22:35 (On Time)', status: 'Cancelled', progress: 0, gate: 'Gate -', counter: 'Row -' },
    { id: 't3-dep-jl726', type: 'departure', number: 'JL 726', airline: 'Japan Airlines', logo: '✈️', destination: 'Tokyo (NRT)', time: '23:25', estimatedTime: '23:25 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 25', counter: 'Row C01-C08' },
    // ARRIVALS - Terminal 3
    { id: 't3-arr-ga205', type: 'arrival', number: 'GA 205', airline: 'Garuda Indonesia', logo: '✈️', origin: 'Bali (DPS)', time: '08:10', estimatedTime: '08:05 (Aktual)', status: 'Landed', progress: 100, gate: 'Gate 11', baggage: 'Belt 3' },
    { id: 't3-arr-sq952', type: 'arrival', number: 'SQ 952', airline: 'Singapore Airlines', logo: '✈️', origin: 'Singapore (SIN)', time: '09:00', estimatedTime: '09:12 (Aktual)', status: 'Baggage Claim', progress: 100, gate: 'Gate 22', baggage: 'Belt 6' },
    { id: 't3-arr-ga183', type: 'arrival', number: 'GA 183', airline: 'Garuda Indonesia', logo: '✈️', origin: 'Medan (KNO)', time: '10:45', estimatedTime: '10:42 (Aktual)', status: 'Landed', progress: 100, gate: 'Gate 15', baggage: 'Belt 4' },
    { id: 't3-arr-ek356', type: 'arrival', number: 'EK 356', airline: 'Emirates', logo: '✈️', origin: 'Dubai (DXB)', time: '11:45', estimatedTime: '11:45 (On Time)', status: 'Landed', progress: 100, gate: 'Gate 26', baggage: 'Belt 7' },
    { id: 't3-arr-qg143', type: 'arrival', number: 'QG 143', airline: 'Citilink', logo: '✈️', origin: 'Surabaya (SUB)', time: '12:20', estimatedTime: '12:45 (Estimasi)', status: 'Delayed', progress: 45, gate: 'Gate 8', baggage: 'Belt 2' },
    { id: 't3-arr-qr958', type: 'arrival', number: 'QR 958', airline: 'Qatar Airways', logo: '✈️', origin: 'Doha (DOH)', time: '13:10', estimatedTime: '13:08 (On Time)', status: 'Landed', progress: 100, gate: 'Gate 28', baggage: 'Belt 8' },
    { id: 't3-arr-ga869', type: 'arrival', number: 'GA 869', airline: 'Garuda Indonesia', logo: '✈️', origin: 'Seoul (ICN)', time: '14:25', estimatedTime: '14:25 (On Time)', status: 'Landed', progress: 100, gate: 'Gate 12', baggage: 'Belt 5' },
    { id: 't3-arr-nh855', type: 'arrival', number: 'NH 855', airline: 'All Nippon Airways', logo: '✈️', origin: 'Tokyo (HND)', time: '15:40', estimatedTime: '15:40 (On Time)', status: 'Scheduled', progress: 15, gate: 'Gate 24', baggage: 'Belt 6' },
    { id: 't3-arr-mh713', type: 'arrival', number: 'MH 713', airline: 'Malaysia Airlines', logo: '✈️', origin: 'Kuala Lumpur (KUL)', time: '16:50', estimatedTime: '16:50 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 21', baggage: 'Belt 9' },
    { id: 't3-arr-ga197', type: 'arrival', number: 'GA 197', airline: 'Garuda Indonesia', logo: '✈️', origin: 'Bali (DPS)', time: '18:00', estimatedTime: '18:00 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 14', baggage: 'Belt 3' },
    { id: 't3-arr-ey474', type: 'arrival', number: 'EY 474', airline: 'Etihad Airways', logo: '✈️', origin: 'Abu Dhabi (AUH)', time: '19:15', estimatedTime: '19:15 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 27', baggage: 'Belt 8' },
    { id: 't3-arr-sq968', type: 'arrival', number: 'SQ 968', airline: 'Singapore Airlines', logo: '✈️', origin: 'Singapore (SIN)', time: '20:10', estimatedTime: '20:10 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 23', baggage: 'Belt 6' },
    { id: 't3-arr-ke627', type: 'arrival', number: 'KE 627', airline: 'Korean Air', logo: '✈️', origin: 'Seoul (ICN)', time: '21:10', estimatedTime: '21:10 (On Time)', status: 'Cancelled', progress: 0, gate: 'Gate -', baggage: 'Belt -' },
    { id: 't3-arr-ga89', type: 'arrival', number: 'GA 89', airline: 'Garuda Indonesia', logo: '✈️', origin: 'Amsterdam (AMS)', time: '22:30', estimatedTime: '22:30 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 16', baggage: 'Belt 5' },
    { id: 't3-arr-jl725', type: 'arrival', number: 'JL 725', airline: 'Japan Airlines', logo: '✈️', origin: 'Tokyo (NRT)', time: '23:45', estimatedTime: '23:45 (On Time)', status: 'Scheduled', progress: 0, gate: 'Gate 25', baggage: 'Belt 7' }
];

// Map terminals to their flight databases
const TERMINAL_MAP = {
    '1': TERMINAL_1_FLIGHTS,
    '2': TERMINAL_2_FLIGHTS,
    '3': TERMINAL_3_FLIGHTS
};

// Active state
let activeTab = 'departure';
let currentTerminal = null;
let FLIGHT_DATABASE = [];
let mapAnimationId = null;
let worldLandGeoJSON = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fadeout Loader
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 400);
    }

    // 2. Initialize Supabase
    let isConnected = false;
    if (typeof initSupabase === 'function') {
        isConnected = initSupabase();
    }

    // 3. Detect which terminal page we're on
    const terminalMeta = document.querySelector('meta[name="terminal"]');
    if (terminalMeta) {
        currentTerminal = terminalMeta.content;
        FLIGHT_DATABASE = TERMINAL_MAP[currentTerminal] || [];
        
        // Fetch Real-time Supabase Data
        if (isConnected && typeof fetchFlights === 'function') {
            const realData = await fetchFlights(currentTerminal);
            if (realData && realData.length > 0) {
                FLIGHT_DATABASE = realData;
                
                // Realtime Subscriptions
                subscribeToFlights(
                    currentTerminal,
                    (flight) => { // Insert
                        FLIGHT_DATABASE.push(flight);
                        renderFIDS();
                        updateDashboardStats();
                    },
                    (newF, oldF) => { // Update
                        const idx = FLIGHT_DATABASE.findIndex(f => f.id === newF.id);
                        if (idx !== -1) FLIGHT_DATABASE[idx] = newF;
                        else FLIGHT_DATABASE.push(newF);
                        renderFIDS();
                        updateDashboardStats();
                    },
                    (oldF) => { // Delete
                        FLIGHT_DATABASE = FLIGHT_DATABASE.filter(f => f.id !== oldF.id);
                        renderFIDS();
                        updateDashboardStats();
                    }
                );
            }
        }
        initFIDSBoard();
    } else {
        // We are on Dashboard
        if (isConnected && typeof fetchAllFlights === 'function') {
            const allData = await fetchAllFlights();
            if (allData['1'] && allData['1'].length > 0) TERMINAL_1_FLIGHTS = allData['1'];
            if (allData['2'] && allData['2'].length > 0) TERMINAL_2_FLIGHTS = allData['2'];
            if (allData['3'] && allData['3'].length > 0) TERMINAL_3_FLIGHTS = allData['3'];
            
            // Re-render Dashboard stats
            updateDashboardStats();
            
            subscribeToFlights(
                null,
                (f) => { window.location.reload(); },
                (nf, of) => { window.location.reload(); },
                (f) => { window.location.reload(); }
            );
        }
    }

    // 4. Start Real-Time FIDS Clock (GMT+7 WIB)
    initFIDSClock();
    initWeather();
    initQuickSearch();
    initAirlinesDirectory();

    // 5. Scroll animations
    initScrollReveal();

    // 6. Dashboard live stats (initial)
    updateDashboardStats();

    // 7. Background Auto-Refresh (Supabase -> UI)
    initAutoRefresh();

    // 8. Kiosk Mode
    initKioskMode();

    // 9. Manual Sync Button (Admin)
    initSyncButton();

    // 10. Ambil data peta bumi riil (Natural Earth GeoJSON)
    fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson')
        .then(res => {
            if (!res.ok) throw new Error("Gagal mengambil data peta");
            return res.json();
        })
        .then(data => {
            worldLandGeoJSON = data;
        })
        .catch(err => {
            console.warn("Koneksi offline atau lambat, menggunakan fallback benua lokal:", err);
        });
});

/**
 * Initialize the FIDS board (for terminal pages)
 */
function initFIDSBoard() {
    // Tab listeners (Keberangkatan / Kedatangan)
    const btnDepartures = document.getElementById('tab-departures');
    const btnArrivals = document.getElementById('tab-arrivals');

    btnDepartures?.addEventListener('click', () => switchTab('departure'));
    btnArrivals?.addEventListener('click', () => switchTab('arrival'));

    // Filter listeners
    const searchInput = document.getElementById('fids-search-input');
    const statusFilter = document.getElementById('fids-status-filter');

    searchInput?.addEventListener('input', renderFIDS);
    statusFilter?.addEventListener('change', renderFIDS);

    // Deep-link search or airline filter (?search=... or ?airline=...)
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search') || urlParams.get('airline');
    if (searchParam && searchInput) {
        searchInput.value = searchParam;
    }

    // Expose airline pill filter
    window.filterByAirline = function(airlineName) {
        if (!searchInput) return;
        if (searchInput.value.toLowerCase() === airlineName.toLowerCase()) {
            searchInput.value = '';
        } else {
            searchInput.value = airlineName;
        }
        renderFIDS();
    };

    // Initial Render
    renderFIDS();

    // Deep-link auto-open (?flight=...)
    const targetFlight = urlParams.get('flight');
    if (targetFlight) {
        setTimeout(() => {
            const cleanTarget = targetFlight.toUpperCase().replace(/[^A-Z0-9]/g, '');
            const foundFlight = FLIGHT_DATABASE.find(f => (f.number || '').toUpperCase().replace(/[^A-Z0-9]/g, '') === cleanTarget);
            if (foundFlight) {
                if (foundFlight.type !== activeTab) {
                    switchTab(foundFlight.type);
                }
                const targetRow = document.getElementById(`flight-row-${cleanTarget}`);
                if (targetRow) {
                    targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetRow.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.4)';
                    targetRow.style.borderColor = 'var(--accent-t1)';
                }
                openModal(foundFlight);
            }
        }, 350);
    }

    // Modal close listeners
    const modal = document.getElementById('fids-detail-modal');
    const closeBtns = modal?.querySelectorAll('.fids-modal-close');
    closeBtns?.forEach(btn => {
        btn.addEventListener('click', () => closeModal());
    });
    
    // Close modal if clicked outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const m = document.getElementById('fids-detail-modal');
            if (m && m.classList.contains('show')) {
                closeModal();
            }
        }
    });
}

/**
 * Mobile swipe-down gesture handler for modal
 */
function bindModalSwipeGestures(modal) {
    if (!modal) return;
    const modalContent = modal.querySelector('.fids-modal-content');
    if (!modalContent) return;

    let touchStartY = 0;
    let touchCurrentY = 0;

    modalContent.addEventListener('touchstart', (e) => {
        if (modalContent.scrollTop <= 0) {
            touchStartY = e.touches[0].clientY;
        } else {
            touchStartY = 0;
        }
    }, { passive: true });

    modalContent.addEventListener('touchmove', (e) => {
        if (touchStartY === 0) return;
        touchCurrentY = e.touches[0].clientY;
        const delta = touchCurrentY - touchStartY;
        if (delta > 0 && modalContent.scrollTop <= 0) {
            modalContent.style.transform = `translateY(${Math.min(delta * 0.4, 120)}px)`;
            modalContent.style.opacity = Math.max(0.5, 1 - delta / 400);
        }
    }, { passive: true });

    modalContent.addEventListener('touchend', () => {
        const delta = touchCurrentY - touchStartY;
        if (delta > 80) {
            closeModal();
        }
        modalContent.style.transform = '';
        modalContent.style.opacity = '';
        touchStartY = 0;
        touchCurrentY = 0;
    });
}

/**
 * Live Clock Generator for FIDS Screen
 */
function initFIDSClock() {
    const clockElements = document.querySelectorAll('.fids-live-clock');
    
    function updateClock() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        const formatted = `${hrs}:${mins}:${secs} WIB`;
        
        clockElements.forEach(el => {
            el.innerText = formatted;
        });

        const clockWib = document.getElementById('live-clock-wib');
        if (clockWib) clockWib.innerHTML = `${hrs}:${mins}:${secs} <span class="fs-6 text-cyan">WIB</span>`;
        
        const clockUtc = document.getElementById('live-clock-utc');
        if (clockUtc) {
            const uHrs = String(now.getUTCHours()).padStart(2, '0');
            const uMins = String(now.getUTCMinutes()).padStart(2, '0');
            const uSecs = String(now.getUTCSeconds()).padStart(2, '0');
            clockUtc.innerText = `${uHrs}:${uMins}:${uSecs} UTC`;
        }
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Format Estimated Time according to active language
 */
function formatEstimatedTime(timeStr) {
    if (!timeStr) return '';
    const isEn = typeof currentLang !== 'undefined' && currentLang === 'en';
    const estWord = typeof __t === 'function' ? __t('status_time_est') : (isEn ? 'Estimated' : 'Estimasi');
    const actWord = typeof __t === 'function' ? __t('status_time_act') : (isEn ? 'Actual' : 'Aktual');
    const onTimeWord = typeof __t === 'function' ? __t('status_time_on_time') : (isEn ? 'On Time' : 'Tepat Waktu');

    return timeStr
        .replace(/\((Estimasi|Estimated)\)/gi, `(${estWord})`)
        .replace(/\((Aktual|Actual)\)/gi, `(${actWord})`)
        .replace(/\((Tepat Waktu|On Time)\)/gi, `(${onTimeWord})`);
}

/**
 * Tab Toggling Logic
 */
function switchTab(tabType) {
    activeTab = tabType;
    
    const btnDepartures = document.getElementById('tab-departures');
    const btnArrivals = document.getElementById('tab-arrivals');
    const destHdr = document.getElementById('fids-dest-hdr');
    const gateHdr = document.getElementById('fids-gate-hdr');

    if (tabType === 'departure') {
        btnDepartures?.classList.add('active');
        btnArrivals?.classList.remove('active');
        if (destHdr) {
            destHdr.setAttribute('data-i18n', 'hdr_dest_dep');
            destHdr.innerText = typeof __t === 'function' ? __t('hdr_dest_dep') : 'TUJUAN';
        }
        if (gateHdr) {
            gateHdr.setAttribute('data-i18n', 'hdr_gate_dep');
            gateHdr.innerText = typeof __t === 'function' ? __t('hdr_gate_dep') : 'GERBANG / KONTER';
        }
    } else {
        btnDepartures?.classList.remove('active');
        btnArrivals?.classList.add('active');
        if (destHdr) {
            destHdr.setAttribute('data-i18n', 'hdr_dest_arr');
            destHdr.innerText = typeof __t === 'function' ? __t('hdr_dest_arr') : 'ASAL';
        }
        if (gateHdr) {
            gateHdr.setAttribute('data-i18n', 'hdr_gate_arr');
            gateHdr.innerText = typeof __t === 'function' ? __t('hdr_gate_arr') : 'GERBANG / SABUK';
        }
    }

    // Reset filters
    const searchInput = document.getElementById('fids-search-input');
    const statusFilter = document.getElementById('fids-status-filter');
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = '';

    populateStatusFilterOptions(tabType);
    renderFIDS();
}

/**
 * Populate Status Filter Options based on Tab Type
 */
function populateStatusFilterOptions(tabType) {
    const statusFilter = document.getElementById('fids-status-filter');
    if (!statusFilter) return;

    const allStatusText = typeof __t === 'function' ? __t('filter_all') : 'Semua Status';
    statusFilter.innerHTML = `<option value="" data-i18n="filter_all">${allStatusText}</option>`;
    
    if (tabType === 'departure') {
        statusFilter.innerHTML += `
            <option value="Scheduled">Scheduled</option>
            <option value="Check-in">Check-in</option>
            <option value="Boarding">Boarding</option>
            <option value="Final Call">Final Call</option>
            <option value="Departed">Departed</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
        `;
    } else {
        statusFilter.innerHTML += `
            <option value="Scheduled">Scheduled</option>
            <option value="Landed">Landed</option>
            <option value="Baggage Claim">Baggage Claim</option>
            <option value="Delayed">Delayed</option>
            <option value="Cancelled">Cancelled</option>
        `;
    }
}

function getAircraftModel(flightNo, airline) {
    const fn = (flightNo || '').toUpperCase();
    if (fn.startsWith('GA')) return 'B737-800';
    if (fn.startsWith('SQ')) return 'A350-900';
    if (fn.startsWith('JT')) return 'B737-900ER';
    if (fn.startsWith('ID')) return 'A320-200';
    if (fn.startsWith('QZ')) return 'A320-200';
    if (fn.startsWith('SJ')) return 'B737-800';
    if (fn.startsWith('EK')) return 'B777-300ER';
    if (fn.startsWith('QR')) return 'A350-1000';
    if (fn.startsWith('MH')) return 'B737-800';
    if (fn.startsWith('TG')) return 'A350-900';
    if (fn.startsWith('CX')) return 'A350-900';
    if (fn.startsWith('NH')) return 'B787-9';
    if (fn.startsWith('JL')) return 'B787-9';
    if (fn.startsWith('EY')) return 'B787-10';
    if (fn.startsWith('IU')) return 'A320-200';
    if (fn.startsWith('IP')) return 'A320-200';
    if (fn.startsWith('MU')) return 'A330-300';
    if (fn.startsWith('SV')) return 'B777-300ER';
    if (fn.startsWith('TR')) return 'A320-200';
    if (fn.startsWith('3K')) return 'A320-200';
    if (fn.startsWith('XT')) return 'A330-300';
    if (fn.startsWith('IW')) return 'ATR 72-600';
    if (fn.startsWith('QG')) return 'A320-200';
    return 'B737-800';
}

function getAircraftCategory(aircraftModel) {
    if (!aircraftModel) return typeof __t === 'function' ? __t('modal_narrow_body') : 'Lorong Tunggal (Narrow-Body)';
    const m = aircraftModel.toUpperCase();
    if (m.includes('A330') || m.includes('A350') || m.includes('B777') || m.includes('B787') || m.includes('A380') || m.includes('B747')) {
        return typeof __t === 'function' ? __t('modal_wide_body') : 'Badan Lebar (Wide-Body)';
    }
    return typeof __t === 'function' ? __t('modal_narrow_body') : 'Lorong Tunggal (Narrow-Body)';
}

/**
 * Live FIDS Renderer
 */
function renderFIDS() {
    const boardList = document.getElementById('fids-board-list');
    if (!boardList) return;

    const query = document.getElementById('fids-search-input')?.value.toLowerCase().trim() || '';
    const selectedStatus = document.getElementById('fids-status-filter')?.value || '';

    // Synchronize active state on modern airline filter pills
    const airlinePills = document.querySelectorAll('.airline-filter-pill');
    airlinePills.forEach(pill => {
        const pillText = pill.textContent.trim().toLowerCase();
        if (query && (query === pillText || pillText.includes(query))) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });

    const flights = FLIGHT_DATABASE.filter(flight => {
        const matchesTab = flight.type === activeTab;
        const matchesQuery = flight.number.toLowerCase().includes(query) || 
                             flight.airline.toLowerCase().includes(query) ||
                             (flight.destination && flight.destination.toLowerCase().includes(query)) ||
                             (flight.origin && flight.origin.toLowerCase().includes(query));
        const matchesStatus = selectedStatus === '' || flight.status === selectedStatus;

        return matchesTab && matchesQuery && matchesStatus;
    });

    boardList.innerHTML = '';

    if (flights.length === 0) {
        boardList.innerHTML = `
            <div class="text-center py-5 text-secondary font-digital">
                <i class="fa-solid fa-plane-slash fa-2x mb-3 text-secondary"></i>
                <p class="mb-0" data-i18n="empty_state">${typeof __t !== 'undefined' ? __t('empty_state') : 'TIDAK ADA DATA PENERBANGAN YANG COCOK'}</p>
            </div>
        `;
        return;
    }

    flights.forEach(flight => {
        const aircraft = getAircraftModel(flight.number, flight.airline);
        const cleanFlightNo = (flight.number || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

        let pillClass = 'status-pill-scheduled';
        let dotClass = 'dot-slate';

        if (flight.status === 'Boarding') {
            pillClass = 'status-pill-boarding';
            dotClass = 'pulse-green';
        } else if (flight.status === 'Final Call') {
            pillClass = 'status-pill-final-call';
            dotClass = 'pulse-amber';
        } else if (flight.status === 'Check-in') {
            pillClass = 'status-pill-checkin';
            dotClass = 'dot-blue';
        } else if (flight.status === 'Delayed') {
            pillClass = 'status-pill-delayed';
            dotClass = 'dot-rose';
        } else if (flight.status === 'Departed' || flight.status === 'Landed') {
            pillClass = 'status-pill-scheduled';
            dotClass = 'dot-slate';
        }

        const fallbackLetters = escapeHtml((flight.airline || 'FL').slice(0, 2).toUpperCase());
        const statusSlug = escapeHtml((flight.status || '').toLowerCase().replace(/[^a-z0-9]/g, '-'));
        const safeTime = escapeHtml(flight.time);
        const safeNumber = escapeHtml(flight.number);
        const safeAirline = escapeHtml(flight.airline);
        const safeAircraft = aircraft ? `&bull; <span class="font-digital text-muted">${escapeHtml(aircraft)}</span>` : '';
        const safeDestOrOrigin = escapeHtml(flight.type === 'departure' ? flight.destination : flight.origin);
        const safeGate = escapeHtml(flight.gate || (flight.type === 'departure' ? flight.counter : flight.baggage) || 'Gate -');
        const safeEstTime = escapeHtml(flight.estimatedTime ? flight.estimatedTime.split(' ')[0] : flight.time);
        const safeStatus = escapeHtml(flight.status);
        const hasValidLogo = flight.logo && (flight.logo.startsWith('http') || flight.logo.startsWith('/') || flight.logo.startsWith('assets/') || flight.logo.includes('.'));

        const row = document.createElement('div');
        row.className = `fids-row-modern fids-compact-row status-${statusSlug}`;
        row.id = `flight-row-${cleanFlightNo}`;
        row.innerHTML = `
            <!-- Mobile 2-Tier Ultra-Dense Layout (< md) -->
            <div class="fids-mobile-view d-md-none w-100">
                <div class="fids-mobile-top-row d-flex justify-content-between align-items-center mb-1">
                    <div class="d-flex align-items-center gap-2 overflow-hidden">
                        <span class="fw-bold font-digital text-white fids-compact-time">${safeTime}</span>
                        <div class="airline-emblem-sq airline-emblem-sq-compact">
                            ${hasValidLogo ? `<img src="${encodeURI(flight.logo)}" alt="${safeAirline}" onerror="this.parentElement.innerHTML='<span class=\\'small fw-bold text-white font-digital\\'>${fallbackLetters}</span>'">` : `<span class="small fw-bold text-white font-digital">${fallbackLetters}</span>`}
                        </div>
                        <span class="fw-bold font-digital text-white text-truncate">${safeNumber}</span>
                        <span class="text-secondary small text-truncate d-none d-sm-inline" style="font-size:0.75rem">${safeAirline}</span>
                    </div>
                    <div class="flex-shrink-0 ms-2">
                        <span class="status-pill-modern status-pill-compact ${pillClass}">
                            <span class="status-pulse-dot ${dotClass}"></span> ${safeStatus}
                        </span>
                    </div>
                </div>
                <div class="fids-mobile-bottom-row d-flex justify-content-between align-items-center">
                    <div class="text-truncate pe-2">
                        <span class="fw-semibold text-white text-uppercase text-truncate d-block" style="font-size:0.85rem">${safeDestOrOrigin}</span>
                    </div>
                    <div class="flex-shrink-0">
                        <span class="gate-badge-modern gate-badge-compact">${safeGate}</span>
                    </div>
                </div>
            </div>

            <!-- Desktop & Tablet Layout (>= md) -->
            <div class="row align-items-center w-100 g-2 g-md-0 m-0 d-none d-md-flex">
                <!-- Time -->
                <div class="col-md-1 font-digital p-0">
                    <div class="fw-bold text-white fs-6">${safeTime}</div>
                    <div class="text-secondary small font-digital" style="font-size:0.7rem">WIB</div>
                </div>

                <!-- Airline & Flight No -->
                <div class="col-md-3 d-flex align-items-center gap-2 overflow-hidden px-md-2 p-0">
                    <div class="airline-emblem-sq">
                        ${hasValidLogo ? `<img src="${encodeURI(flight.logo)}" alt="${safeAirline}" onerror="this.parentElement.innerHTML='<span class=\\'small fw-bold text-white font-digital\\'>${fallbackLetters}</span>'">` : `<span class="small fw-bold text-white font-digital">${fallbackLetters}</span>`}
                    </div>
                    <div class="text-truncate">
                        <div class="fw-bold font-digital text-white fs-6 text-truncate">${safeNumber}</div>
                        <div class="text-secondary small text-truncate" style="font-size:0.75rem">
                            ${safeAirline} ${safeAircraft}
                        </div>
                    </div>
                </div>

                <!-- Destination / Origin -->
                <div class="col-md-3 px-md-2 p-0">
                    <span class="fw-semibold text-white d-block text-uppercase text-truncate">${safeDestOrOrigin}</span>
                    <span class="text-secondary small" style="font-size:0.72rem">${flight.type === 'departure' ? (typeof __t === 'function' ? __t('lbl_dest') : 'Tujuan') : (typeof __t === 'function' ? __t('lbl_origin') : 'Asal')}</span>
                </div>

                <!-- Gate / Belt -->
                <div class="col-md-2 text-start px-md-2 p-0">
                    <span class="gate-badge-modern">${safeGate}</span>
                </div>

                <!-- Estimated Time -->
                <div class="col-md-1 font-digital text-white-50 px-md-2 p-0">
                    <span class="small font-digital">${safeEstTime}</span>
                </div>

                <!-- Status Pill -->
                <div class="col-md-2 text-end p-0">
                    <span class="status-pill-modern ${pillClass}">
                        <span class="status-pulse-dot ${dotClass}"></span> ${safeStatus}
                    </span>
                </div>
            </div>
        `;

        row.addEventListener('click', () => openModal(flight));
        boardList.appendChild(row);
    });
}

/**
 * Open FIDS Info Modal
 */
// Database Koordinat Bandara (Latitude, Longitude)
const AIRPORT_COORDS = {
    'CGK': { name: 'Jakarta (CGK)', lat: -6.126, lon: 106.656 },
    // Domestik
    'SUB': { name: 'Surabaya (SUB)', lat: -7.380, lon: 112.787 },
    'JOG': { name: 'Yogyakarta (JOG)', lat: -7.788, lon: 110.432 },
    'DPS': { name: 'Bali (DPS)', lat: -8.748, lon: 115.168 },
    'SRG': { name: 'Semarang (SRG)', lat: -6.973, lon: 110.375 },
    'UPG': { name: 'Makassar (UPG)', lat: -5.061, lon: 119.554 },
    'PLM': { name: 'Palembang (PLM)', lat: -2.900, lon: 104.701 },
    'BDJ': { name: 'Banjarmasin (BDJ)', lat: -3.442, lon: 114.761 },
    'BPN': { name: 'Balikpapan (BPN)', lat: -1.268, lon: 116.894 },
    'KNO': { name: 'Medan (KNO)', lat: 3.642, lon: 98.880 },
    'PNK': { name: 'Pontianak (PNK)', lat: -0.150, lon: 109.404 },
    'SOC': { name: 'Solo (SOC)', lat: -7.514, lon: 110.756 },
    'MDC': { name: 'Manado (MDC)', lat: 1.549, lon: 124.926 },
    'KOE': { name: 'Kupang (KOE)', lat: -10.172, lon: 123.670 },
    // Internasional
    'KUL': { name: 'Kuala Lumpur (KUL)', lat: 2.745, lon: 101.710 },
    'MEL': { name: 'Melbourne (MEL)', lat: -37.669, lon: 144.843 },
    'SIN': { name: 'Singapore (SIN)', lat: 1.364, lon: 103.994 },
    'MNL': { name: 'Manila (MNL)', lat: 14.509, lon: 121.020 },
    'DMK': { name: 'Bangkok (DMK)', lat: 13.913, lon: 100.608 },
    'JED': { name: 'Jeddah (JED)', lat: 21.680, lon: 39.157 },
    'SGN': { name: 'Ho Chi Minh (SGN)', lat: 10.822, lon: 106.660 },
    'TPE': { name: 'Taipei (TPE)', lat: 25.080, lon: 121.233 },
    'DXB': { name: 'Dubai (DXB)', lat: 25.253, lon: 55.364 },
    'DOH': { name: 'Doha (DOH)', lat: 25.261, lon: 51.565 },
    'HND': { name: 'Tokyo Haneda (HND)', lat: 35.549, lon: 139.780 },
    'NRT': { name: 'Tokyo Narita (NRT)', lat: 35.772, lon: 140.393 },
    'ICN': { name: 'Seoul Incheon (ICN)', lat: 37.460, lon: 126.440 },
    'AMS': { name: 'Amsterdam (AMS)', lat: 52.308, lon: 4.764 },
    'AUH': { name: 'Abu Dhabi (AUH)', lat: 24.433, lon: 54.651 }
};

// Database Label Negara untuk ditampilkan di Globe 3D
const COUNTRY_LABELS = [
    // Asia Tenggara
    { name: 'INDONESIA', name_en: 'INDONESIA', lat: -2.5, lon: 118.0 },
    { name: 'MALAYSIA', name_en: 'MALAYSIA', lat: 4.2, lon: 101.9 },
    { name: 'SINGAPURA', name_en: 'SINGAPORE', lat: 1.35, lon: 103.8 },
    { name: 'FILIPINA', name_en: 'PHILIPPINES', lat: 12.9, lon: 121.8 },
    { name: 'THAILAND', name_en: 'THAILAND', lat: 15.9, lon: 100.5 },
    { name: 'VIETNAM', name_en: 'VIETNAM', lat: 16.0, lon: 108.0 },
    { name: 'MYANMAR', name_en: 'MYANMAR', lat: 19.8, lon: 96.2 },
    { name: 'KAMBOJA', name_en: 'CAMBODIA', lat: 12.6, lon: 104.9 },
    { name: 'LAOS', name_en: 'LAOS', lat: 18.2, lon: 103.9 },
    // Asia Timur
    { name: 'JEPANG', name_en: 'JAPAN', lat: 36.2, lon: 138.3 },
    { name: 'KOREA SELATAN', name_en: 'SOUTH KOREA', lat: 35.9, lon: 127.8 },
    { name: 'TIONGKOK', name_en: 'CHINA', lat: 35.9, lon: 104.2 },
    { name: 'TAIWAN', name_en: 'TAIWAN', lat: 23.7, lon: 121.0 },
    { name: 'MONGOLIA', name_en: 'MONGOLIA', lat: 46.9, lon: 103.8 },
    // Asia Selatan
    { name: 'INDIA', name_en: 'INDIA', lat: 20.6, lon: 79.0 },
    { name: 'SRI LANKA', name_en: 'SRI LANKA', lat: 7.9, lon: 80.8 },
    { name: 'BANGLADESH', name_en: 'BANGLADESH', lat: 23.7, lon: 90.4 },
    { name: 'NEPAL', name_en: 'NEPAL', lat: 28.4, lon: 84.1 },
    { name: 'PAKISTAN', name_en: 'PAKISTAN', lat: 30.4, lon: 69.3 },
    // Timur Tengah
    { name: 'ARAB SAUDI', name_en: 'SAUDI ARABIA', lat: 23.9, lon: 45.1 },
    { name: 'UNI EMIRAT ARAB', name_en: 'UAE', lat: 23.4, lon: 53.8 },
    { name: 'QATAR', name_en: 'QATAR', lat: 25.4, lon: 51.2 },
    { name: 'TURKI', name_en: 'TURKEY', lat: 39.0, lon: 35.2 },
    { name: 'IRAN', name_en: 'IRAN', lat: 32.4, lon: 53.7 },
    { name: 'IRAK', name_en: 'IRAQ', lat: 33.2, lon: 43.7 },
    // Eropa
    { name: 'BELANDA', name_en: 'NETHERLANDS', lat: 52.1, lon: 5.3 },
    { name: 'JERMAN', name_en: 'GERMANY', lat: 51.2, lon: 10.5 },
    { name: 'PRANCIS', name_en: 'FRANCE', lat: 46.2, lon: 2.2 },
    { name: 'INGGRIS', name_en: 'UNITED KINGDOM', lat: 55.4, lon: -3.4 },
    { name: 'ITALIA', name_en: 'ITALY', lat: 42.5, lon: 12.6 },
    { name: 'SPANYOL', name_en: 'SPAIN', lat: 40.5, lon: -3.7 },
    { name: 'RUSIA', name_en: 'RUSSIA', lat: 61.5, lon: 105.3 },
    { name: 'SWEDIA', name_en: 'SWEDEN', lat: 60.1, lon: 18.6 },
    { name: 'NORWEGIA', name_en: 'NORWAY', lat: 60.5, lon: 8.5 },
    { name: 'POLANDIA', name_en: 'POLAND', lat: 52.0, lon: 19.1 },
    { name: 'UKRAINA', name_en: 'UKRAINE', lat: 48.4, lon: 31.2 },
    // Afrika
    { name: 'MESIR', name_en: 'EGYPT', lat: 26.8, lon: 30.8 },
    { name: 'AFRIKA SELATAN', name_en: 'SOUTH AFRICA', lat: -30.6, lon: 22.9 },
    { name: 'NIGERIA', name_en: 'NIGERIA', lat: 9.1, lon: 8.7 },
    { name: 'KENYA', name_en: 'KENYA', lat: -0.02, lon: 37.9 },
    { name: 'ETHIOPIA', name_en: 'ETHIOPIA', lat: 9.1, lon: 40.5 },
    { name: 'MAROKO', name_en: 'MOROCCO', lat: 31.8, lon: -7.1 },
    // Oseania
    { name: 'AUSTRALIA', name_en: 'AUSTRALIA', lat: -25.3, lon: 133.8 },
    { name: 'SELANDIA BARU', name_en: 'NEW ZEALAND', lat: -40.9, lon: 174.9 },
    { name: 'PAPUA NUGINI', name_en: 'PAPUA NEW GUINEA', lat: -6.3, lon: 147.2 },
    // Amerika
    { name: 'AMERIKA SERIKAT', name_en: 'UNITED STATES', lat: 37.1, lon: -95.7 },
    { name: 'KANADA', name_en: 'CANADA', lat: 56.1, lon: -106.3 },
    { name: 'MEKSIKO', name_en: 'MEXICO', lat: 23.6, lon: -102.6 },
    { name: 'BRASIL', name_en: 'BRAZIL', lat: -14.2, lon: -51.9 },
    { name: 'ARGENTINA', name_en: 'ARGENTINA', lat: -38.4, lon: -63.6 },
    { name: 'KOLOMBIA', name_en: 'COLOMBIA', lat: 4.6, lon: -74.3 },
    { name: 'CHILE', name_en: 'CHILE', lat: -35.7, lon: -71.5 },
    { name: 'PERU', name_en: 'PERU', lat: -9.2, lon: -75.0 },
];

// Data Batas Benua (Longitude, Latitude) yang disederhanakan untuk Visualisasi 3D Globe
const LAND_POLYGONS = [
    // Eurasia (Europe + Asia)
    [ [10,70],[30,75],[60,75],[90,75],[120,75],[150,70],[170,60],[140,40],[120,30],[100,10],[105,-5],[95,5],[75,10],[35,15],[30,30],[26,40],[5,60],[10,70] ],
    // Indonesia / Sumatra
    [ [95,5],[105,-5],[102,-6],[95,2],[95,5] ],
    // Java
    [ [105,-6],[115,-8],[114,-8.5],[105,-7.5],[105,-6] ],
    // Borneo
    [ [109,4],[118,4],[118,-4],[109,-4],[109,4] ],
    // Sulawesi
    [ [120,2],[125,2],[125,-5],[120,-5],[120,2] ],
    // New Guinea
    [ [130,-2],[141,-8],[130,-8],[130,-2] ],
    // Filipina
    [ [120,15],[125,15],[125,10],[120,10],[120,15] ],
    // Jepang
    [ [130,32],[140,38],[142,40],[140,32],[130,32] ],
    // Korea
    [ [125,38],[129,38],[129,34],[125,34],[125,38] ],
    // Indochina
    [ [100,20],[109,20],[109,10],[105,8],[100,15],[100,20] ],
    // India
    [ [70,20],[88,20],[80,8],[70,20] ],
    // Arab
    [ [35,30],[50,30],[60,25],[60,15],[45,12],[35,20],[35,30] ],
    // Australia
    [ [113,-22],[130,-12],[142,-10],[153,-25],[148,-38],[115,-35],[113,-22] ],
    // Afrika
    [ [15,35],[32,30],[43,10],[20,-34],[12,-15],[10,5],[-15,15],[-10,32],[15,35] ],
    // Amerika Utara
    [ [-160,70],[-60,70],[-50,50],[-80,25],[-90,15],[-105,20],[-115,30],[-140,60],[-160,70] ],
    // Amerika Selatan
    [ [-72,12],[-35,-5],[-70,-53],[-73,-40],[-70,-20],[-80,0],[-72,12] ]
];

// Ekstrak kode bandara dari nama rute (misal: "Surabaya (SUB)" -> "SUB")
function getAirportCode(str) {
    if (!str) return 'CGK';
    const match = str.match(/\(([^)]+)\)/);
    return match ? match[1] : str;
}

// Proyeksi 3D Orthographic dari Koordinat Bola (Lon, Lat) ke Layar Canvas 2D
function project3D(lon, lat, centerX, centerY, R, rotX, rotY) {
    const phi = lat * Math.PI / 180;
    const lambda = lon * Math.PI / 180;
    
    // Cartesian koordinat pada unit bola
    const x0 = Math.cos(phi) * Math.sin(lambda);
    const y0 = Math.sin(phi);
    const z0 = Math.cos(phi) * Math.cos(lambda);
    
    // Rotasi Y (spining longitude)
    const x1 = x0 * Math.cos(rotY) - z0 * Math.sin(rotY);
    const y1 = y0;
    const z1 = x0 * Math.sin(rotY) + z0 * Math.cos(rotY);
    
    // Rotasi X (tilting latitude)
    const x2 = x1;
    const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
    
    return {
        x: centerX + R * x2,
        y: centerY - R * y2,
        visible: z2 > 0 // bagian belahan bumi depan (front hemisphere)
    };
}

// Proyeksi 3D dari titik unit yang sudah memiliki ketinggian di atas bola bumi
function project3DPoint(pt3D, centerX, centerY, R, rotX, rotY) {
    // Rotasi Y (spining longitude)
    const x1 = pt3D.x0 * Math.cos(rotY) - pt3D.z0 * Math.sin(rotY);
    const y1 = pt3D.y0;
    const z1 = pt3D.x0 * Math.sin(rotY) + pt3D.z0 * Math.cos(rotY);
    
    // Rotasi X (tilting latitude)
    const x2 = x1;
    const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
    const z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
    
    return {
        x: centerX + R * x2,
        y: centerY - R * y2,
        visible: z2 > 0
    };
}

// Menghitung titik 3D lengkungan di atas bola bumi (rute lengkung 3D)
function getArcPoint3D(origin, dest, t, heightFactor = 0.12) {
    const phi1 = origin.lat * Math.PI / 180;
    const lam1 = origin.lon * Math.PI / 180;
    const phi2 = dest.lat * Math.PI / 180;
    const lam2 = dest.lon * Math.PI / 180;
    
    // Titik 3D Asal
    const x0 = Math.cos(phi1) * Math.sin(lam1);
    const y0 = Math.sin(phi1);
    const z0 = Math.cos(phi1) * Math.cos(lam1);
    
    // Titik 3D Tujuan
    const x2 = Math.cos(phi2) * Math.sin(lam2);
    const y2 = Math.sin(phi2);
    const z2 = Math.cos(phi2) * Math.cos(lam2);
    
    // Interpolasi linier dan normalisasi (NLERP)
    let x = x0 * (1 - t) + x2 * t;
    let y = y0 * (1 - t) + y2 * t;
    let z = z0 * (1 - t) + z2 * t;
    const len = Math.sqrt(x*x + y*y + z*z);
    x /= len;
    y /= len;
    z /= len;
    
    // Kalikan dengan ketinggian rute udara
    const altitude = 1 + heightFactor * Math.sin(t * Math.PI);
    return {
        x0: x * altitude,
        y0: y * altitude,
        z0: z * altitude
    };
}

// Menggambar daratan bumi riil (dari GeoJSON) atau fallback benua lokal
function drawRealEarth(ctx, cx, cy, R, rotX, rotY) {
    const strokeColor = 'rgba(56, 189, 248, 0.45)';
    const fillColor = 'rgba(56, 189, 248, 0.06)';
    if (!worldLandGeoJSON) {
        // Fallback benua lokal jika GeoJSON belum termuat atau offline
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.fillStyle = fillColor;
        LAND_POLYGONS.forEach(poly => {
            ctx.beginPath();
            let first = true;
            let count = 0;
            for (let i = 0; i < poly.length; i++) {
                const pt = project3D(poly[i][0], poly[i][1], cx, cy, R, rotX, rotY);
                if (pt.visible) {
                    if (first) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                    first = false;
                    count++;
                } else {
                    first = true;
                }
            }
            if (count > 1) {
                ctx.stroke();
                ctx.fill();
            }
        });
        return;
    }

    // Gambar benua dari data GeoJSON bumi asli
    const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.strokeStyle = isLightMode ? '#94a3b8' : strokeColor; // daylight gray or cyan stroke
    ctx.lineWidth = 0.8;
    ctx.fillStyle = isLightMode ? '#ffffff' : 'rgba(56, 189, 248, 0.05)';  // white or cyber cyan fill

    worldLandGeoJSON.features.forEach(feature => {
        const geom = feature.geometry;
        if (geom.type === 'Polygon') {
            drawPolygon3D(ctx, geom.coordinates, cx, cy, R, rotX, rotY);
        } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach(polyCoords => {
                drawPolygon3D(ctx, polyCoords, cx, cy, R, rotX, rotY);
            });
        }
    });
}

// Helper untuk menggambar ring polygon 3D
function drawPolygon3D(ctx, coordinates, cx, cy, R, rotX, rotY) {
    const outerRing = coordinates[0];
    ctx.beginPath();
    let first = true;
    let drawCount = 0;
    
    for (let i = 0; i < outerRing.length; i++) {
        const lon = outerRing[i][0];
        const lat = outerRing[i][1];
        
        const pt = project3D(lon, lat, cx, cy, R, rotX, rotY);
        if (pt.visible) {
            if (first) {
                ctx.moveTo(pt.x, pt.y);
            } else {
                ctx.lineTo(pt.x, pt.y);
            }
            first = false;
            drawCount++;
        } else {
            first = true; // Potong segment jika garis memutar ke belahan bumi belakang
        }
    }
    if (drawCount > 1) {
        ctx.stroke();
        ctx.fill();
    }
}

// Fungsi Zoom / Fullscreen untuk Peta Penerbangan (Memindahkan DOM untuk menghindari bug transform modal)
function toggleFullscreenMap() {
    const wrapper = document.querySelector('.flight-map-wrapper');
    if (!wrapper) return;
    
    const btn = wrapper.querySelector('.btn-map-zoom');
    let backdrop = document.getElementById('map-backdrop');
    
    if (wrapper.classList.contains('fullscreen-map')) {
        // KELUAR FULLSCREEN
        wrapper.classList.remove('fullscreen-map');
        
        // Kembalikan peta ke posisinya semula di dalam modal tracker
        const placeholder = document.getElementById('map-placeholder');
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.insertBefore(wrapper, placeholder);
            placeholder.remove();
        }
        
        if (backdrop) {
            backdrop.classList.remove('show');
        }
        if (btn) btn.innerHTML = '<i class="fa-solid fa-expand"></i> Zoom';
    } else {
        // MASUK FULLSCREEN
        // Buat placeholder di modal agar tahu posisi kembalinya peta nanti
        const placeholder = document.createElement('div');
        placeholder.id = 'map-placeholder';
        wrapper.parentNode.insertBefore(placeholder, wrapper);
        
        // Pindahkan peta ke body agar lepas dari stacking context dan transform modal
        document.body.appendChild(wrapper);
        wrapper.classList.add('fullscreen-map');
        
        // Tampilkan backdrop blur gelap di body
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'map-backdrop';
            backdrop.className = 'map-fullscreen-backdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', () => toggleFullscreenMap());
        }
        backdrop.classList.add('show');
        
        if (btn) btn.innerHTML = '<i class="fa-solid fa-compress"></i> Close';
    }
    
    // Sesuaikan resolusi internal canvas dengan ukuran tampilannya secara instan
    const _dpr = window.devicePixelRatio || 1;
    setTimeout(() => {
        const canvas = document.getElementById('flight-map-canvas');
        if (canvas) {
            canvas.width = canvas.clientWidth * _dpr;
            canvas.height = canvas.clientHeight * _dpr;
            const ctx = canvas.getContext('2d');
            ctx.scale(_dpr, _dpr);
        }
    }, 50);
}

// Visualisasi Interaktif 3D Globe Penerbangan
function startFlightMapAnimation(flight) {
    stopFlightMapAnimation();
    
    const canvas = document.getElementById('flight-map-canvas');
    if (!canvas) return;
    
    // Zoom & DPI
    const dpr = window.devicePixelRatio || 1;
    let zoomLevel = 1.0;
    let targetZoomLevel = 1.0;
    let initialPinchDist = null;
    
    // Atur resolusi awal canvas agar pas dengan wadahnya
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Parse Rute
    const orgCode = flight.type === 'departure' ? 'CGK' : getAirportCode(flight.origin);
    const destCode = flight.type === 'departure' ? getAirportCode(flight.destination) : 'CGK';
    
    const origin = AIRPORT_COORDS[orgCode] || { name: flight.origin || 'Jakarta', lat: -6.126, lon: 106.656 };
    const destination = AIRPORT_COORDS[destCode] || { name: flight.destination || 'Jakarta', lat: -6.126, lon: 106.656 };
    
    // Status Telemetri
    const isStationary = ['Cancelled', 'Scheduled', 'Check-in'].includes(flight.status);
    const isLanded = ['Landed', 'Baggage Claim'].includes(flight.status);
    
    const targetSpeed = isStationary ? 0 : (isLanded ? 0 : 840);
    const targetAlt = isStationary ? 0 : (isLanded ? 0 : 36000);
    const progressPct = flight.progress / 100;
    
    // Hitung Heading (Bearing)
    const dLonRad = (destination.lon - origin.lon) * Math.PI / 180;
    const lat1Rad = origin.lat * Math.PI / 180;
    const lat2Rad = destination.lat * Math.PI / 180;
    const yVal = Math.sin(dLonRad) * Math.cos(lat2Rad);
    const xVal = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLonRad);
    let bearingDeg = Math.atan2(yVal, xVal) * 180 / Math.PI;
    bearingDeg = (bearingDeg + 360) % 360;
    const heading = Math.round(bearingDeg);
    
    // Hitung Jarak (Haversine)
    const R_EARTH = 6371;
    const dLatRad = (destination.lat - origin.lat) * Math.PI / 180;
    const aVal = Math.sin(dLatRad / 2) * Math.sin(dLatRad / 2) +
                 Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLonRad / 2) * Math.sin(dLonRad / 2);
    const cVal = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    const totalDistance = R_EARTH * cVal;
    const distanceRemaining = Math.max(0, Math.round(totalDistance * (1 - progressPct)));
    
    // Nilai awal efek berhitung HUD
    let currentSpeed = 0;
    let currentAlt = 0;
    let currentDist = totalDistance;
    let animationFrame = 0;
    
    // Tempat penyimpanan rotasi 3D Globe
    // Set rotasi awal agar otomatis terfokus pada titik tengah rute penerbangan
    const midLon = (origin.lon + destination.lon) / 2;
    const midLat = (origin.lat + destination.lat) / 2;
    
    let rotY = -midLon * Math.PI / 180;
    let rotX = midLat * Math.PI / 180;
    
    // (Zoom & DPI variables moved above canvas init)
    
    // Mouse / Touch Drag and Drop Interaction
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let dragRotX = 0;
    let dragRotY = 0;
    
    canvas.onmousedown = (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        dragRotX = rotX;
        dragRotY = rotY;
    };
    
    window.onmousemove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        rotY = dragRotY - dx * 0.0075;
        rotX = dragRotX + dy * 0.0075;
        
        // Batasi sudut kemiringan vertikal (lat) agar tidak terbalik
        rotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotX));
    };
    
    window.onmouseup = () => {
        isDragging = false;
    };
    
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        targetZoomLevel += e.deltaY > 0 ? -0.15 : 0.15;
        targetZoomLevel = Math.max(0.8, Math.min(4.0, targetZoomLevel));
    }, { passive: false });
    
    // Touchscreen gesture drag (dengan preventDefault agar tidak bentrok dengan scroll/swipe modal)
    canvas.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        if (e.touches.length === 1) {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            dragRotX = rotX;
            dragRotY = rotY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            initialPinchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: false });
    
    canvas.addEventListener('touchmove', (e) => {
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();
        
        if (isDragging && e.touches.length === 1) {
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            rotY = dragRotY - (dx * 0.0075) / zoomLevel;
            rotX = dragRotX + (dy * 0.0075) / zoomLevel;
            rotX = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotX));
        } else if (e.touches.length === 2 && initialPinchDist !== null) {
            const currentPinchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const pinchRatio = currentPinchDist / initialPinchDist;
            targetZoomLevel = Math.max(0.8, Math.min(4.0, targetZoomLevel * pinchRatio));
            initialPinchDist = currentPinchDist; // continuous pinch
        }
    }, { passive: false });
    
    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Loop Render Animasi Globe
    function drawGlobeLoop() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        animationFrame++;
        
        // Counter efek mengalir
        if (currentSpeed < targetSpeed) {
            currentSpeed = Math.min(targetSpeed, currentSpeed + Math.ceil(targetSpeed / 25));
        }
        if (currentAlt < targetAlt) {
            currentAlt = Math.min(targetAlt, currentAlt + Math.ceil(targetAlt / 25));
        }
        if (currentDist > distanceRemaining) {
            currentDist = Math.max(distanceRemaining, currentDist - (totalDistance - distanceRemaining) / 25);
        }
        
        // 1. Skala Radius dan Posisi Globe dinamis terhadap Canvas
        zoomLevel += (targetZoomLevel - zoomLevel) * 0.15;
        const logW = canvas.width / dpr;
        const logH = canvas.height / dpr;
        const cx = logW / 2;
        const cy = logH / 2;
        const R = Math.min(logW, logH) * 0.42 * zoomLevel;
        
        // Background ruang angkasa (Daylight Soft White atau Cyber Dark)
        ctx.fillStyle = isLight ? '#f8fafc' : '#09090b';
        ctx.fillRect(0, 0, logW, logH);
        
        // 2. Lingkaran Dasar Samudera Globe
        ctx.fillStyle = isLight ? '#e0f2fe' : '#080f21';
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow tipis pada batas atmosfir
        ctx.shadowBlur = isLight ? 8 : 15;
        ctx.shadowColor = isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.35)';
        ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.3)' : 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // reset shadow
        
        // 3. Grid Lintang & Bujur Globe (Latitude & Longitude Lines)
        ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.08)' : 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 0.8;
        
        // Lintang (Latitudes)
        for (let lat = -60; lat <= 60; lat += 30) {
            ctx.beginPath();
            let first = true;
            for (let lon = 0; lon <= 360; lon += 10) {
                const pt = project3D(lon, lat, cx, cy, R, rotX, rotY);
                if (pt.visible) {
                    if (first) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                    first = false;
                } else {
                    first = true;
                }
            }
            ctx.stroke();
        }
        
        // Bujur (Longitudes)
        for (let lon = 0; lon < 360; lon += 30) {
            ctx.beginPath();
            let first = true;
            for (let lat = -80; lat <= 80; lat += 5) {
                const pt = project3D(lon, lat, cx, cy, R, rotX, rotY);
                if (pt.visible) {
                    if (first) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                    first = false;
                } else {
                    first = true;
                }
            }
            ctx.stroke();
        }
        
        // 4. Batas Benua (Landmass Polygons) - Menggunakan data GeoJSON Riil
        drawRealEarth(ctx, cx, cy, R, rotX, rotY);
        
        // 5. Rute Jalur Penerbangan 3D Arc (Lengkung di Atas Bola Bumi)
        const pathPoints = [];
        const segments = 40;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const pt3D = getArcPoint3D(origin, destination, t, 0.15); // ketinggian kelengkungan rute 0.15
            const pt = project3DPoint(pt3D, cx, cy, R, rotX, rotY);
            pathPoints.push(pt);
        }
        
        // Glow latar jalur
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < pathPoints.length; i++) {
            const pt = pathPoints[i];
            if (pt.visible) {
                if (!started) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
                started = true;
            } else {
                started = false;
            }
        }
        ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Garis putus-putus merayap
        ctx.beginPath();
        started = false;
        for (let i = 0; i < pathPoints.length; i++) {
            const pt = pathPoints[i];
            if (pt.visible) {
                if (!started) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
                started = true;
            } else {
                started = false;
            }
        }
        ctx.strokeStyle = isLight ? '#0284c7' : '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -animationFrame * 0.6;
        ctx.stroke();
        ctx.setLineDash([]);
        
        // 6. Beacons Bandara (Pulsing ring pada permukaan bumi)
        const pulse = 1 + Math.sin(animationFrame * 0.08) * 0.35;
        const ptOrg = project3DPoint(getArcPoint3D(origin, destination, 0, 0), cx, cy, R, rotX, rotY);
        const ptDst = project3DPoint(getArcPoint3D(origin, destination, 1, 0), cx, cy, R, rotX, rotY);
        
        if (ptOrg.visible) {
            ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
            ctx.beginPath();
            ctx.arc(ptOrg.x, ptOrg.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(56, 189, 248, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(ptOrg.x, ptOrg.y, 7 * pulse, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
            ctx.font = 'bold 8.5px "Roboto Mono", monospace';
            ctx.fillText(orgCode, ptOrg.x - 7, ptOrg.y - 10);
        }
        
        if (ptDst.visible) {
            ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
            ctx.beginPath();
            ctx.arc(ptDst.x, ptDst.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.4)' : 'rgba(56, 189, 248, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(ptDst.x, ptDst.y, 7 * pulse, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
            ctx.font = 'bold 8.5px "Roboto Mono", monospace';
            ctx.fillText(destCode, ptDst.x - 7, ptDst.y - 10);
        }
        
        // 7. Render Pesawat Terbang 3D sesuai progress
        const tPlane = progressPct;
        const ptPlane3D = getArcPoint3D(origin, destination, tPlane, 0.15);
        const ptPlane = project3DPoint(ptPlane3D, cx, cy, R, rotX, rotY);
        
        if (ptPlane.visible) {
            // Hitung orientasi (kemiringan pesawat terhadap arah rute berikutnya)
            const tNext = Math.min(1.0, tPlane + 0.01);
            const ptPlaneNext3D = getArcPoint3D(origin, destination, tNext, 0.15);
            const ptPlaneNext = project3DPoint(ptPlaneNext3D, cx, cy, R, rotX, rotY);
            
            const planeAngle = Math.atan2(ptPlaneNext.y - ptPlane.y, ptPlaneNext.x - ptPlane.x);
            
            ctx.save();
            ctx.translate(ptPlane.x, ptPlane.y);
            ctx.rotate(planeAngle);
            
            // Bayangan pesawat bersinar (Cyber Cyan)
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#38bdf8';
            ctx.fillStyle = '#38bdf8';
            
            // Gambar Pesawat
            ctx.beginPath();
            ctx.moveTo(9, 0);       // Nose
            ctx.lineTo(-2, 3);
            ctx.lineTo(-4, 9.5);    // Wing R
            ctx.lineTo(-6.5, 9.5);
            ctx.lineTo(-4.5, 3);
            ctx.lineTo(-9, 2.2);
            ctx.lineTo(-11, 5);     // Stab R
            ctx.lineTo(-12, 5);
            ctx.lineTo(-10.5, 0);   // Tail
            ctx.lineTo(-12, -5);
            ctx.lineTo(-11, -5);    // Stab L
            ctx.lineTo(-9, -2.2);
            ctx.lineTo(-4.5, -3);
            ctx.lineTo(-6.5, -9.5);
            ctx.lineTo(-4, -9.5);   // Wing L
            ctx.lineTo(-2, -3);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
            ctx.shadowBlur = 0; // reset shadow
        }
        
        // 7.5 Label Nama Negara pada permukaan 3D Globe
        const isFullscreen = document.querySelector('.flight-map-wrapper')?.classList.contains('fullscreen-map');
        const labelFontSize = isFullscreen ? 9 : 7;
        const maxLabels = COUNTRY_LABELS.length;
        let labelCount = 0;
        
        ctx.font = `bold ${labelFontSize}px "Roboto Mono", monospace`;
        ctx.textAlign = 'center';
        
        for (let i = 0; i < COUNTRY_LABELS.length; i++) {
            const country = COUNTRY_LABELS[i];
            
            // Level of Detail (LOD) - Prevent overlapping when zoomed out
            if (zoomLevel < 1.3 && i % 4 !== 0 && country.name !== 'INDONESIA') continue;
            if (zoomLevel < 2.0 && i % 2 !== 0 && country.name !== 'INDONESIA') continue;
            // > 2.0 all countries show
            const ptC = project3D(country.lon, country.lat, cx, cy, R, rotX, rotY);
            
            if (!ptC.visible) continue;
            
            // Hanya tampilkan jika ada di dalam lingkaran bola (bukan di tepi)
            const distFromCenter = Math.sqrt((ptC.x - cx) * (ptC.x - cx) + (ptC.y - cy) * (ptC.y - cy));
            if (distFromCenter > R * 0.92) continue;
            
            // Titik penanda kecil
            ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
            ctx.beginPath();
            ctx.arc(ptC.x, ptC.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Teks nama negara
            ctx.fillStyle = 'rgba(200, 230, 255, 0.65)';
            const dispName = (typeof currentLang !== 'undefined' && currentLang === 'en' && country.name_en) ? country.name_en : country.name;
            ctx.fillText(dispName, ptC.x, ptC.y - 5);
            labelCount++;
        }
        
        ctx.textAlign = 'start'; // Reset text alignment
        
        // 8. Tampilan Cockpit Radar HUD Dashboard Telemetry di Kanan Atas
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(9, 9, 11, 0.88)';
        const hudX = logW - 122;
        const hudY = 40; // Diturunkan dari 10 ke 40 agar tidak ketutupan tombol Close
        const hudW = 112;
        const hudH = 75;
        ctx.fillRect(hudX, hudY, hudW, hudH);
        
        ctx.strokeStyle = isLight ? 'rgba(2, 132, 199, 0.35)' : 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(hudX, hudY, hudW, hudH);
        
        ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
        ctx.font = 'bold 7px "Roboto Mono", monospace';
        ctx.fillText("FLIGHT TELEMETRY", hudX + 8, hudY + 12);
        
        ctx.fillStyle = isLight ? '#64748b' : 'rgba(255, 255, 255, 0.5)';
        ctx.font = '6.5px "Roboto Mono", monospace';
        ctx.fillText("SPEED :", hudX + 8, hudY + 25);
        ctx.fillText("ALT   :", hudX + 8, hudY + 36);
        ctx.fillText("DIST  :", hudX + 8, hudY + 47);
        ctx.fillText("HDG   :", hudX + 8, hudY + 58);
        ctx.fillText("STATUS:", hudX + 8, hudY + 69);
        
        ctx.fillStyle = isLight ? '#0f172a' : '#f8fafc';
        ctx.font = 'bold 7.2px "Roboto Mono", monospace';
        ctx.fillText(`${currentSpeed} km/h`, hudX + 46, hudY + 25);
        ctx.fillText(`${currentAlt.toLocaleString()} ft`, hudX + 46, hudY + 36);
        ctx.fillText(`${Math.round(currentDist)} km`, hudX + 46, hudY + 47);
        ctx.fillText(`${heading}°`, hudX + 46, hudY + 58);
        
        if (flight.status === 'Cancelled') {
            ctx.fillStyle = '#dc2626';
        } else if (isLanded) {
            ctx.fillStyle = '#16a34a';
        } else if (flight.status === 'Delayed') {
            ctx.fillStyle = '#d97706';
        } else {
            ctx.fillStyle = isLight ? '#0284c7' : '#38bdf8';
        }
        ctx.fillText(flight.status.toUpperCase(), hudX + 46, hudY + 69);
        
        // Tampilkan petunjuk putar di kiri bawah
        ctx.fillStyle = isLight ? 'rgba(71, 85, 105, 0.6)' : 'rgba(255, 255, 255, 0.35)';
        ctx.font = '7px "Roboto Mono", monospace';
        const hintText = typeof __t === 'function' ? __t('modal_hint') : "◀ SERET MOUSE / TOUCH UNTUK MEMUTAR BUMI ▶";
        ctx.fillText(hintText, 12, canvas.height - 10);
        
        // Loop Frame
        mapAnimationId = requestAnimationFrame(drawGlobeLoop);
    }
    
    drawGlobeLoop();
}

// Bersihkan interval / requestAnimationFrame animasi map
function stopFlightMapAnimation() {
    if (mapAnimationId) {
        cancelAnimationFrame(mapAnimationId);
        mapAnimationId = null;
    }
}

/**
 * Open FIDS Info Modal
 */
let currentSelectedFlight = null;

function openModal(flight) {
    currentSelectedFlight = flight;
    const modal = document.getElementById('fids-detail-modal');
    if (!modal) return;

    // Detect terminal id: 1, 2, or 3
    let termId = '3';
    if (flight.terminal) {
        termId = String(flight.terminal);
    } else if (typeof currentTerminal !== 'undefined' && currentTerminal) {
        termId = String(currentTerminal);
    } else {
        const metaTerm = document.querySelector('meta[name="terminal"]')?.content;
        if (metaTerm) termId = metaTerm;
    }

    const themeClass = `modal-theme-t${termId}`;
    const termColor = termId === '1' ? 'var(--accent-t1)' : (termId === '2' ? 'var(--accent-t2)' : 'var(--accent-t3)');
    const termName = `Terminal ${termId} CGK`;

    const flightNum = flight.number || flight.flight_no || '--';
    const airlineName = flight.airline || 'Airlines';
    const model = getAircraftModel(flightNum, airlineName);
    const category = getAircraftCategory(model);
    const status = flight.status || 'Scheduled';

    let dotColor = '#0284c7';
    let statusBg = '#e0f2fe';
    let statusText = '#0284c7';
    let statusBorder = '#bae6fd';

    if (status === 'Boarding') {
        dotColor = '#059669'; statusBg = '#ecfdf5'; statusText = '#059669'; statusBorder = '#a7f3d0';
    } else if (status === 'Final Call') {
        dotColor = '#d97706'; statusBg = '#fffbeb'; statusText = '#d97706'; statusBorder = '#fde68a';
    } else if (status === 'Delayed') {
        dotColor = '#e11d48'; statusBg = '#fff1f2'; statusText = '#e11d48'; statusBorder = '#fecdd3';
    } else if (status === 'Cancelled') {
        dotColor = '#dc2626'; statusBg = '#fef2f2'; statusText = '#dc2626'; statusBorder = '#fca5a5';
    } else if (status === 'Departed' || status === 'Landed') {
        dotColor = '#64748b'; statusBg = '#f1f5f9'; statusText = '#475569'; statusBorder = '#cbd5e1';
    }

    const isDep = flight.type === 'departure';
    const highlightTitle = isDep ? (typeof __t === 'function' ? __t('modal_gate_departure') : 'GERBANG KEBERANGKATAN') : (typeof __t === 'function' ? __t('modal_baggage_belt') : 'SABUK PENGAMBILAN BAGASI');
    const highlightVal = isDep ? (flight.gate || 'Gate TBA') : (flight.baggage || (termId === '1' ? 'Belt 2' : (termId === '2' ? 'Belt 5' : 'Belt 8')));

    let subRightTitle = '';
    let subRightVal = formatEstimatedTime(flight.estimatedTime) || (flight.time ? `${flight.time} WIB` : '--:--');

    if (isDep) {
        if (status === 'Departed') {
            subRightTitle = typeof __t === 'function' ? __t('modal_departed_time') : 'WAKTU BERANGKAT';
            subRightVal = flight.time ? `${flight.time} WIB` : subRightVal;
        } else {
            subRightTitle = typeof __t === 'function' ? __t('modal_boarding_time_left') : 'SISA WAKTU BOARDING';
        }
    } else {
        if (status === 'Landed' || status === 'Baggage Claim') {
            subRightTitle = typeof __t === 'function' ? __t('modal_landing_time') : 'WAKTU MENDARAT';
        } else {
            subRightTitle = typeof __t === 'function' ? __t('modal_estimated_arrival') : 'ESTIMASI KEDATANGAN';
        }
    }

    const col1Title = isDep ? (typeof __t === 'function' ? __t('modal_destination_city') : 'KOTA TUJUAN') : (typeof __t === 'function' ? __t('modal_origin_city') : 'KOTA ASAL');
    const col1Val = isDep ? (flight.destination || 'Destination') : (flight.origin || 'Origin');
    const col1Sub = `${typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Scheduled' : 'Jadwal'}: ${flight.time || '--:--'} WIB`;

    const col2Title = isDep ? (typeof __t === 'function' ? __t('modal_counter_island') : 'KONTER CHECK-IN') : (typeof __t === 'function' ? __t('modal_exit_gate') : 'PINTU KELUAR');
    const col2Val = isDep ? (flight.counter || 'Row TBA') : (flight.gate || 'Gate TBA');
    const col2Sub = isDep ? `Terminal ${termId}` : (typeof currentLang !== 'undefined' && currentLang === 'en' ? `Lobby Arrival T${termId}` : `Lobi Kedatangan T${termId}`);

    const col3Title = typeof __t === 'function' ? __t('modal_aircraft_type') : 'TIPE ARMADA';
    const col3Val = model;
    const col3Sub = category;

    const closeBtnText = typeof __t === 'function' ? __t('modal_close') : 'TUTUP DETAIL';

    modal.innerHTML = `
        <div class="fids-modal-content fids-modal-executive ${themeClass}" style="position: relative;">
            <!-- Header Row -->
            <div class="modal-header-row">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="modal-terminal-badge px-3 py-1 rounded-pill small fw-bold font-digital" style="font-size: 0.75rem;">${termName}</span>
                        <span class="text-secondary small fw-medium" data-i18n="modal_flight_status">${typeof __t === 'function' ? __t('modal_flight_status') : 'STATUS PENERBANGAN'}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        ${(flight.logo && (flight.logo.startsWith('http') || flight.logo.startsWith('/') || flight.logo.startsWith('assets/') || flight.logo.includes('.'))) ? `<img src="${encodeURI(flight.logo)}" alt="" class="rounded-3 bg-white p-1" style="width: 28px; height: 28px; object-fit: contain; border: 1px solid #e2e8f0;" onerror="this.style.display='none'">` : ''}
                        <h2 class="modal-flight-title fs-3 fw-bold mb-0 text-white font-digital">${flightNum} <span class="modal-flight-airline fs-5 fw-normal text-secondary">&bull; ${airlineName}</span></h2>
                    </div>
                </div>
                <div class="text-end">
                    <span class="badge rounded-pill px-3 py-2 fw-bold d-inline-flex align-items-center gap-2 font-digital" style="background: ${statusBg}; color: ${statusText}; border: 1px solid ${statusBorder}; font-size: 0.8rem;">
                        <span class="status-pulse-dot" style="background: ${dotColor};"></span> ${status}
                    </span>
                </div>
            </div>

            <!-- Big Highlight Banner -->
            <div class="modal-highlight-banner modal-compact-highlight">
                <div>
                    <span class="small fw-bold text-uppercase d-block" style="color: ${termColor}; letter-spacing: 0.5px; font-size: 0.75rem;">${highlightTitle}</span>
                    <div class="modal-highlight-val fs-1 fw-bold font-digital" style="line-height: 1.1; margin-top: 4px;">${highlightVal}</div>
                </div>
                <div class="text-md-end text-start">
                    <span class="small fw-bold text-uppercase d-block" style="color: ${termColor}; letter-spacing: 0.5px; font-size: 0.75rem;">${subRightTitle}</span>
                    <div class="modal-highlight-sub-val fs-3 fw-bold font-digital text-white" style="margin-top: 4px;">${subRightVal}</div>
                </div>
            </div>

            <!-- 3 Info Box Grid -->
            <div class="modal-info-grid">
                <!-- Col 1 -->
                <div class="modal-info-card modal-info-card-compact">
                    <span class="text-secondary small fw-bold text-uppercase" style="font-size: 0.7rem;">${col1Title}</span>
                    <strong class="text-white fs-6 mt-1 mb-1 font-digital text-uppercase">${col1Val}</strong>
                    <span class="text-secondary small" style="font-size: 0.72rem;">${col1Sub}</span>
                </div>

                <!-- Col 2 -->
                <div class="modal-info-card modal-info-card-compact">
                    <span class="text-secondary small fw-bold text-uppercase" style="font-size: 0.7rem;">${col2Title}</span>
                    <strong class="text-white fs-6 mt-1 mb-1 font-digital">${col2Val}</strong>
                    <span class="text-secondary small" style="font-size: 0.72rem;">${col2Sub}</span>
                </div>

                <!-- Col 3: Aircraft Model -->
                <div class="modal-info-card modal-info-card-compact aircraft-card">
                    <span class="small fw-bold text-uppercase" style="color: #166534; font-size: 0.7rem;">${col3Title}</span>
                    <strong class="fs-6 mt-1 mb-1 font-digital" style="color: #15803d;">${col3Val}</strong>
                    <span class="small" style="color: #16a34a; font-size: 0.72rem;">${col3Sub}</span>
                </div>
            </div>

            <!-- Action / Close Button -->
            <div class="mt-3">
                <button class="btn btn-modern-outline rounded-pill w-100 py-2 fids-modal-close" onclick="closeModal()" data-i18n="modal_close">${closeBtnText}</button>
            </div>
        </div>
    `;

    modal.classList.add('show');
    bindModalSwipeGestures(modal);
}

/**
 * Close FIDS Info Modal
 */
function closeModal() {
    const modal = document.getElementById('fids-detail-modal');
    modal?.classList.remove('show');
    
    // Tutup mode fullscreen map jika sedang aktif dengan pemindahan DOM yang benar
    const wrapper = document.querySelector('.flight-map-wrapper');
    if (wrapper && wrapper.classList.contains('fullscreen-map')) {
        toggleFullscreenMap();
    }
    
    stopFlightMapAnimation();
}

/**
 * Dashboard live stats update
 */
function updateDashboardStats() {
    // Terminal 1 stats
    const t1Deps = TERMINAL_1_FLIGHTS.filter(f => f.type === 'departure').length;
    const t1Arrs = TERMINAL_1_FLIGHTS.filter(f => f.type === 'arrival').length;
    const t1Active = TERMINAL_1_FLIGHTS.filter(f => !['Cancelled', 'Departed', 'Landed', 'Baggage Claim'].includes(f.status)).length;
    
    const el1Deps = document.getElementById('t1-dep-count');
    const el1Arrs = document.getElementById('t1-arr-count');
    const el1Active = document.getElementById('t1-active-count');
    if (el1Deps) el1Deps.innerText = t1Deps;
    if (el1Arrs) el1Arrs.innerText = t1Arrs;
    if (el1Active) el1Active.innerText = t1Active;

    // Terminal 2 stats
    const t2Deps = TERMINAL_2_FLIGHTS.filter(f => f.type === 'departure').length;
    const t2Arrs = TERMINAL_2_FLIGHTS.filter(f => f.type === 'arrival').length;
    const t2Active = TERMINAL_2_FLIGHTS.filter(f => !['Cancelled', 'Departed', 'Landed', 'Baggage Claim'].includes(f.status)).length;
    
    const el2Deps = document.getElementById('t2-dep-count');
    const el2Arrs = document.getElementById('t2-arr-count');
    const el2Active = document.getElementById('t2-active-count');
    if (el2Deps) el2Deps.innerText = t2Deps;
    if (el2Arrs) el2Arrs.innerText = t2Arrs;
    if (el2Active) el2Active.innerText = t2Active;

    // Terminal 3 stats
    const t3Deps = TERMINAL_3_FLIGHTS.filter(f => f.type === 'departure').length;
    const t3Arrs = TERMINAL_3_FLIGHTS.filter(f => f.type === 'arrival').length;
    const t3Active = TERMINAL_3_FLIGHTS.filter(f => !['Cancelled', 'Departed', 'Landed', 'Baggage Claim'].includes(f.status)).length;
    
    const el3Deps = document.getElementById('t3-dep-count');
    const el3Arrs = document.getElementById('t3-arr-count');
    const el3Active = document.getElementById('t3-active-count');
    if (el3Deps) el3Deps.innerText = t3Deps;
    if (el3Arrs) el3Arrs.innerText = t3Arrs;
    if (el3Active) el3Active.innerText = t3Active;

    // Total flights counter
    const totalFlights = TERMINAL_1_FLIGHTS.length + TERMINAL_2_FLIGHTS.length + TERMINAL_3_FLIGHTS.length;
    const totalActive = t1Active + t2Active + t3Active;
    const elTotal = document.getElementById('total-flights');
    const elTotalActive = document.getElementById('total-active');
    if (elTotal) elTotal.innerText = totalFlights;
    if (elTotalActive) elTotalActive.innerText = totalActive;

    // Dynamic OTP calculation
    const allFlights = [...TERMINAL_1_FLIGHTS, ...TERMINAL_2_FLIGHTS, ...TERMINAL_3_FLIGHTS];
    const delayedCount = allFlights.filter(f => f.status === 'Delayed' || f.status === 'Cancelled').length;
    const otp = allFlights.length > 0 ? Math.round(((allFlights.length - delayedCount) / allFlights.length) * 100) : 95;
    const elOtp = document.getElementById('stat-otp');
    if (elOtp) elOtp.innerHTML = `<i class="fa-solid fa-chart-line text-cyan me-1"></i> ${otp}% On-Time`;
}

/**
 * Intersection Observer Scroll Reveal
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ============================================
// I18N DYNAMIC INTEGRATION
// ============================================
window.addEventListener('languageChanged', () => {
    // 1. Update dynamic FIDS table headers
    const destHdr = document.getElementById('fids-dest-hdr');
    const gateHdr = document.getElementById('fids-gate-hdr');
    if (destHdr) {
        destHdr.innerText = typeof __t === 'function' ? __t(activeTab === 'departure' ? 'hdr_dest_dep' : 'hdr_dest_arr') : (activeTab === 'departure' ? 'TUJUAN' : 'ASAL');
    }
    if (gateHdr) {
        gateHdr.innerText = typeof __t === 'function' ? __t(activeTab === 'departure' ? 'hdr_gate_dep' : 'hdr_gate_arr') : (activeTab === 'departure' ? 'GERBANG / KONTER' : 'GERBANG / SABUK');
    }

    // 2. Repopulate status dropdown
    populateStatusFilterOptions(activeTab);

    // 3. Re-render FIDS board if on terminal page
    if (document.getElementById('fids-board-list')) {
        renderFIDS();
    }

    // 4. Re-render Airlines Directory if on airlines page
    if (typeof window.__refreshAirlinesDirectory === 'function') {
        window.__refreshAirlinesDirectory();
    }
    
    // 5. Update modal if open
    const modal = document.getElementById('fids-detail-modal');
    if (modal && modal.classList.contains('show') && typeof currentSelectedFlight !== 'undefined' && currentSelectedFlight) {
        openModal(currentSelectedFlight);
    }
});

// ============================================
// WEATHER WIDGET (CGK)
// ============================================
async function initWeather() {
    const widget = document.getElementById('weather-widget');
    if (!widget) return;
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.1256&longitude=106.6558&current_weather=true');
        const data = await res.json();
        if(data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            let icon = 'fa-cloud';
            let descKey = 'wx_clear';
            if (code <= 1) { icon = 'fa-sun'; descKey = 'wx_clear'; }
            else if (code <= 3) { icon = 'fa-cloud-sun'; descKey = 'wx_cloudy'; }
            else if (code <= 49) { icon = 'fa-smog'; descKey = 'wx_fog'; }
            else if (code <= 69) { icon = 'fa-cloud-rain'; descKey = 'wx_rain'; }
            else if (code <= 79) { icon = 'fa-snowflake'; descKey = 'wx_snow'; }
            else if (code <= 99) { icon = 'fa-cloud-showers-heavy'; descKey = 'wx_storm'; }
            
            const initialText = typeof I18N_DICT !== 'undefined' ? I18N_DICT[currentLang][descKey] : 'Cerah';
            
            widget.innerHTML = `<div class="d-flex align-items-center rounded-pill px-3 py-1" style="background-color: var(--fids-bg-board); border: 1px solid var(--fids-border); backdrop-filter: blur(4px);">
                <i class="fa-solid ${icon} text-amber me-2"></i>
                <span class="fw-bold font-monospace small" style="font-size: 0.8rem; color: var(--text-white);">CGK: ${temp}&deg;C <span class="ms-1">(<span data-i18n="${descKey}">${initialText}</span>)</span></span>
            </div>`;

            const bentoTemp = document.getElementById('bento-temp');
            const bentoDesc = document.getElementById('bento-weather-desc');
            const bentoWind = document.getElementById('bento-wind');
            if (bentoTemp) bentoTemp.innerHTML = `${temp}&deg;C`;
            if (bentoDesc) {
                bentoDesc.innerHTML = `<span data-i18n="${descKey}">${initialText}</span>`;
            }
            if (bentoWind && data.current_weather.windspeed) {
                bentoWind.innerText = `${Math.round(data.current_weather.windspeed)} km/h`;
            }
        }
    } catch(err) {
        console.error('Weather fetch error:', err);
    }
}

// ============================================
// AUTO REFRESH (FRONTEND POLLING)
// ============================================
function initAutoRefresh() {
    // Refresh quietly every 60 seconds (1 minute)
    setInterval(async () => {
        if (typeof supabaseClient === 'undefined' || !supabaseClient) return;

        if (currentTerminal) {
            // Kita berada di halaman Terminal
            if (typeof fetchFlightsForTerminal === 'function') {
                const freshFlights = await fetchFlightsForTerminal(currentTerminal);
                if (freshFlights && freshFlights.length > 0) {
                    FLIGHT_DATABASE = freshFlights;
                    renderFIDS(); // Render ulang tabel tanpa kedip
                }
            }
        } else {
            // Kita berada di halaman Dashboard
            if (typeof fetchAllFlights === 'function') {
                const allData = await fetchAllFlights();
                if (allData['1'] && allData['1'].length > 0) TERMINAL_1_FLIGHTS = allData['1'];
                if (allData['2'] && allData['2'].length > 0) TERMINAL_2_FLIGHTS = allData['2'];
                if (allData['3'] && allData['3'].length > 0) TERMINAL_3_FLIGHTS = allData['3'];
                updateDashboardStats();
            }
        }
    }, 60000);
}



// ============================================
// KIOSK MODE (AUTO SCROLL)
// ============================================
function initKioskMode() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('kiosk') === 'true' && document.getElementById('fids-board-list')) {
        console.log('Kiosk mode activated: Auto-scrolling enabled.');
        
        // Hide navbar controls for cleaner kiosk look
        const navbarToggle = document.querySelector('.navbar-toggler');
        const themeToggle = document.getElementById('theme-toggle');
        const langBtns = document.querySelectorAll('[id^="lang-"]');
        if(navbarToggle) navbarToggle.style.display = 'none';
        if(themeToggle) themeToggle.style.display = 'none';
        langBtns.forEach(btn => btn.style.display = 'none');
        
        let scrollPos = 0;
        let direction = 1;
        
        setInterval(() => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) return;
            
            if (direction === 1 && scrollPos >= maxScroll) {
                direction = 0;
                setTimeout(() => { direction = -1; }, 5000); // pause 5s at bottom
            } else if (direction === -1 && scrollPos <= 0) {
                direction = 0;
                setTimeout(() => { direction = 1; }, 5000); // pause 5s at top
            }
            
            if (direction !== 0) {
                scrollPos += 1.2 * direction;
                if (scrollPos < 0) scrollPos = 0;
                if (scrollPos > maxScroll) scrollPos = maxScroll;
                window.scrollTo(0, scrollPos);
            }
        }, 30); // 33fps smooth scroll
    }
}

// ============================================
// MANUAL SYNC BUTTON (FOR ADMIN/DEMO)
// ============================================
// ADMIN SYNC BUTTON
// ============================================
function initSyncButton() {
    // Sembunyikan dari user biasa. Hanya muncul jika URL mengandung ?admin=fauzan
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') !== 'fauzan') return;

    const langBtn = document.getElementById('lang-id');
    const targetParent = langBtn ? langBtn.parentNode : null;
    if (!targetParent) return;
    
    const syncBtn = document.createElement('button');
    syncBtn.className = 'btn-theme-toggle me-3';
    syncBtn.title = 'Tarik Jadwal Hari Ini (Manual Sync)';
    syncBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i>';
    syncBtn.style.color = 'var(--fids-amber)'; // Make it stand out slightly
    
    syncBtn.addEventListener('click', async () => {
        const isConfirm = confirm("Tarik jadwal penerbangan hari ini dari satelit AeroDataBox?\n(Akan memakan 2 Kuota API dari batas bulanan Anda)");
        if (!isConfirm) return;
        
        syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        syncBtn.disabled = true;
        
        try {
            const res = await fetch('https://qqeyrvrekivrribftvwk.supabase.co/functions/v1/sync-flights', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer sb_publishable_2wsztIh30XZgzlreXsAu6Q_Ak5Qgntj',
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            if (data.success) {
                alert(`Berhasil! ${data.inserted} penerbangan berhasil ditarik ke database.\nHalaman akan dimuat ulang untuk menampilkan jadwal baru.`);
                window.location.reload();
            } else {
                alert("Gagal menarik data: " + (data.error || "Unknown error"));
            }
        } catch(err) {
            alert("Terjadi kesalahan koneksi saat menyedot data.");
            console.error(err);
        } finally {
            syncBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i>';
            syncBtn.disabled = false;
        }
    });
    
    targetParent.insertBefore(syncBtn, langBtn);
}

// ============================================
// HOMEPAGE QUICK FLIGHT SEARCH
// ============================================
function initQuickSearch() {
    const input = document.getElementById('quick-search-input');
    const dropdown = document.getElementById('quick-search-dropdown');
    if (!input || !dropdown) return;

    let debounceTimer = null;

    function doSearch() {
        const query = (input.value || '').trim();
        if (query.length === 0) {
            dropdown.classList.remove('show');
            dropdown.innerHTML = '';
            return;
        }

        const allFlights = [
            ...TERMINAL_1_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '1' })),
            ...TERMINAL_2_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '2' })),
            ...TERMINAL_3_FLIGHTS.map(f => ({ ...f, terminal: f.terminal || '3' }))
        ];
        const cleanQ = query.toLowerCase().replace(/[^a-z0-9]/g, '');

        const matches = allFlights.filter(f => {
            const fn = (f.number || f.flight_no || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const al = (f.airline || '').toLowerCase();
            const dest = (f.destination || '').toLowerCase();
            const orig = (f.origin || '').toLowerCase();
            return fn.includes(cleanQ) || al.includes(query.toLowerCase()) || dest.includes(query.toLowerCase()) || orig.includes(query.toLowerCase());
        }).slice(0, 5);

        if (matches.length === 0) {
            const noMatchMsg = typeof __t === 'function' ? __t('no_flights_match') : 'Tidak ada penerbangan yang cocok dengan';
            dropdown.innerHTML = `
                <div class="p-3 text-center text-secondary small" data-i18n="quick_search_no_results">
                    <i class="fa-solid fa-plane-slash me-1"></i> ${noMatchMsg} "${query}"
                </div>
            `;
            dropdown.classList.add('show');
            return;
        }

        const foundText = typeof __t === 'function' ? __t('quick_search_found') : 'Hasil Pencarian';
        const escText = typeof __t === 'function' ? __t('quick_search_esc') : 'Tekan ESC untuk menutup';
        let html = `<div class="px-3 py-2 small text-secondary border-bottom border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
            <span style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em;"><span data-i18n="quick_search_found">${foundText}</span> (${matches.length})</span>
            <span style="font-size: 0.7rem;" data-i18n="quick_search_esc">${escText}</span>
        </div>`;

        matches.forEach(f => {
            const term = f.terminal || '3';
            const flightNum = f.number || f.flight_no || '';
            const termColor = term === '1' ? 'var(--accent-t1)' : (term === '2' ? 'var(--accent-t2)' : 'var(--accent-t3)');
            const statusKey = f.status || 'Scheduled';
            const isBoarding = statusKey === 'Boarding';
            const isFinalCall = statusKey === 'Final Call';
            const dotClass = isBoarding ? 'pulse-green' : (isFinalCall ? 'pulse-amber' : 'dot-slate');

            html += `
                <a href="terminal${term}.html?flight=${encodeURIComponent(flightNum)}" class="quick-search-item">
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge font-digital px-2 py-1" style="background: #f1f5f9; color: var(--text-primary); font-size: 0.85rem; border: 1px solid #cbd5e1;">${flightNum}</span>
                        <div>
                            <div class="fw-bold small text-white">${f.airline || 'Airline'} &bull; ${f.destination || f.origin || 'Route'}</div>
                            <div class="text-secondary" style="font-size: 0.75rem;">${f.time || ''} WIB &bull; <span style="color: ${termColor}; font-weight: 600;">Terminal ${term}</span> &bull; ${f.gate || 'Gate -'}</div>
                        </div>
                    </div>
                    <div>
                        <span class="status-pill-modern ${isBoarding ? 'status-pill-boarding' : (isFinalCall ? 'status-pill-final-call' : 'status-pill-scheduled')}">
                            <span class="status-pulse-dot ${dotClass}"></span> ${statusKey}
                        </span>
                    </div>
                </a>
            `;
        });

        dropdown.innerHTML = html;
        dropdown.classList.add('show');
    }

    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(doSearch, 150);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdown.classList.remove('show');
            input.blur();
        }
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

// ============================================
// AIRLINES DIRECTORY BENTO SYSTEM
// ============================================
const AIRLINE_DATABASE = [
    { code: 'GA', name: 'Garuda Indonesia', country: 'Indonesia', category: 'Flag Carrier', terminals: ['3'], zone: 'Row F (Domestik & Intl)', contact: '0804-1-807-807', website: 'https://www.garuda-indonesia.com', logo: 'https://images.kiwi.com/airlines/128/GA.png' },
    { code: 'SQ', name: 'Singapore Airlines', country: 'Singapore', category: 'Full Service Intl', terminals: ['3'], zone: 'Row C11 - C18 (Intl)', contact: '(021) 5790-3747', website: 'https://www.singaporeair.com', logo: 'https://images.kiwi.com/airlines/128/SQ.png' },
    { code: 'QR', name: 'Qatar Airways', country: 'Qatar', category: '5-Star Airline Intl', terminals: ['3'], zone: 'Row A11 - A20 (Intl)', contact: '(021) 550-2525', website: 'https://www.qatarairways.com', logo: 'https://images.kiwi.com/airlines/128/QR.png' },
    { code: 'EK', name: 'Emirates', country: 'Uni Emirat Arab', category: 'Global Flagship', terminals: ['3'], zone: 'Row B01 - B10 (Intl)', contact: '(021) 2934-5555', website: 'https://www.emirates.com', logo: 'https://images.kiwi.com/airlines/128/EK.png' },
    { code: 'NH', name: 'All Nippon Airways (ANA)', country: 'Jepang', category: '5-Star Airline Intl', terminals: ['3'], zone: 'Row C01 - C10 (Intl)', contact: '(021) 5797-4384', website: 'https://www.ana.co.jp', logo: 'https://images.kiwi.com/airlines/128/NH.png' },
    { code: 'JL', name: 'Japan Airlines (JAL)', country: 'Jepang', category: 'Full Service Intl', terminals: ['3'], zone: 'Row C19 - C26 (Intl)', contact: '(021) 572-3211', website: 'https://www.jal.co.jp', logo: 'https://images.kiwi.com/airlines/128/JL.png' },
    { code: 'CX', name: 'Cathay Pacific', country: 'Hong Kong', category: 'Full Service Intl', terminals: ['3'], zone: 'Row D01 - D10 (Intl)', contact: '(021) 515-1747', website: 'https://www.cathaypacific.com', logo: 'https://images.kiwi.com/airlines/128/CX.png' },
    { code: 'EY', name: 'Etihad Airways', country: 'Uni Emirat Arab', category: 'Premium Carrier', terminals: ['3'], zone: 'Row B11 - B20 (Intl)', contact: '(021) 520-2268', website: 'https://www.etihad.com', logo: 'https://images.kiwi.com/airlines/128/EY.png' },
    { code: 'SV', name: 'Saudia', country: 'Arab Saudi', category: 'National Carrier', terminals: ['3'], zone: 'Row A01 - A10 (Intl)', contact: '(021) 8378-7777', website: 'https://www.saudia.com', logo: 'https://images.kiwi.com/airlines/128/SV.png' },
    { code: 'TK', name: 'Turkish Airlines', country: 'Turki', category: 'Global Carrier', terminals: ['3'], zone: 'Row B21 - B26 (Intl)', contact: '(021) 550-7186', website: 'https://www.turkishairlines.com', logo: 'https://images.kiwi.com/airlines/128/TK.png' },
    { code: 'QG', name: 'Citilink', country: 'Indonesia', category: 'LCC Garuda Group', terminals: ['3'], zone: 'Row E (Domestik & Intl)', contact: '0804-1-080-808', website: 'https://www.citilink.co.id', logo: 'https://images.kiwi.com/airlines/128/QG.png' },
    { code: 'JT', name: 'Lion Air', country: 'Indonesia', category: 'Main Domestic Carrier', terminals: ['1'], zone: 'Row 1-4 (Domestik)', contact: '(021) 6379-8000', website: 'https://www.lionair.co.id', logo: 'https://images.kiwi.com/airlines/128/JT.png' },
    { code: 'ID', name: 'Batik Air', country: 'Indonesia', category: 'Full Service Domestic & LCC', terminals: ['1', '2'], zone: 'T1 Row 5-8 & T2 Row 4', contact: '(021) 6379-8000', website: 'https://www.batikair.com', logo: 'https://images.kiwi.com/airlines/128/ID.png' },
    { code: 'IW', name: 'Wings Air', country: 'Indonesia', category: 'Regional Feeder', terminals: ['1'], zone: 'Row 9-10 (Domestik)', contact: '(021) 6379-8000', website: 'https://www.lionair.co.id', logo: 'https://images.kiwi.com/airlines/128/IW.png' },
    { code: 'SJ', name: 'Sriwijaya Air', country: 'Indonesia', category: 'Domestic Carrier', terminals: ['1'], zone: 'Row 11-14 (Domestik)', contact: '(021) 2927-9777', website: 'https://www.sriwijayaair.co.id', logo: 'https://images.kiwi.com/airlines/128/SJ.png' },
    { code: 'IN', name: 'NAM Air', country: 'Indonesia', category: 'Domestic Carrier', terminals: ['1'], zone: 'Row 15-16 (Domestik)', contact: '(021) 2927-9777', website: 'https://www.flynamair.com', logo: 'https://images.kiwi.com/airlines/128/IN.png' },
    { code: 'QZ', name: 'AirAsia Indonesia', country: 'Indonesia / Malaysia', category: 'LCC Domestik & Intl', terminals: ['2'], zone: 'Row 1-3 (Domestik & Intl)', contact: 'support.airasia.com', website: 'https://www.airasia.com', logo: 'https://images.kiwi.com/airlines/128/QZ.png' },
    { code: 'IU', name: 'Super Air Jet', country: 'Indonesia', category: 'Millennial LCC', terminals: ['2'], zone: 'Row 4-6 (Domestik)', contact: '(021) 6379-8000', website: 'https://www.superairjet.com', logo: 'https://images.kiwi.com/airlines/128/IU.png' },
    { code: 'IP', name: 'Pelita Air', country: 'Indonesia', category: 'Medium Service Domestic', terminals: ['2'], zone: 'Row 7-8 (Domestik)', contact: '(021) 2977-8888', website: 'https://www.pelita-air.com', logo: 'https://images.kiwi.com/airlines/128/IP.png' },
    { code: 'TR', name: 'Scoot', country: 'Singapore', category: 'Low-Cost Carrier Intl', terminals: ['2'], zone: 'Row 2 (Intl)', contact: '+65 3157 6434', website: 'https://www.flyscoot.com', logo: 'https://images.kiwi.com/airlines/128/TR.png' },
    { code: '3K', name: 'Jetstar Asia', country: 'Singapore', category: 'Low-Cost Carrier Intl', terminals: ['2'], zone: 'Row 3 (Intl)', contact: '(021) 2555-6339', website: 'https://www.jetstar.com', logo: 'https://images.kiwi.com/airlines/128/3K.png' }
];

function initAirlinesDirectory() {
    const grid = document.getElementById('airline-bento-grid');
    if (!grid) return;

    const searchInput = document.getElementById('airline-search-input');
    const termBtns = document.querySelectorAll('.airline-term-btn');
    const countBadge = document.getElementById('active-airlines-count');

    let currentTermFilter = 'all';
    let searchQuery = '';

    function renderCards() {
        const cleanQuery = searchQuery.toLowerCase().trim();
        const filtered = AIRLINE_DATABASE.filter(a => {
            const matchesTerm = currentTermFilter === 'all' || a.terminals.includes(currentTermFilter);
            const matchesQuery = !cleanQuery || 
                a.name.toLowerCase().includes(cleanQuery) ||
                a.code.toLowerCase().includes(cleanQuery) ||
                a.country.toLowerCase().includes(cleanQuery) ||
                a.zone.toLowerCase().includes(cleanQuery);
            return matchesTerm && matchesQuery;
        });

        if (countBadge) countBadge.textContent = filtered.length;

        if (filtered.length === 0) {
            const noAirlinesTitle = typeof __t === 'function' ? __t('no_airlines_found') : 'Tidak Ada Maskapai Ditemukan';
            const noAirlinesDesc = typeof __t === 'function' ? __t('no_airlines_desc') : 'Coba gunakan kata kunci pencarian lain atau pilih tab terminal yang berbeda.';
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="p-4 rounded-4" style="background: #f8fafc; border: 1px dashed var(--border-subtle); max-width: 480px; margin: 0 auto;">
                        <i class="fa-solid fa-plane-slash text-secondary fs-2 mb-3"></i>
                        <h5 class="text-white" data-i18n="no_airlines_found">${noAirlinesTitle}</h5>
                        <p class="text-secondary small mb-0" data-i18n="no_airlines_desc">${noAirlinesDesc}</p>
                    </div>
                </div>
            `;
            return;
        }

        const termZoneLabel = typeof __t === 'function' ? __t('airlines_term_zone_checkin') : 'TERMINAL & ZONA CHECK-IN';
        const viewSchedLabel = typeof __t === 'function' ? __t('view_schedule') : 'Lihat Jadwal';
        const officialWebTitle = typeof __t === 'function' ? __t('official_website') : 'Website Resmi';

        let html = '';
        filtered.forEach(a => {
            const primaryTerm = a.terminals[0] || '3';
            const termBadgeColor = primaryTerm === '1' ? 'var(--accent-t1)' : (primaryTerm === '2' ? 'var(--accent-t2)' : 'var(--accent-t3)');
            const termBg = primaryTerm === '1' ? '#e0f2fe' : (primaryTerm === '2' ? '#f5f3ff' : '#fffbeb');

            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="airline-card-bento h-100">
                        <!-- Watermark Brand Logo (Layer 1) -->
                        <div class="airline-card-logo-watermark">
                            <img src="${a.logo}" alt="${a.name}" loading="lazy" onerror="this.parentElement.style.display='none'">
                        </div>

                        <!-- Card Body Content (Layer 2) -->
                        <div class="airline-card-body-content d-flex flex-column h-100">
                            <div>
                                <div class="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <span class="badge font-digital px-2 py-1 mb-2 d-inline-block" style="background: ${termBg}; color: ${termBadgeColor}; border: 1px solid ${termBadgeColor}40; font-size: 0.95rem; font-weight: 700;">
                                            ${a.code}
                                        </span>
                                        <h4 class="brand-font fs-4 text-white mb-1">${a.name}</h4>
                                        <span class="text-secondary small d-flex align-items-center gap-1">
                                            <i class="fa-solid fa-globe opacity-50"></i> ${a.country} &bull; ${a.category || 'Scheduled Carrier'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div class="p-3 rounded-3 mb-3" style="background: #f8fafc; border: 1px solid var(--border-subtle);">
                                    <span class="text-secondary d-block small mb-1" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.5px;" data-i18n="airlines_term_zone_checkin">${termZoneLabel}</span>
                                    <strong class="fs-6 d-block" style="font-family: var(--font-mono); color: ${termBadgeColor} !important;">
                                        Terminal ${a.terminals.join(' & ')} &mdash; ${a.zone}
                                    </strong>
                                    ${a.contact ? `
                                    <div class="mt-2 pt-2 border-top border-secondary border-opacity-10 d-flex align-items-center justify-content-between">
                                        <span class="text-secondary small" style="font-size: 0.75rem;"><i class="fa-solid fa-phone me-1"></i> ${a.contact}</span>
                                    </div>` : ''}
                                </div>
                            </div>

                            <div class="d-flex gap-2 pt-2 mt-auto">
                                <a href="terminal${primaryTerm}.html?search=${encodeURIComponent(a.name)}" class="btn btn-sm btn-outline-cyan flex-grow-1 d-flex align-items-center justify-content-center gap-2" style="font-size: 0.8rem; padding: 7px 12px; border-radius: 8px;">
                                    <i class="fa-solid fa-list-check"></i> <span data-i18n="view_schedule">${viewSchedLabel}</span>
                                </a>
                                ${a.website ? `
                                <a href="${a.website}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" style="width: 36px; padding: 7px 0; border-radius: 8px;" title="${officialWebTitle}">
                                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        grid.innerHTML = html;
    }

    // Expose for dynamic i18n re-rendering
    window.__refreshAirlinesDirectory = renderCards;

    searchInput?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCards();
    });

    termBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            termBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTermFilter = btn.dataset.terminal || 'all';
            renderCards();
        });
    });

    renderCards();
}
