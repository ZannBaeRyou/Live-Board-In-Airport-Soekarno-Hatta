// tests/test_terminal_hero_cards.js
const fs = require('fs');
const path = require('path');

const t1 = fs.readFileSync(path.join(__dirname, '..', 'terminal1.html'), 'utf-8');
const t2 = fs.readFileSync(path.join(__dirname, '..', 'terminal2.html'), 'utf-8');
const t3 = fs.readFileSync(path.join(__dirname, '..', 'terminal3.html'), 'utf-8');
const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');

// 1. Verify terminal hero cards and batik watermarks
if (!t1.includes('terminal-hero-card') || !t1.includes('terminal-hero-batik-watermark batik-t1')) {
    console.error('FAIL: terminal1.html must contain .terminal-hero-card with .batik-t1');
    process.exit(1);
}

if (!t2.includes('terminal-hero-card') || !t2.includes('terminal-hero-batik-watermark batik-t2')) {
    console.error('FAIL: terminal2.html must contain .terminal-hero-card with .batik-t2');
    process.exit(1);
}

if (!t3.includes('terminal-hero-card') || !t3.includes('terminal-hero-batik-watermark batik-t3')) {
    console.error('FAIL: terminal3.html must contain .terminal-hero-card with .batik-t3');
    process.exit(1);
}

// 2. Verify CSS styles for terminal hero cards and batik watermarks
if (!css.includes('.terminal-hero-card') || !css.includes('.terminal-hero-batik-watermark')) {
    console.error('FAIL: style.css must define .terminal-hero-card and .terminal-hero-batik-watermark');
    process.exit(1);
}

// 3. Verify color-matched filters
if (!css.includes('.terminal-hero-batik-watermark.batik-t1') ||
    !css.includes('.terminal-hero-batik-watermark.batik-t2') ||
    !css.includes('.terminal-hero-batik-watermark.batik-t3')) {
    console.error('FAIL: style.css must define color filters for .terminal-hero-batik-watermark batik-t1, t2, t3');
    process.exit(1);
}

console.log('PASS: Terminal Bento hero cards and color-matched batik watermarks verified');
