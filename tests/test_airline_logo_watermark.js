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
