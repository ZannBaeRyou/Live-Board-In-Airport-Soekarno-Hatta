const assert = require('assert');
const fs = require('fs');
const path = require('path');

const mainJs = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'main.js'), 'utf-8');
const i18nJs = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'i18n.js'), 'utf-8');

// 1. Verify Escape keydown listener
assert(mainJs.includes("e.key === 'Escape'") && mainJs.includes("closeModal"), 'main.js must have global Escape keydown listener to close modal');

// 2. Verify status-adaptive banner titles in openModal()
assert(mainJs.includes("modal_departed_time"), 'openModal must use modal_departed_time for departed flights');
assert(mainJs.includes("modal_estimated_arrival"), 'openModal must use modal_estimated_arrival for scheduled arrivals');
assert(i18nJs.includes("modal_departed_time"), 'i18n.js must define modal_departed_time');
assert(i18nJs.includes("modal_estimated_arrival"), 'i18n.js must define modal_estimated_arrival');

// 3. Verify mobile touch gestures are bound dynamically or to modal container
assert(mainJs.includes('bindModalSwipeGestures') || mainJs.includes('modal.addEventListener(\'touchstart\''), 'main.js must bind swipe gestures to modal container or via dynamic helper');

console.log('PASS: Modal fixes verified');
