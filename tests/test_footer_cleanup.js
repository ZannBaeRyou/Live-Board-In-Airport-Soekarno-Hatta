const assert = require('assert');
const fs = require('fs');
const path = require('path');

const files = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html', 'airlines.html'];

files.forEach(file => {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf-8');
    assert(!html.includes('data-i18n="footer_policy"'), `File ${file} still contains footer_policy`);
    assert(!html.includes('data-i18n="footer_map"'), `File ${file} still contains footer_map`);
});

console.log('PASS: Footer placeholder links successfully cleaned up across all pages');
