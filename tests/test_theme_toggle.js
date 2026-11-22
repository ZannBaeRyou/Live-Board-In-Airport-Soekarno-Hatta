// tests/test_theme_toggle.js (Light Mode Lock)
const fs = require('fs');

const i18n = fs.readFileSync('assets/js/i18n.js', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');
const pages = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html', 'airlines.html'];

// 1. Check i18n.js permanently locks to 'light' mode
if (!i18n.includes("currentTheme = 'light'")) {
    console.error("FAIL: i18n.js must permanently lock to 'light' mode");
    process.exit(1);
}

// 2. Check dark mode block is removed from style.css
if (css.includes('[data-theme="dark"] {')) {
    console.error("FAIL: style.css must not contain [data-theme=\"dark\"] block");
    process.exit(1);
}

// 3. Check all 5 HTML pages do NOT contain #theme-toggle-btn
for (const p of pages) {
    const html = fs.readFileSync(p, 'utf-8');
    if (html.includes('id="theme-toggle-btn"') || html.includes("id='theme-toggle-btn'")) {
        console.error(`FAIL: ${p} must have removed #theme-toggle-btn`);
        process.exit(1);
    }
}

console.log("PASS: Permanent Clean Light Mode verified, dark mode completely removed");
