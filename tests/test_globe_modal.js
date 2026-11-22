// tests/test_globe_modal.js
const fs = require('fs');
const i18n = fs.readFileSync('assets/js/i18n.js', 'utf-8');
const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Theme Management in i18n.js
if (!i18n.includes("currentTheme = localStorage.getItem('liveboard_theme') || 'light'") && !i18n.includes("toggleTheme")) {
  console.error("FAIL: i18n.js must manage light/dark theme dynamically with persistence");
  process.exit(1);
}

// 2. 3D Globe Radar Canvas in main.js must not render legacy muddy cream
if (mainJs.includes("'#F5F3EC'") || mainJs.includes("'#EBE8DF'")) {
  console.error("FAIL: main.js still has legacy light-mode muddy cream canvas background (#F5F3EC)");
  process.exit(1);
}

// 3. Modal styling in style.css must use sleek border, not harsh yellow outline
if (css.includes('.fids-modal-content') && css.includes('border: 2px solid var(--accent-gold)')) {
  console.error("FAIL: .fids-modal-content still has harsh yellow border");
  process.exit(1);
}

console.log("PASS: Modern dynamic 3D globe radar and modal verified");
