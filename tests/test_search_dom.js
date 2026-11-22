const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf-8');
const js = fs.readFileSync('assets/js/main.js', 'utf-8');

if (!html.includes('id="quick-search-input"')) {
  console.error('FAIL: Missing quick-search-input in index.html');
  process.exit(1);
}
if (!js.includes('initQuickSearch')) {
  console.error('FAIL: Missing initQuickSearch in main.js');
  process.exit(1);
}
console.log('PASS: Quick search integration verified');
