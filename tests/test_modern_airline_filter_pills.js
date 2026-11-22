// tests/test_modern_airline_filter_pills.js
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');
const t1 = fs.readFileSync(path.join(__dirname, '..', 'terminal1.html'), 'utf-8');
const t2 = fs.readFileSync(path.join(__dirname, '..', 'terminal2.html'), 'utf-8');
const t3 = fs.readFileSync(path.join(__dirname, '..', 'terminal3.html'), 'utf-8');
const mainJs = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'main.js'), 'utf-8');

console.log('--- RUNNING MODERN AIRLINE FILTER PILLS TESTS ---');

// 1. Verify CSS rules for .airline-filter-pill
if (!css.includes('.airline-filter-pill')) {
    console.error('FAIL: style.css must define .airline-filter-pill');
    process.exit(1);
}

if (!css.includes('border-radius: 9999px') && !css.includes('border-radius: 50rem')) {
    console.error('FAIL: .airline-filter-pill must have modern pill rounded geometry (border-radius: 9999px)');
    process.exit(1);
}

// 2. Verify .pill-dot styling
if (!css.includes('.pill-dot')) {
    console.error('FAIL: style.css must define .pill-dot styling');
    process.exit(1);
}

// 3. Verify terminal color theming for pills
const hasT1Red = css.includes('#e11d48');
const hasT2Violet = css.includes('#7c3aed');
const hasT3Amber = css.includes('#d97706');

if (!hasT1Red || !hasT2Violet || !hasT3Amber) {
    console.error('FAIL: style.css must define terminal-specific accent colors for pills (T1: #e11d48, T2: #7c3aed, T3: #d97706)');
    process.exit(1);
}

// 4. Verify HTML files structure
[t1, t2, t3].forEach((pageHtml, idx) => {
    const termNum = idx + 1;
    if (!pageHtml.includes('terminal-airline-pills')) {
        console.error(`FAIL: terminal${termNum}.html must contain .terminal-airline-pills`);
        process.exit(1);
    }
    if (!pageHtml.includes('airline-filter-pill')) {
        console.error(`FAIL: terminal${termNum}.html must contain .airline-filter-pill`);
        process.exit(1);
    }
    if (!pageHtml.includes('pill-dot')) {
        console.error(`FAIL: terminal${termNum}.html must contain .pill-dot inside pills`);
        process.exit(1);
    }
});

// 5. Verify active pill synchronization in main.js
if (!mainJs.includes('airline-filter-pill') || !mainJs.includes('active')) {
    console.error('FAIL: main.js must synchronize .active class on .airline-filter-pill');
    process.exit(1);
}

console.log('PASS: Modern airline filter pills styling and reactive behavior verified');
