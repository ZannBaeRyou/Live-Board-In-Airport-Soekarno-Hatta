// tests/test_modal_i18n.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const i18nContent = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'i18n.js'), 'utf-8');
const dictMatch = i18nContent.match(/const I18N_DICT = ({[\s\S]*?\n};)/);
assert(dictMatch, 'I18N_DICT must be defined');

const dict = new Function(`${dictMatch[0]}; return I18N_DICT;`)();

const requiredKeys = [
    'modal_flight_status', 'modal_gate_departure', 'modal_boarding_time_left',
    'modal_baggage_belt', 'modal_landing_time', 'modal_destination_city',
    'modal_origin_city', 'modal_counter_island', 'modal_exit_gate',
    'modal_aircraft_type', 'modal_wide_body', 'modal_narrow_body'
];

requiredKeys.forEach(k => {
    assert(dict.id[k], `Missing ID translation for ${k}`);
    assert(dict.en[k], `Missing EN translation for ${k}`);
});
console.log('PASS: All modal i18n keys present and symmetrical in ID and EN');
