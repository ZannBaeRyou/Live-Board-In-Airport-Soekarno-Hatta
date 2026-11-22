// tests/test_theme_toggle.js
const fs = require('fs');

const i18n = fs.readFileSync('assets/js/i18n.js', 'utf-8');
const pages = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html', 'airlines.html'];

// 1. Check i18n.js defaults to 'light'
if (!i18n.includes("currentTheme = localStorage.getItem('liveboard_theme') || 'light'") && !i18n.includes("currentTheme = 'light'")) {
    console.error("FAIL: i18n.js must default to 'light' mode");
    process.exit(1);
}

// 2. Check toggleTheme function is defined and dispatches event
if (!i18n.includes('function toggleTheme') || !i18n.includes('themechange')) {
    console.error("FAIL: i18n.js must define toggleTheme() and dispatch 'themechange' event");
    process.exit(1);
}

// 3. Check all 5 HTML pages contain #theme-toggle-btn
for (const p of pages) {
    const html = fs.readFileSync(p, 'utf-8');
    if (!html.includes('id="theme-toggle-btn"') && !html.includes("id='theme-toggle-btn'")) {
        console.error(`FAIL: ${p} must contain #theme-toggle-btn in the navbar`);
        process.exit(1);
    }
}

console.log("PASS: Theme switcher and navbar toggle buttons verified across all pages");
