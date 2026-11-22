// tests/test_quick_search.js
const mockFlights = [
  { flight_no: 'GA-206', airline: 'Garuda Indonesia', destination: 'Yogyakarta', terminal: '3', status: 'Boarding' },
  { flight_no: 'SQ-951', airline: 'Singapore Airlines', destination: 'Singapore', terminal: '3', status: 'Final Call' },
  { flight_no: 'JT-610', airline: 'Lion Air', destination: 'Pangkal Pinang', terminal: '1', status: 'Scheduled' },
  { flight_no: 'QZ-202', airline: 'AirAsia', destination: 'Kuala Lumpur', terminal: '2', status: 'Check-in' }
];

function filterFlights(query, flights) {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  return flights.filter(f => {
    const fn = (f.flight_no || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const al = (f.airline || '').toLowerCase();
    const dest = (f.destination || '').toLowerCase();
    return fn.includes(q) || al.includes(query.toLowerCase()) || dest.includes(query.toLowerCase());
  }).slice(0, 5);
}

const res1 = filterFlights('ga 206', mockFlights);
if (res1.length !== 1 || res1[0].flight_no !== 'GA-206') {
  console.error('FAIL: Query "ga 206" failed');
  process.exit(1);
}

const res2 = filterFlights('lion', mockFlights);
if (res2.length !== 1 || res2[0].airline !== 'Lion Air') {
  console.error('FAIL: Query "lion" failed');
  process.exit(1);
}

const res3 = filterFlights('nonexistentflight999', mockFlights);
if (res3.length !== 0) {
  console.error('FAIL: Non-existent query should return empty array');
  process.exit(1);
}

console.log('PASS: Quick search filtering unit tests passed');
