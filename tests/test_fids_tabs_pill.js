const fs = require('fs');
const path = require('path');
const assert = require('assert');

const cssPath = path.join(__dirname, '../assets/css/style.css');
const css = fs.readFileSync(cssPath, 'utf8');

// 1. Verify .fids-tabs has pill shape and overflow protection
const fidsTabsBlocks = [...css.matchAll(/(?:^|\n)\s*\.fids-tabs\s*\{([^}]+)\}/g)].map(m => m[1]);
assert(fidsTabsBlocks.length > 0, 'CSS must contain .fids-tabs block');
const mainFidsTabBlock = fidsTabsBlocks.find(b => b.includes('border-radius'));
assert(mainFidsTabBlock, 'A .fids-tabs block must define border-radius');
assert(mainFidsTabBlock.includes('border-radius: 9999px') || mainFidsTabBlock.includes('border-radius: 999px') || mainFidsTabBlock.includes('border-radius: 50px'), '.fids-tabs must have rounded pill border-radius (e.g. 9999px)');
assert(mainFidsTabBlock.includes('overflow: hidden'), '.fids-tabs must have overflow: hidden to prevent button spill');
assert(mainFidsTabBlock.includes('display: flex'), '.fids-tabs must be display: flex');

// 2. Verify .btn-fids-tab has pill shape and anti-overflow flex shrinking
const btnTabBlockMatch = css.match(/\.btn-fids-tab\s*\{([^}]+)\}/);
assert(btnTabBlockMatch, 'CSS must contain .btn-fids-tab block');
const btnTabBlock = btnTabBlockMatch[1];
assert(btnTabBlock.includes('border-radius: 9999px') || btnTabBlock.includes('border-radius: 999px') || btnTabBlock.includes('border-radius: 50px'), '.btn-fids-tab must have rounded pill border-radius (e.g. 9999px)');
assert(btnTabBlock.includes('min-width: 0'), '.btn-fids-tab must have min-width: 0 to allow flexbox shrinking on narrow screens');
assert(btnTabBlock.includes('white-space: nowrap'), '.btn-fids-tab must have white-space: nowrap');
assert(btnTabBlock.includes('text-overflow: ellipsis'), '.btn-fids-tab must have text-overflow: ellipsis');

// 3. Verify small screen / mobile adjustments for .btn-fids-tab
const mobileQueryMatch = css.match(/@media\s*\(\s*max-width:\s*400px\s*\)\s*\{([\s\S]*?)(?=@media|\Z)/);
assert(mobileQueryMatch, 'CSS must contain @media (max-width: 400px)');
const mobileQuery = mobileQueryMatch[1];
assert(mobileQuery.includes('.btn-fids-tab'), '@media (max-width: 400px) must adjust .btn-fids-tab');
assert(mobileQuery.includes('border-radius: 9999px') || mobileQuery.includes('border-radius: 999px') || mobileQuery.includes('border-radius: 50px'), '.btn-fids-tab in small phone media query must preserve pill border-radius');

console.log('PASS: test_fids_tabs_pill verified');
