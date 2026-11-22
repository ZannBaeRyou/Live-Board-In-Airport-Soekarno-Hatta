// tests/test_styles.js
const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
const css = fs.readFileSync(cssPath, 'utf-8');

const requiredTokens = [
  '--bg-canvas',
  '--surface-card',
  '--border-subtle',
  '--text-primary',
  '--text-secondary',
  '--accent-t1',
  '--accent-t2',
  '--accent-t3',
  'pulse-ring',
  'overflow-visible',
  'z-index: 100'
];

let failed = false;
for (const token of requiredTokens) {
  if (!css.includes(token)) {
    console.error(`FAIL: Missing token ${token}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('PASS: All modern design tokens present');
