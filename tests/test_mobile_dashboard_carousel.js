const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Cek adanya container terminal carousel di index.html
if (!html.includes('terminal-carousel-mobile')) {
    console.error('FAIL: index.html is missing terminal-carousel-mobile container');
    process.exit(1);
}

// 2. Cek deskripsi panjang terminal disembunyikan di mobile
if (!html.includes('data-i18n="term1_desc"') || !html.includes('d-none d-md-block')) {
    console.error('FAIL: Terminal description in index.html is not hidden on mobile with d-none d-md-block');
    process.exit(1);
}

// 3. Cek CSS scroll snap rules
if (!css.includes('.terminal-carousel-mobile') || !css.includes('scroll-snap-type')) {
    console.error('FAIL: style.css is missing .terminal-carousel-mobile with scroll-snap-type');
    process.exit(1);
}

// 4. Cek thumbnail foto di mobile disusutkan
if (!css.includes('@media (max-width: 767.98px)') || !css.includes('.terminal-card-photo')) {
    console.error('FAIL: Missing compact terminal-card-photo height in mobile media query');
    process.exit(1);
}

console.log('PASS: Mobile dashboard carousel and compact layout verified');
