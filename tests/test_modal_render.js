// tests/test_modal_render.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const mainJs = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'main.js'), 'utf-8');

assert(mainJs.includes('modal_gate_departure'), 'openModal must use modal_gate_departure');
assert(mainJs.includes('modal_aircraft_type'), 'openModal must use modal_aircraft_type');
assert(mainJs.includes('modal_baggage_belt'), 'openModal must use modal_baggage_belt');
assert(mainJs.includes('getAircraftCategory'), 'main.js must define getAircraftCategory()');
console.log('PASS: openModal engine verified');
