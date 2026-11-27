const fs = require('fs');
const path = require('path');
const assert = require('assert');

const css = fs.readFileSync(path.join(__dirname, '../assets/css/style.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// Check CSS rules for hardware acceleration, clipping, and accessibility
assert(css.includes('.hero-batik-clip'), 'style.css must define .hero-batik-clip container');
assert(css.includes('will-change: transform') || css.includes('will-change: opacity, transform'), 'style.css must specify will-change for watermark elements');
assert(css.includes('prefers-reduced-motion: reduce'), 'style.css must support prefers-reduced-motion: reduce');
assert(indexHtml.includes('hero-batik-clip'), 'index.html must wrap hero-batik-watermark inside hero-batik-clip');

console.log('PASS: Task 1 CSS & clipping rules verified');
