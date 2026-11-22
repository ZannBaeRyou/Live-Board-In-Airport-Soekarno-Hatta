const assert = require('assert');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');

// 1. Verify card hover styling
assert(css.includes('#bento-airport-hero:hover'), 'style.css must define #bento-airport-hero:hover');
assert(css.includes('#6ee7b7') && css.includes('rgba(5, 150, 105'), 'Card hover must use emerald border #6ee7b7 and emerald box-shadow');

// 2. Verify title hover glow styling
assert(css.includes('#bento-airport-hero:hover h1') || css.includes('#bento-airport-hero:hover [data-i18n="hero_title"]'), 'style.css must define title hover glow on hero card hover');
assert(css.includes('#059669') && css.includes('rgba(16, 185, 129'), 'Title hover glow must use emerald color #059669 and text-shadow');

console.log('PASS: Hero card and title emerald glow styles verified');
