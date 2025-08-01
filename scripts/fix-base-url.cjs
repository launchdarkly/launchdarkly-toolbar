#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distFile = path.join(__dirname, '..', 'dist', 'js', 'index.js');

if (fs.existsSync(distFile)) {
    console.log('🔧 Fixing base URL issue in dist/js/index.js...');

    let content = fs.readFileSync(distFile, 'utf8');

    // Replace the problematic line with a commented version
    const problematicLine = '__webpack_require__.b = new URL("../", import.meta.url);';
    const fixedLine = '// __webpack_require__.b = new URL("../", import.meta.url);';

    if (content.includes(problematicLine)) {
        content = content.replace(problematicLine, fixedLine);
        fs.writeFileSync(distFile, content, 'utf8');
        console.log('✅ Fixed: Commented out problematic base URL line');
    } else {
        console.log('ℹ️  No problematic line found - build may have been fixed upstream');
    }
} else {
    console.log('❌ dist/js/index.js not found');
    process.exit(1);
}
