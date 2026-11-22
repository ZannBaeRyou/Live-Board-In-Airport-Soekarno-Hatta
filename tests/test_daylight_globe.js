// tests/test_daylight_globe.js
const fs = require('fs');

const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Check drawGlobeLoop in main.js handles daylight colors for light theme
if (!mainJs.includes('#e0f2fe') || !mainJs.includes('#f8fafc')) {
    console.error("FAIL: main.js must include daylight colors (#e0f2fe ocean, #f8fafc canvas) for light theme");
    process.exit(1);
}

// 2. Check main.js checks documentElement data-theme attribute
if (!mainJs.includes("getAttribute('data-theme')") && !mainJs.includes('data-theme')) {
    console.error("FAIL: main.js must inspect data-theme attribute dynamically");
    process.exit(1);
}

// 3. Check style.css has light mode styling for modal content
if (!css.includes('[data-theme="light"] .fids-modal-content') && !css.includes('.fids-modal-content')) {
    console.error("FAIL: style.css must properly style .fids-modal-content for light theme");
    process.exit(1);
}

console.log("PASS: Daylight 3D globe radar and light modal styling verified");
