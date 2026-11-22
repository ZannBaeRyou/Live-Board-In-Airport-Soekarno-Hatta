// tests/test_terminal_hero_descriptions.js
const fs = require('fs');
const path = require('path');

const i18n = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'i18n.js'), 'utf-8');
const t1 = fs.readFileSync(path.join(__dirname, '..', 'terminal1.html'), 'utf-8');
const t2 = fs.readFileSync(path.join(__dirname, '..', 'terminal2.html'), 'utf-8');
const t3 = fs.readFileSync(path.join(__dirname, '..', 'terminal3.html'), 'utf-8');
const index = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');

console.log('--- RUNNING TERMINAL HERO DESCRIPTIONS & CLEAN HERO TESTS ---');

// 1. Verify i18n terminal descriptions explain terminal purpose / function rather than airline names
if (!i18n.includes('Pusat Penerbangan Domestik Nusantara') ||
    !i18n.includes('Pusat Penerbangan Bertarif Rendah (LCC)') ||
    !i18n.includes('Gerbang Internasional Utama & Flagship')) {
    console.error('FAIL: i18n.js must describe terminal roles for Indonesian language');
    process.exit(1);
}

if (!i18n.includes('Archipelago Domestic Flight Hub') ||
    !i18n.includes('Low-Cost Carrier (LCC) & Regional Hub') ||
    !i18n.includes('Main International Gateway & Full-Service Flagship')) {
    console.error('FAIL: i18n.js must describe terminal roles for English language');
    process.exit(1);
}

// 2. Verify instant airline filter pills are removed from terminal hero sections
[t1, t2, t3].forEach((pageHtml, idx) => {
    const termNum = idx + 1;
    if (pageHtml.includes('airline-filter-pill')) {
        console.error(`FAIL: terminal${termNum}.html must not include .airline-filter-pill buttons`);
        process.exit(1);
    }
    if (pageHtml.includes('terminal-airline-pills')) {
        console.error(`FAIL: terminal${termNum}.html must not include .terminal-airline-pills container`);
        process.exit(1);
    }
});

// 3. Verify terminal description keys exist in all pages
if (!t1.includes('data-i18n="term1_desc"') ||
    !t2.includes('data-i18n="term2_desc"') ||
    !t3.includes('data-i18n="term3_desc"') ||
    !index.includes('data-i18n="term1_desc"') ||
    !index.includes('data-i18n="term2_desc"') ||
    !index.includes('data-i18n="term3_desc"')) {
    console.error('FAIL: all pages must reference term1_desc, term2_desc, term3_desc');
    process.exit(1);
}

console.log('PASS: Terminal hero descriptions and clean hero layout verified');
