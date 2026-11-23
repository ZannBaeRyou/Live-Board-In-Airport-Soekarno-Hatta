const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testDir = __dirname;
const files = fs.readdirSync(testDir).filter(f => f.startsWith('test_') && f.endsWith('.js') && f !== 'test_full_suite.js');

console.log(`Running ${files.length} test suites...`);
let passed = 0;

for (const file of files) {
    try {
        execSync(`node "${path.join(testDir, file)}"`, { stdio: 'pipe' });
        console.log(`  ✓ ${file}`);
        passed++;
    } catch (err) {
        console.error(`  ✗ ${file} FAILED:\n${err.stdout ? err.stdout.toString() : err.message}`);
        process.exit(1);
    }
}

console.log(`\nALL ${passed} TEST SUITES PASSED! Zero regressions.`);
