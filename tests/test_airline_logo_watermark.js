const fs = require('fs');
const path = require('path');
const assert = require('assert');

const mainJsPath = path.join(__dirname, '../assets/js/main.js');
const mainJs = fs.readFileSync(mainJsPath, 'utf8');

console.log('--- RUNNING AIRLINE LOGO WATERMARK TESTS ---');

// 1. Verify AIRLINE_DATABASE definition
const dbMatch = mainJs.match(/const AIRLINE_DATABASE\s*=\s*(\[[\s\S]*?\]\s*;)/);
assert(dbMatch, 'AIRLINE_DATABASE must be defined in assets/js/main.js');

// Parse database array safely
const airlines = eval(dbMatch[1].replace(/;$/, ''));
assert.strictEqual(airlines.length, 21, 'AIRLINE_DATABASE must contain exactly 21 airlines');

// 2. Verify each airline has a valid 128px CloudFront logo URL
airlines.forEach(airline => {
    assert(airline.logo, `Airline ${airline.code} (${airline.name}) must have a logo property`);
    assert(typeof airline.logo === 'string' && airline.logo.length > 0, `Logo for ${airline.code} must be a non-empty string`);
    assert(airline.logo.startsWith('https://images.kiwi.com/airlines/128/'), `Logo for ${airline.code} must use 128px CDN: ${airline.logo}`);
    assert(airline.logo.endsWith('.png'), `Logo for ${airline.code} must be a .png file: ${airline.logo}`);
});

console.log('PASS: AIRLINE_DATABASE verified with 21 valid airline logo URLs');

// 3. Verify card rendering in initAirlinesDirectory includes watermark & safe layout
assert(mainJs.includes('airline-card-logo-watermark'), 'renderCards must include airline-card-logo-watermark class');
assert(mainJs.includes('onerror="this.parentElement.style.display=\'none\'"'), 'Watermark must include error fallback handler');
assert(mainJs.includes('airline-card-body-content'), 'Card body content must be wrapped in airline-card-body-content container');

// 4. Verify style.css contains CSS rules for watermark & hover transitions
const cssPath = path.join(__dirname, '../assets/css/style.css');
const css = fs.readFileSync(cssPath, 'utf8');

assert(css.includes('.airline-card-logo-watermark'), 'style.css must define .airline-card-logo-watermark');
assert(css.includes('.airline-card-bento:hover .airline-card-logo-watermark'), 'style.css must define hover transition for watermark');
assert(css.includes('opacity: 0.5'), 'Watermark hover opacity must be set to 0.50');
assert(css.includes('pointer-events: none;'), 'Watermark must specify pointer-events: none');
assert(css.includes('.airline-card-body-content'), 'style.css must define .airline-card-body-content with z-index');

console.log('PASS: All airline card watermark DOM and CSS styling requirements verified');

