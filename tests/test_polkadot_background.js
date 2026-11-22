// tests/test_polkadot_background.js
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
const adminHtmlPath = path.join(__dirname, '..', 'admin-status.html');
const css = fs.readFileSync(cssPath, 'utf-8');
const adminHtml = fs.readFileSync(adminHtmlPath, 'utf-8');

// 1. Check style.css has grey polka dot radial gradient on body
if (!css.includes('radial-gradient(circle, #94a3b8') || !css.includes('background-size: 24px 24px;')) {
    console.error('FAIL: style.css must define grey polka dot background on body');
    process.exit(1);
}

// 2. Check admin-status.html also has the grey polka dot background
if (!adminHtml.includes('radial-gradient(circle, #94a3b8') || !adminHtml.includes('background-size: 24px 24px;')) {
    console.error('FAIL: admin-status.html must define grey polka dot background');
    process.exit(1);
}

// 3. Check .footer-fids is transparent to let the polka dot pattern flow continuously
if (!css.includes('.footer-fids') || !css.includes('background-color: transparent;')) {
    console.error('FAIL: style.css must define .footer-fids background-color: transparent');
    process.exit(1);
}

console.log('PASS: Global grey polka dot background pattern verified across all pages');
