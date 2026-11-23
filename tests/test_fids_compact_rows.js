const fs = require('fs');
const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Cek adanya class penanda compact di main.js
if (!mainJs.includes('fids-compact-row') || !mainJs.includes('fids-mobile-top-row') || !mainJs.includes('fids-mobile-bottom-row')) {
    console.error('FAIL: main.js is missing compact 2-tier mobile row structure');
    process.exit(1);
}

// 2. Cek bahwa event listener modal klik tetap ada
if (!mainJs.includes("row.addEventListener('click', () => openModal(flight))")) {
    console.error('FAIL: openModal click handler missing on flight row');
    process.exit(1);
}

// 3. Cek CSS compact row height & padding di mobile
if (!css.includes('.fids-row-modern') || !css.includes('status-pill-compact')) {
    console.error('FAIL: style.css missing compact status pill and row padding');
    process.exit(1);
}

console.log('PASS: FIDS ultra-dense compact row layout verified');
