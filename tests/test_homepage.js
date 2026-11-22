// tests/test_homepage.js
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
const html = fs.readFileSync(htmlPath, 'utf-8');
const css = fs.readFileSync(cssPath, 'utf-8');

const checks = [
  { test: !html.includes('id="theme-toggle"'), msg: 'Theme toggle removed' },
  { test: html.includes('id="bento-airport-hero"'), msg: 'Bento hero exists' },
  { test: html.includes('id="live-clock-utc"'), msg: 'UTC clock exists' },
  { test: html.includes('id="stat-otp"'), msg: 'OTP stat container exists' },
  { test: html.includes('id="bento-airport-hero"') &&
          html.indexOf('id="quick-search-input"') > html.indexOf('id="bento-airport-hero"') &&
          html.indexOf('id="quick-search-input"') < html.indexOf('id="bento-weather-card"'),
    msg: 'quick-search-input must be nested inside bento-airport-hero' },
  { test: !html.includes('id="quick-search-section"'), msg: 'quick-search-section wrapper must be removed' },
  { test: html.includes('id="t1-bento-card"'), msg: 'T1 bento card exists' },
  { test: html.includes('id="t2-bento-card"'), msg: 'T2 bento card exists' },
  { test: html.includes('id="t3-bento-card"'), msg: 'T3 bento card exists' },
  { test: html.includes('class="dashboard-batik-sky-backdrop"'), msg: 'index.html must contain .dashboard-batik-sky-backdrop' },
  { test: css.includes('.dashboard-batik-sky-backdrop') && css.includes('linear-gradient(to bottom'), msg: 'style.css must define .dashboard-batik-sky-backdrop with vertical gradient mask' }
];

let failed = false;
for (const c of checks) {
  if (!c.test) {
    console.error(`FAIL: ${c.msg}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log('PASS: Homepage Bento structure verified');
