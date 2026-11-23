const fs = require('fs');
const path = require('path');
const assert = require('assert');

const mainJs = fs.readFileSync(path.join(__dirname, '../assets/js/main.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../assets/css/style.css'), 'utf8');

// 1. Verify modal header row has clean two-row structure (badge row + title row)
assert(mainJs.includes('modal-terminal-badge') && mainJs.includes('modal-flight-title'), 'main.js must define modal-terminal-badge and modal-flight-title');
assert(!mainJs.includes('data-i18n="modal_flight_status"') || mainJs.includes('justify-content-between'), 'modal header must not squeeze status text between badges');

// 2. Verify destination formatting separates or cleans airport code to prevent line break orphans
assert(mainJs.includes('modal-card-airport-code') || mainJs.includes('locCode') || mainJs.includes('modal-card-city'), 'main.js must cleanly format destination to prevent awkward line breaks');

// 3. Verify aircraft card structure has balanced 2-sided layout (info left, badge right)
assert(mainJs.includes('aircraft-card-info') || mainJs.includes('aircraft-card-badge-wrap') || mainJs.includes('aircraft-category-pill'), 'main.js must structure aircraft card with 2-sided symmetrical layout');

// 4. Verify style.css styles aircraft card as pill and sets clean alignment
assert(css.includes('aircraft-card'), 'style.css must style aircraft-card');
assert(css.includes('border-radius: 9999px') || css.includes('border-radius: 20px'), 'aircraft-card must be rounded');

console.log('PASS: test_modal_mobile_symmetry verified');
