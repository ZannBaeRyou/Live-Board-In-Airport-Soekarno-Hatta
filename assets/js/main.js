/**
 * CGK Soekarno-Hatta FIDS (Flight Information Display System)
 * Supports Terminal 1, 2, and 3
 * Controls tabs, search filters, live clock, and flight details tracking modal.
 */

// ============================================
// FLIGHT DATABASES PER TERMINAL
// ============================================

const TERMINAL_1_FLIGHTS = [
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

const TERMINAL_2_FLIGHTS = [
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

const TERMINAL_3_FLIGHTS = [
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

document.addEventListener('DOMContentLoaded', () => {
    // 1. Fadeout Loader
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 400);
    }

    // 2. Detect which terminal page we're on
    const terminalMeta = document.querySelector('meta[name="terminal"]');
    if (terminalMeta) {
        currentTerminal = terminalMeta.content;
        FLIGHT_DATABASE = TERMINAL_MAP[currentTerminal] || [];
        initFIDSBoard();
    }

    // 3. Start Real-Time FIDS Clock (GMT+7 WIB)
    initFIDSClock();

    // 4. Scroll animations
    initScrollReveal();

    // 5. Dashboard live stats
    updateDashboardStats();
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

    // Initial Render
    renderFIDS();

    // Modal close listeners
    const modal = document.getElementById('fids-detail-modal');
    const closeBtn = modal?.querySelector('.fids-modal-close');
    closeBtn?.addEventListener('click', () => closeModal());
    
    // Close modal if clicked outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
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
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/**
 * Tab Toggling Logic
 */
function switchTab(tabType) {
    activeTab = tabType;
    
    const btnDepartures = document.getElementById('tab-departures');
    const btnArrivals = document.getElementById('tab-arrivals');

    if (tabType === 'departure') {
        btnDepartures?.classList.add('active');
        btnArrivals?.classList.remove('active');
        document.getElementById('fids-dest-hdr').innerText = 'TUJUAN';
        document.getElementById('fids-gate-hdr').innerText = 'GERBANG / KONTER';
    } else {
        btnDepartures?.classList.remove('active');
        btnArrivals?.classList.add('active');
        document.getElementById('fids-dest-hdr').innerText = 'ASAL';
        document.getElementById('fids-gate-hdr').innerText = 'GERBANG / SABUK';
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

    statusFilter.innerHTML = '<option value="">Semua Status</option>';
    
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

/**
 * Live FIDS Renderer
 */
function renderFIDS() {
    const boardList = document.getElementById('fids-board-list');
    if (!boardList) return;

    const query = document.getElementById('fids-search-input')?.value.toLowerCase() || '';
    const selectedStatus = document.getElementById('fids-status-filter')?.value || '';

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
            <div class="text-center py-5 text-muted font-digital">
                <i class="fa-solid fa-plane-slash fa-2x mb-3 text-muted"></i>
                <p class="mb-0">TIDAK ADA DATA PENERBANGAN YANG COCOK</p>
            </div>
        `;
        return;
    }

    flights.forEach(flight => {
        let statusClass = 'status-scheduled';
        let statusLabelText = flight.status.toUpperCase();

        if (flight.status === 'Check-in') statusClass = 'status-checkin';
        if (flight.status === 'Boarding' || flight.status === 'Final Call') statusClass = 'status-boarding';
        if (flight.status === 'Departed') statusClass = 'status-departed';
        if (flight.status === 'Delayed') statusClass = 'status-delayed';
        if (flight.status === 'Landed') statusClass = 'status-landed';
        if (flight.status === 'Baggage Claim') statusClass = 'status-boarding';
        if (flight.status === 'Cancelled') statusClass = 'status-cancelled';

        let gateColText = '';
        if (flight.type === 'departure') {
            gateColText = `<span class="fids-gate d-block">${flight.gate}</span>
                           <span class="text-muted d-block font-digital" style="font-size:0.75rem">${flight.counter}</span>`;
        } else {
            gateColText = `<span class="fids-gate d-block">${flight.gate}</span>
                           <span class="text-muted d-block font-digital" style="font-size:0.75rem">${flight.baggage}</span>`;
        }

        const terminalLabel = currentTerminal ? `T${currentTerminal}` : '';

        const row = document.createElement('div');
        row.className = 'fids-board-row';
        row.innerHTML = `
            <div class="row align-items-center">
                <div class="col-3 col-md-1 font-digital fids-time">${flight.time}</div>
                <div class="col-3 col-md-2 font-digital fids-flight">${flight.number}</div>
                <div class="col-6 col-md-3">
                    <span class="fids-destination d-block text-uppercase">${flight.type === 'departure' ? flight.destination : flight.origin}</span>
                    <span class="text-muted d-none d-md-inline" style="font-size:0.8rem">${flight.airline}</span>
                </div>
                <div class="col-4 col-md-2 d-none d-md-block">${gateColText}</div>
                <div class="col-4 col-md-2 font-digital text-center text-md-start text-white-50">${flight.estimatedTime.split(' ')[0]}</div>
                <div class="col-4 col-md-2 text-end font-digital text-uppercase ${statusClass}">${statusLabelText}</div>
            </div>
        `;

        row.addEventListener('click', () => openModal(flight));
        boardList.appendChild(row);
    });
}

/**
 * Open FIDS Info Modal
 */
function openModal(flight) {
    const modal = document.getElementById('fids-detail-modal');
    if (!modal) return;

    const terminalName = currentTerminal ? `Terminal ${currentTerminal}` : 'Terminal';

    document.getElementById('modal-flight-num').innerText = flight.number;
    document.getElementById('modal-airline').innerText = flight.airline;
    document.getElementById('modal-route').innerHTML = flight.type === 'departure' ? `CGK ${terminalName} &rarr; ${flight.destination}` : `${flight.origin} &rarr; CGK ${terminalName}`;
    document.getElementById('modal-scheduled-time').innerText = flight.time;
    document.getElementById('modal-actual-time').innerText = flight.estimatedTime;
    document.getElementById('modal-gate').innerText = flight.gate;
    
    const counterSec = document.getElementById('modal-counter-section');
    const baggageSec = document.getElementById('modal-baggage-section');
    
    if (flight.type === 'departure') {
        counterSec.classList.remove('d-none');
        baggageSec.classList.add('d-none');
        document.getElementById('modal-counter').innerText = flight.counter;
    } else {
        counterSec.classList.add('d-none');
        baggageSec.classList.remove('d-none');
        document.getElementById('modal-baggage').innerText = flight.baggage;
    }

    // Generate Tracker Timeline HTML
    const timelineContainer = document.getElementById('modal-timeline-container');
    timelineContainer.innerHTML = '';
    
    const progress = flight.progress;

    let nodes = [];
    if (flight.type === 'departure') {
        nodes = [
            { label: 'Check-in', triggerVal: 20 },
            { label: 'Boarding', triggerVal: 50 },
            { label: 'Final Call', triggerVal: 80 },
            { label: 'Departed', triggerVal: 100 }
        ];
    } else {
        nodes = [
            { label: 'Scheduled', triggerVal: 10 },
            { label: 'In Flight', triggerVal: 50 },
            { label: 'Landed', triggerVal: 80 },
            { label: 'Baggage', triggerVal: 100 }
        ];
    }

    let nodesHTML = '';
    nodes.forEach((node, idx) => {
        const pct = (idx / (nodes.length - 1)) * 100;
        const isActive = progress >= node.triggerVal || (idx === 0) || (flight.status === 'Cancelled' ? false : progress >= node.triggerVal);
        nodesHTML += `
            <div class="modal-timeline-node ${isActive ? 'active' : ''}" style="left: ${pct}%;"></div>
            <div class="modal-timeline-label" style="left: ${pct}%;">${node.label}</div>
        `;
    });

    timelineContainer.innerHTML = `
        <div class="modal-tracker-timeline">
            <div class="modal-timeline-line">
                <div class="modal-timeline-fill" style="width: ${progress}%;"></div>
                ${nodesHTML}
                ${progress > 0 && progress < 100 && flight.status !== 'Cancelled' ? `
                    <i class="fa-solid fa-plane modal-timeline-plane" style="left: ${progress}%;"></i>
                ` : ''}
            </div>
        </div>
    `;

    modal.classList.add('show');
}

/**
 * Close FIDS Info Modal
 */
function closeModal() {
    const modal = document.getElementById('fids-detail-modal');
    modal?.classList.remove('show');
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
