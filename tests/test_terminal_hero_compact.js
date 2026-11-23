const fs = require('fs');
const t1 = fs.readFileSync('terminal1.html', 'utf-8');
const t2 = fs.readFileSync('terminal2.html', 'utf-8');
const t3 = fs.readFileSync('terminal3.html', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

[t1, t2, t3].forEach((page, idx) => {
    const termNum = idx + 1;
    // Cek deskripsi panjang secara spesifik pada elemen <p> memiliki class d-none d-md-block
    const descRegex = new RegExp(`<p[^>]*data-i18n="term${termNum}_desc"[^>]*>`);
    const match = page.match(descRegex);
    if (!match || !match[0].includes('d-none d-md-block')) {
        console.error(`FAIL: Terminal ${termNum} hero description paragraph does not contain d-none d-md-block`);
        process.exit(1);
    }
});

// Cek CSS hero section mobile padding reduction (kurangi dari 85px menjadi <= 72px)
const hasCompactHeroPadding = css.includes('padding-top: 70px') || css.includes('padding-top: 68px') || css.includes('padding-top: 65px');
if (!hasCompactHeroPadding) {
    console.error('FAIL: Missing compact terminal-hero-section mobile top padding in style.css');
    process.exit(1);
}

console.log('PASS: Terminal pages hero compact layout verified');
