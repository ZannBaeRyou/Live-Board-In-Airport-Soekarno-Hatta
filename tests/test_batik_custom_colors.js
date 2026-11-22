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

// 4. Verify weather-batik-watermark has unique sunset coral/rose filter
if (!css.includes('.weather-batik-watermark') || !css.includes('hue-rotate(135deg)')) {
    console.error('FAIL: style.css must define unique color filter for .weather-batik-watermark');
    process.exit(1);
}

console.log('PASS: Custom batik color themes verified for Airport Hero (Green), Airlines Banner (Green), and Weather Card (Sunset Coral)');
