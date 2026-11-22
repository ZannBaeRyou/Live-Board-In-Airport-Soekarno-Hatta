// tests/test_terminal_card_batik.js
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const cssPath = path.join(__dirname, '..', 'assets', 'css', 'style.css');
const html = fs.readFileSync(htmlPath, 'utf-8');
const css = fs.readFileSync(cssPath, 'utf-8');

// 1. Check HTML contains terminal card batik watermarks with proper classes
if (!html.includes('terminal-card-batik-watermark batik-t1')) {
    console.error('FAIL: index.html must contain .terminal-card-batik-watermark.batik-t1 in T1 card');
    process.exit(1);
}

if (!html.includes('terminal-card-batik-watermark batik-t2')) {
    console.error('FAIL: index.html must contain .terminal-card-batik-watermark.batik-t2 in T2 card');
    process.exit(1);
}

if (!html.includes('terminal-card-batik-watermark batik-t3')) {
    console.error('FAIL: index.html must contain .terminal-card-batik-watermark.batik-t3 in T3 card');
    process.exit(1);
}

// 2. Check CSS contains .terminal-card-batik-watermark with transition and opacity 0
if (!css.includes('.terminal-card-batik-watermark') || !css.includes('opacity: 0;') || !css.includes('transition: opacity')) {
    console.error('FAIL: style.css must define .terminal-card-batik-watermark with initial opacity 0 and smooth transition');
    process.exit(1);
}

// 3. Check CSS hover state
if (!css.includes('.bento-terminal-card:hover .terminal-card-batik-watermark')) {
    console.error('FAIL: style.css must define .bento-terminal-card:hover .terminal-card-batik-watermark hover state');
    process.exit(1);
}

// 4. Check color theming with hue-rotate for T1, T2, T3
if (!css.includes('.terminal-card-batik-watermark.batik-t1') || !css.includes('.terminal-card-batik-watermark.batik-t2') || !css.includes('.terminal-card-batik-watermark.batik-t3')) {
    console.error('FAIL: style.css must define terminal-specific batik color rules');
    process.exit(1);
}

if (!css.includes('batikCloudDrift')) {
    console.error('FAIL: style.css must define @keyframes batikCloudDrift animation');
    process.exit(1);
}

console.log('PASS: Terminal cards batik hover animation and color theming verified');
