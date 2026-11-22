// tests/test_full_i18n_coverage.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING FULL I18N ENGLISH TRANSLATION COVERAGE TESTS ---');

// 1. Load i18n.js dictionary
const i18nContent = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'i18n.js'), 'utf-8');

// Extract I18N_DICT
const dictMatch = i18nContent.match(/const I18N_DICT = ({[\s\S]*?\n};)/);
assert(dictMatch, 'I18N_DICT must be defined in i18n.js');

// Parse dictionaries using Function sandbox
const parseDict = new Function(`${dictMatch[0]}; return I18N_DICT;`);
const dict = parseDict();

assert(dict.id, 'I18N_DICT.id must exist');
assert(dict.en, 'I18N_DICT.en must exist');

const idKeys = Object.keys(dict.id);
const enKeys = Object.keys(dict.en);

// Verify dictionary symmetry & no empty translations
idKeys.forEach(key => {
    assert(dict.en[key] !== undefined, `Missing English translation for key: "${key}"`);
    assert(typeof dict.en[key] === 'string' && dict.en[key].trim().length > 0, `English translation for "${key}" cannot be empty`);
});

enKeys.forEach(key => {
    assert(dict.id[key] !== undefined, `Missing Indonesian translation for key: "${key}"`);
    assert(typeof dict.id[key] === 'string' && dict.id[key].trim().length > 0, `Indonesian translation for "${key}" cannot be empty`);
});

console.log(`PASS: Dictionary verified with ${idKeys.length} symmetrical keys in both ID and EN`);

// 2. Verify all data-i18n attributes across all HTML pages
const htmlFiles = ['index.html', 'terminal1.html', 'terminal2.html', 'terminal3.html', 'airlines.html'];
let totalCheckedTags = 0;

htmlFiles.forEach(file => {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf-8');
    const matches = [...html.matchAll(/data-i18n="([^"]+)"/g)];
    assert(matches.length > 0, `File ${file} should contain data-i18n elements`);
    
    matches.forEach(m => {
        const key = m[1];
        assert(dict.id[key] !== undefined, `File ${file} uses unknown data-i18n key: "${key}"`);
        assert(dict.en[key] !== undefined, `File ${file} missing EN translation for: "${key}"`);
        totalCheckedTags++;
    });
});

console.log(`PASS: Verified ${totalCheckedTags} data-i18n tags across all 5 HTML pages`);

// 3. Verify main.js dynamic i18n integration
const mainContent = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'main.js'), 'utf-8');

assert(mainContent.includes('formatEstimatedTime'), 'main.js must define formatEstimatedTime() helper');
assert(mainContent.includes("hdr_dest_dep"), 'main.js switchTab must use hdr_dest_dep key');
assert(mainContent.includes("hdr_dest_arr"), 'main.js switchTab must use hdr_dest_arr key');
assert(mainContent.includes("hdr_gate_dep"), 'main.js switchTab must use hdr_gate_dep key');
assert(mainContent.includes("hdr_gate_arr"), 'main.js switchTab must use hdr_gate_arr key');
assert(mainContent.includes("lbl_dest"), 'main.js renderFIDS must use lbl_dest key');
assert(mainContent.includes("lbl_origin"), 'main.js renderFIDS must use lbl_origin key');
assert(mainContent.includes("filter_all"), 'main.js populateStatusFilterOptions must use filter_all key');
assert(mainContent.includes("no_flights_match"), 'main.js initQuickSearch must use no_flights_match key');
assert(mainContent.includes("airlines_term_zone_checkin"), 'main.js initAirlinesDirectory must use airlines_term_zone_checkin key');
assert(mainContent.includes("window.__refreshAirlinesDirectory"), 'main.js must expose window.__refreshAirlinesDirectory');
assert(mainContent.includes("window.addEventListener('languageChanged'"), 'main.js must listen to languageChanged event');

console.log('PASS: main.js dynamic translation hooks and listeners verified');

// 4. Test formatEstimatedTime logic
const formatEstimatedTimeFn = new Function('currentLang', '__t', `
    ${mainContent.match(/function formatEstimatedTime[\s\S]*?\n}/)[0]}
    return formatEstimatedTime;
`);

const testTranslate = (key) => dict.en[key] || key;
const formatEn = formatEstimatedTimeFn('en', testTranslate);
const formatId = formatEstimatedTimeFn('id', (key) => dict.id[key] || key);

assert.strictEqual(formatEn('09:45 (Estimasi)'), '09:45 (Estimated)', 'Estimasi should be converted to Estimated in EN');
assert.strictEqual(formatEn('07:25 (Aktual)'), '07:25 (Actual)', 'Aktual should be converted to Actual in EN');
assert.strictEqual(formatId('09:45 (Estimated)'), '09:45 (Estimasi)', 'Estimated should be converted to Estimasi in ID');

console.log('PASS: formatEstimatedTime functional unit tests passed');

console.log('ALL FULL I18N ENGLISH COVERAGE TESTS PASSED SUCCESSFULLY!');
