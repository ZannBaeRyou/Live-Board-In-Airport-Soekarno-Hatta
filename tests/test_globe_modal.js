// tests/test_globe_modal.js
const fs = require('fs');
const i18n = fs.readFileSync('assets/js/i18n.js', 'utf-8');
const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Permanent Dark Mode Lock in i18n.js
if (!i18n.includes("currentTheme = 'dark'") || i18n.includes("getSystemTheme()")) {
  console.error("FAIL: i18n.js must permanently lock currentTheme = 'dark' and remove light sniffing");
  process.exit(1);
}

// 2. 3D Globe Radar Canvas in main.js must not render cream/white
if (mainJs.includes("ctx.fillStyle = isLightMode ? '#F5F3EC' : '#0d172e'") || mainJs.includes("'#F5F3EC'")) {
  console.error("FAIL: main.js still has legacy light-mode cream canvas background (#F5F3EC)");
  process.exit(1);
}

// 3. Modal styling in style.css must use sleek border, not yellow outline
if (css.includes('.fids-modal-content') && css.includes('border: 2px solid var(--accent-gold)')) {
  console.error("FAIL: .fids-modal-content still has harsh yellow border");
  process.exit(1);
}

console.log("PASS: Dark mode lock and cyber cockpit 3D globe verified");
