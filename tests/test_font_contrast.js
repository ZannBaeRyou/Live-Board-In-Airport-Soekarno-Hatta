const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- RUNNING FONT CONTRAST & ACCESSIBILITY TESTS ---');

const cssPath = path.join(__dirname, '../assets/css/style.css');
const css = fs.readFileSync(cssPath, 'utf8');

// 1. Verify global CSS overrides for text helper classes
assert.ok(
    /(^|[\n\}])\s*\.text-white\s*\{[^}]*color:\s*(#0f172a|var\(--text-primary\))[^}]*!important/i.test(css),
    'FAIL: Standalone .text-white must be overridden to #0f172a or var(--text-primary) with !important in style.css'
);
console.log('PASS: .text-white standalone overridden to high-contrast Deep Slate');

assert.ok(
    /(^|[\n\}])\s*\.text-white-50\s*\{[^}]*color:\s*(#475569|#334155|var\(--text-secondary\))[^}]*!important/i.test(css),
    'FAIL: Standalone .text-white-50 must be overridden to Slate 600 (#475569) with !important in style.css'
);
console.log('PASS: .text-white-50 standalone overridden to high-contrast Slate 600');

assert.ok(
    /(^|[\n\}])\s*\.text-secondary\s*\{[^}]*color:\s*(#475569|#334155|var\(--text-secondary\))[^}]*!important/i.test(css),
    'FAIL: Standalone .text-secondary must be overridden to high-contrast Slate in style.css'
);
console.log('PASS: .text-secondary standalone overridden to high-contrast Slate');

assert.ok(
    /(^|[\n\}])\s*\.text-muted\s*\{[^}]*color:\s*(#475569|#334155)[^}]*!important/i.test(css),
    'FAIL: Standalone .text-muted must be high-contrast Slate (#475569) in style.css'
);
console.log('PASS: .text-muted standalone overridden to high-contrast Slate');

assert.ok(
    /(^|[\n\}])\s*\.text-cyan\s*\{[^}]*color:\s*(#0284c7|#0369a1|var\(--accent-sky\))[^}]*!important/i.test(css),
    'FAIL: Standalone .text-cyan must be defined and set to high-contrast Sky Blue (#0284c7) in style.css'
);
console.log('PASS: .text-cyan standalone defined with high-contrast Sky Blue');

// 2. Verify all HTML files have data-theme="light" on <html>
const htmlFiles = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html', 'airlines.html'];
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(
        /<html[^>]*data-theme="light"[^>]*>/i.test(content),
        `FAIL: ${file} must have data-theme="light" attribute on <html> tag`
    );
});
console.log('PASS: All HTML files explicitly set data-theme="light"');

// 3. Verify no lingering dark inline styles on inputs or modal map wrappers
const airlinesHtml = fs.readFileSync(path.join(__dirname, '../airlines.html'), 'utf8');
assert.ok(
    !airlinesHtml.includes('background: rgba(18, 22, 34'),
    'FAIL: airlines.html has lingering dark inline background on search input'
);
console.log('PASS: airlines.html free of dark inline styles on search input');

const t1Html = fs.readFileSync(path.join(__dirname, '../terminal1.html'), 'utf8');
assert.ok(
    !t1Html.includes('background: #0d172e;'),
    'FAIL: terminal1.html has lingering dark inline background on modal map wrapper'
);
console.log('PASS: terminal1.html modal map wrapper free of dark inline styles');

console.log('ALL FONT CONTRAST TESTS PASSED SUCCESSFULLY!');
