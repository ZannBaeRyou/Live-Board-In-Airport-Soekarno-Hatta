const fs = require('fs');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// Verifikasi bahwa @media (max-width: 991px) tidak lagi memaksakan span 12 secara membabi buta tanpa pemisahan tablet
if (css.includes('@media (max-width: 991px) {\n    .bento-hero, .bento-weather, .bento-terminal-card {\n        grid-column: span 12;') ||
    css.includes('@media (max-width: 991px) {\r\n    .bento-hero, .bento-weather, .bento-terminal-card {\r\n        grid-column: span 12;')) {
    console.error('FAIL: Legacy @media (max-width: 991px) still forces span 12 on all bento elements including tablets');
    process.exit(1);
}

// Verifikasi aturan tablet 768px - 991px
const hasTabletRule = css.includes('@media (min-width: 768px) and (max-width: 991') || 
                      css.includes('@media (min-width: 768px) and (max-width: 991.98px)');

if (!hasTabletRule) {
    console.error('FAIL: Missing specific tablet responsive media query (768px to 991px)');
    process.exit(1);
}

// Verifikasi bahwa hero span 8, weather span 4, dan terminal card span 4 pada tablet
if (!css.includes('.bento-terminal-card') || !css.includes('grid-column: span 4')) {
    console.error('FAIL: Tablet grid does not define span 4 for terminal cards');
    process.exit(1);
}

console.log('PASS: Tablet responsive grid rules verified');
