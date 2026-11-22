// tests/test_airlines_page.js
const fs = require('fs');

const airlinesHtml = fs.readFileSync('airlines.html', 'utf-8');
const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Check airlines.html contains bento container and search controls
if (!airlinesHtml.includes('id="airline-bento-grid"') && !airlinesHtml.includes("id='airline-bento-grid'")) {
    console.error("FAIL: airlines.html must contain #airline-bento-grid container");
    process.exit(1);
}

if (!airlinesHtml.includes('id="airline-search-input"') && !airlinesHtml.includes("id='airline-search-input'")) {
    console.error("FAIL: airlines.html must contain #airline-search-input for live searching");
    process.exit(1);
}

// 2. Check main.js defines AIRLINE_DATABASE with active carriers
if (!mainJs.includes('AIRLINE_DATABASE') || !mainJs.includes('Garuda Indonesia') || !mainJs.includes('Lion Air')) {
    console.error("FAIL: main.js must define comprehensive AIRLINE_DATABASE");
    process.exit(1);
}

// 3. Check main.js defines initAirlinesDirectory
if (!mainJs.includes('initAirlinesDirectory')) {
    console.error("FAIL: main.js must define and invoke initAirlinesDirectory()");
    process.exit(1);
}

// 4. Check style.css has airline-card-bento styling
if (!css.includes('.airline-card-bento')) {
    console.error("FAIL: style.css must contain .airline-card-bento styling");
    process.exit(1);
}

// 5. Check Batik Mega Mendung watermark banner presence and styling
if (!airlinesHtml.includes('class="banner-batik-watermark"') && !airlinesHtml.includes("class='banner-batik-watermark'")) {
    console.error("FAIL: airlines.html must contain .banner-batik-watermark in header");
    process.exit(1);
}

if (!css.includes('.banner-batik-watermark') || !css.includes('batik-megamendung-clean.jpg')) {
    console.error("FAIL: style.css must define .banner-batik-watermark referencing batik-megamendung-clean.jpg");
    process.exit(1);
}

// 6. Check Segmented Control Dock for terminal filtering
if (!airlinesHtml.includes('segmented-terminal-dock') || !airlinesHtml.includes('term-dot dot-all')) {
    console.error("FAIL: airlines.html must contain .segmented-terminal-dock with .term-dot indicators");
    process.exit(1);
}

if (!css.includes('.segmented-terminal-dock') || !css.includes('.term-dot')) {
    console.error("FAIL: style.css must define .segmented-terminal-dock and .term-dot styling");
    process.exit(1);
}

console.log("PASS: Airlines directory bento grid architecture, Batik watermark banner, and Segmented Dock verified");
