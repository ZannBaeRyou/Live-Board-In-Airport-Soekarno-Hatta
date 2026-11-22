// tests/test_terminal_search_sync.js
const fs = require('fs');

const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');
const t1 = fs.readFileSync('terminal1.html', 'utf-8');
const t2 = fs.readFileSync('terminal2.html', 'utf-8');
const t3 = fs.readFileSync('terminal3.html', 'utf-8');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');

// 1. Check quick search normalizes number || flight_no
if (!mainJs.includes("f.number") || !mainJs.includes("f.flight_no")) {
    console.error("FAIL: initQuickSearch must handle both f.number and f.flight_no");
    process.exit(1);
}

// 2. Check allFlights in quick search attaches explicit terminal property
if (!mainJs.includes("terminal: '1'") && !mainJs.includes("terminal: f.terminal || '1'")) {
    console.error("FAIL: initQuickSearch must explicitly assign terminal property for T1/T2/T3 flights");
    process.exit(1);
}

// 3. Check initFIDSBoard supports ?search= and ?airline= query param
if (!mainJs.includes("urlParams.get('search')") && !mainJs.includes("urlParams.get('airline')")) {
    console.error("FAIL: initFIDSBoard must support ?search= or ?airline= deep link query params");
    process.exit(1);
}

// 4. Check terminal pages have interactive filterByAirline quick pills
if (!t1.includes("filterByAirline") || !t2.includes("filterByAirline") || !t3.includes("filterByAirline")) {
    console.error("FAIL: terminal pages must include filterByAirline quick filter pills");
    process.exit(1);
}

// 5. Check style.css has airline-filter-pill styling
if (!css.includes(".airline-filter-pill")) {
    console.error("FAIL: style.css must include .airline-filter-pill styles");
    process.exit(1);
}

console.log("PASS: Quick search data sync and terminal quick-filters verified");
