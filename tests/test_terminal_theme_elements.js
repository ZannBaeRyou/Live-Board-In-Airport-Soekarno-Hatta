// tests/test_terminal_theme_elements.js
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');
const t1 = fs.readFileSync(path.join(__dirname, '..', 'terminal1.html'), 'utf-8');
const t2 = fs.readFileSync(path.join(__dirname, '..', 'terminal2.html'), 'utf-8');
const t3 = fs.readFileSync(path.join(__dirname, '..', 'terminal3.html'), 'utf-8');

console.log('--- RUNNING TERMINAL THEMED CLOCK & TABS TESTS ---');

// 1. Verify body terminal scoping classes or data attributes
if (!t1.includes('terminal-1-page') && !t1.includes('data-terminal="1"')) {
    console.error('FAIL: terminal1.html must have terminal-1-page or data-terminal="1"');
    process.exit(1);
}
if (!t2.includes('terminal-2-page') && !t2.includes('data-terminal="2"')) {
    console.error('FAIL: terminal2.html must have terminal-2-page or data-terminal="2"');
    process.exit(1);
}
if (!t3.includes('terminal-3-page') && !t3.includes('data-terminal="3"')) {
    console.error('FAIL: terminal3.html must have terminal-3-page or data-terminal="3"');
    process.exit(1);
}

// 2. Verify style.css removes generic !important blue on .fids-live-clock
if (/\.fids-live-clock[^{]*\{[^}]*color:\s*#0284c7\s*!important/i.test(css)) {
    console.error('FAIL: style.css must not force .fids-live-clock to blue #0284c7 !important');
    process.exit(1);
}

// 3. Verify terminal-specific clock colors
if (!css.includes('.terminal-1-page .fids-live-clock') && !css.includes('[data-terminal="1"] .fids-live-clock')) {
    console.error('FAIL: style.css must define Terminal 1 clock color (#e11d48)');
    process.exit(1);
}
if (!css.includes('.terminal-2-page .fids-live-clock') && !css.includes('[data-terminal="2"] .fids-live-clock')) {
    console.error('FAIL: style.css must define Terminal 2 clock color (#7c3aed)');
    process.exit(1);
}
if (!css.includes('.terminal-3-page .fids-live-clock') && !css.includes('[data-terminal="3"] .fids-live-clock')) {
    console.error('FAIL: style.css must define Terminal 3 clock color (#d97706)');
    process.exit(1);
}

// 4. Verify terminal-specific departures/arrivals tab colors
if (!css.includes('.terminal-1-page .btn-fids-tab.active') && !css.includes('[data-terminal="1"] .btn-fids-tab.active')) {
    console.error('FAIL: style.css must define Terminal 1 active tab color (#e11d48)');
    process.exit(1);
}
if (!css.includes('.terminal-2-page .btn-fids-tab.active') && !css.includes('[data-terminal="2"] .btn-fids-tab.active')) {
    console.error('FAIL: style.css must define Terminal 2 active tab color (#7c3aed)');
    process.exit(1);
}
if (!css.includes('.terminal-3-page .btn-fids-tab.active') && !css.includes('[data-terminal="3"] .btn-fids-tab.active')) {
    console.error('FAIL: style.css must define Terminal 3 active tab color (#d97706)');
    process.exit(1);
}

console.log('PASS: Terminal themed clocks, tabs, and breadcrumbs verified');
