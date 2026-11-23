const fs = require('fs');
const css = fs.readFileSync('assets/css/style.css', 'utf-8');
const mainJs = fs.readFileSync('assets/js/main.js', 'utf-8');

// 1. Cek bahwa di mobile style.css tidak lagi memaksakan grid-template-columns: 1fr untuk modal-info-grid
if (css.includes('@media (max-width: 576px) {\n    .modal-info-grid {\n        grid-template-columns: 1fr;') ||
    css.includes('@media (max-width: 576px) {\r\n    .modal-info-grid {\r\n        grid-template-columns: 1fr;')) {
    console.error('FAIL: Legacy @media (max-width: 576px) still forces single-column 1fr stack for modal-info-grid');
    process.exit(1);
}

// 2. Cek adanya aturan compact modal highlight banner di mobile
if (!css.includes('.modal-highlight-banner') || !css.includes('.modal-compact-highlight')) {
    console.error('FAIL: Missing compact modal highlight banner rules in style.css');
    process.exit(1);
}

// 3. Cek modal info grid compact di mobile
if (!css.includes('.modal-info-grid') || !css.includes('modal-info-card-compact')) {
    console.error('FAIL: Missing compact modal info card styling in style.css');
    process.exit(1);
}

console.log('PASS: Modal compact mobile styling verified');
