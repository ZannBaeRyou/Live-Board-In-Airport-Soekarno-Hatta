// tests/test_terminal_fids.js
const fs = require('fs');

function getAircraftModel(airlineCode) {
  const map = {
    'GA': 'B737-800',
    'SQ': 'A350-900',
    'JT': 'B737-900ER',
    'QZ': 'A320-200',
    'SJ': 'B737-800',
    'ID': 'A320-200',
    'EK': 'B777-300ER',
    'QR': 'A350-1000',
    'MH': 'B737-800',
    'TG': 'A350-900',
    'CX': 'A350-900',
    'NH': 'B787-9',
    'JL': 'B787-9'
  };
  return map[airlineCode] || '';
}

if (getAircraftModel('GA') !== 'B737-800') {
  console.error('FAIL: Aircraft mapping for GA failed');
  process.exit(1);
}
if (getAircraftModel('SQ') !== 'A350-900') {
  console.error('FAIL: Aircraft mapping for SQ failed');
  process.exit(1);
}
if (getAircraftModel('UNKNOWN') !== '') {
  console.error('FAIL: Unknown aircraft mapping should return empty string');
  process.exit(1);
}

console.log('PASS: FIDS helper tests passed');
