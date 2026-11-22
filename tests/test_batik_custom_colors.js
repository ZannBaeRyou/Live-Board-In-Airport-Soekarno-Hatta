// tests/test_batik_custom_colors.js
const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
const airlinesHtml = fs.readFileSync(path.join(__dirname, '..', 'airlines.html'), 'utf-8');
const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'style.css'), 'utf-8');

// 1. Verify weather card has batik watermark
if (!indexHtml.includes('class="weather-batik-watermark"') && !indexHtml.includes("class='weather-batik-watermark'")) {
    console.error('FAIL: index.html must contain .weather-batik-watermark inside bento-weather-card');
    process.exit(1);
}

// 2. Verify hero-batik-watermark has green filter
if (!css.includes('.hero-batik-watermark') || !css.includes('hue-rotate(285deg)')) {
    console.error('FAIL: style.css must define green hue-rotate filter for .hero-batik-watermark');
    process.exit(1);
}

// 3. Verify banner-batik-watermark (airlines) has green filter
if (!css.includes('.banner-batik-watermark') || !css.includes('hue-rotate(285deg)')) {
    console.error('FAIL: style.css must define green hue-rotate filter for .banner-batik-watermark');
    process.exit(1);
}

// 4. Verify weather-batik-watermark has blue filter
if (!css.includes('.weather-batik-watermark') || !css.includes('hue-rotate(0deg)')) {
    console.error('FAIL: style.css must define blue color filter for .weather-batik-watermark');
    process.exit(1);
}

// 5. Verify weather-batik-watermark has hover transition animation
if (!css.includes('#bento-weather-card:hover .weather-batik-watermark') && !css.includes('.bento-weather:hover .weather-batik-watermark')) {
    console.error('FAIL: style.css must define hover state for weather-batik-watermark');
    process.exit(1);
}

// 6. Verify weather typography uses vibrant blue theme
if (!css.includes('#bento-weather-card #bento-temp') || !css.includes('#0284c7')) {
    console.error('FAIL: style.css must define #0284c7 blue text for #bento-temp');
    process.exit(1);
}

// 7. Verify T1 terminal-card-batik-watermark has sunset coral/crimson red filter
if (!css.includes('.terminal-card-batik-watermark.batik-t1') || !css.includes('hue-rotate(135deg)')) {
    console.error('FAIL: style.css must define red hue-rotate(135deg) filter for .terminal-card-batik-watermark.batik-t1');
    process.exit(1);
}

console.log('PASS: Custom batik color themes verified for Airport Hero (Green), Airlines Banner (Green), Weather Card (Sky Blue), and Terminal 1 (Crimson Red)');
