// tests/test_e2e_verification.js
const fs = require('fs');
const path = require('path');

const i18nPath = path.join(__dirname, '..', 'assets', 'js', 'i18n.js');
const i18nContent = fs.readFileSync(i18nPath, 'utf-8');

const files = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html', 'airlines.html'];
let missing = 0;

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.matchAll(/data-i18n="([^"]+)"/g);
  for (const match of matches) {
    const key = match[1];
    if (!i18nContent.includes(`${key}:`)) {
      console.error(`FAIL: Missing i18n key "${key}" in ${file}`);
      missing++;
    }
  }
}

if (missing > 0) {
  process.exit(1);
}
console.log('PASS: All data-i18n keys are translated');
