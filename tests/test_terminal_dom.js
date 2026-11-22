const fs = require('fs');

const t1 = fs.readFileSync('terminal1.html', 'utf-8');
const t2 = fs.readFileSync('terminal2.html', 'utf-8');
const t3 = fs.readFileSync('terminal3.html', 'utf-8');
const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

if (t1.includes('id="theme-toggle"') || t2.includes('id="theme-toggle"') || t3.includes('id="theme-toggle"')) {
  console.error('FAIL: theme-toggle still exists in terminal pages');
  process.exit(1);
}

if (css.includes('grid-template-columns: 85px')) {
  console.error('FAIL: fids-row-modern still has squashed 85px grid constraint');
  process.exit(1);
}

if (!css.includes('.fids-row-modern.status-boarding')) {
  console.error('FAIL: Missing .fids-row-modern.status-boarding left accent border');
  process.exit(1);
}

if (!mainJs.includes('fids-row-modern') || !mainJs.includes('getAircraftModel') || !mainJs.includes('status-pill-modern')) {
  console.error('FAIL: Modern FIDS row classes missing in main.js');
  process.exit(1);
}

if (!t1.includes('id="fids-detail-modal"') || !t2.includes('id="fids-detail-modal"') || !t3.includes('id="fids-detail-modal"')) {
  console.error('FAIL: #fids-detail-modal missing in terminal pages');
  process.exit(1);
}

if (t1.includes('id="flight-map-canvas"') || t2.includes('id="flight-map-canvas"') || t3.includes('id="flight-map-canvas"')) {
  console.error('FAIL: Obsolete flight-map-canvas still present in terminal pages');
  process.exit(1);
}

console.log('PASS: Terminal pages and modern FIDS rows verified');
