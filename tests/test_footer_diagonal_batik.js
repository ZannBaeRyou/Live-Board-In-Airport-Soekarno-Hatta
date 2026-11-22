// tests/test_footer_diagonal_batik.js
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');
const pages = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html', 'airlines.html'].map(file => ({
    name: file,
    content: fs.readFileSync(path.join(__dirname, '..', file), 'utf-8')
}));

console.log('--- RUNNING FOOTER DIAGONAL BATIK WATERMARK TESTS ---');

// 1. Verify CSS rules in style.css
if (!css.includes('.footer-batik-watermark')) {
    console.error('FAIL: style.css must define .footer-batik-watermark');
    process.exit(1);
}
if (!css.includes('.batik-corner-tl') || !css.includes('.batik-corner-br')) {
    console.error('FAIL: style.css must define .batik-corner-tl and .batik-corner-br');
    process.exit(1);
}
if (!css.includes('grayscale(100%)')) {
    console.error('FAIL: style.css must define grayscale(100%) for Option B Silver Monokrom');
    process.exit(1);
}
if (!css.includes('pointer-events: none')) {
    console.error('FAIL: .footer-batik-watermark must have pointer-events: none');
    process.exit(1);
}

// 2. Verify all 5 HTML pages have both diagonal watermarks inside .footer-card
pages.forEach(page => {
    if (!page.content.includes('footer-batik-watermark batik-corner-tl') ||
        !page.content.includes('footer-batik-watermark batik-corner-br')) {
        console.error(`FAIL: ${page.name} must include both .batik-corner-tl and .batik-corner-br inside .footer-card`);
        process.exit(1);
    }
});

console.log('PASS: Footer card diagonal silver batik watermarks verified across all pages and CSS');
