// tests/test_light_theme_styles.js
const fs = require('fs');

const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Check light theme tokens in :root or [data-theme="light"]
if (!css.includes('--bg-primary: #f8fafc') && !css.includes('--bg-primary:#f8fafc')) {
    console.error("FAIL: style.css must define --bg-primary: #f8fafc for clean light theme");
    process.exit(1);
}

if (!css.includes('--text-primary: #0f172a') && !css.includes('--text-primary:#0f172a')) {
    console.error("FAIL: style.css must define --text-primary: #0f172a for WCAG AAA contrast");
    process.exit(1);
}

if (!css.includes('--bg-surface: #ffffff') && !css.includes('--bg-surface:#ffffff')) {
    console.error("FAIL: style.css must define --bg-surface: #ffffff for card surfaces");
    process.exit(1);
}

if (!css.includes('--border-subtle: #e2e8f0') && !css.includes('--border-subtle:#e2e8f0')) {
    console.error("FAIL: style.css must define --border-subtle: #e2e8f0");
    process.exit(1);
}

// 2. Check light theme rules for FIDS row and bento cards
if (!css.includes('[data-theme="light"] .fids-row-modern') && !css.includes('.fids-row-modern')) {
    console.error("FAIL: style.css must properly style .fids-row-modern for light mode");
    process.exit(1);
}

console.log("PASS: Changi clean light theme CSS tokens and rules verified");
