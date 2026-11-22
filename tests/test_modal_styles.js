// tests/test_modal_styles.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');

assert(css.includes('.fids-modal-executive'), 'style.css must define .fids-modal-executive');
assert(css.includes('.modal-highlight-banner'), 'style.css must define .modal-highlight-banner');
assert(css.includes('.modal-info-grid'), 'style.css must define .modal-info-grid');
assert(css.includes('.modal-theme-t1'), 'style.css must define .modal-theme-t1');
assert(css.includes('.modal-theme-t2'), 'style.css must define .modal-theme-t2');
assert(css.includes('.modal-theme-t3'), 'style.css must define .modal-theme-t3');
console.log('PASS: All executive modal CSS rules and terminal themes verified');
