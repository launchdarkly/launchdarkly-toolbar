#!/usr/bin/env node

/**
 * Post-build script to fix import.meta.url base URL issue in rslib output
 *
 * PROBLEM:
 * rslib/webpack generates this line in the built bundle:
 *   __webpack_require__.b = new URL("../", import.meta.url);
 *
 * This causes module resolution errors in Storybook because webpack tries to
 * statically resolve "../" as a module dependency during build time, not runtime.
 *
 * SOLUTION:
 * Comment out the problematic line since our library:
 * - Uses injectStyles: true (no separate CSS files to load)
 * - Is fully bundled (no code splitting/dynamic chunks)
 * - Doesn't need webpack's automatic base URL detection
 *
 * This script runs automatically after `rslib build` via package.json scripts.
 */

const fs = require('fs');
const path = require('path');

// Support both old structure (root) and new structure (packages/toolbar)
const distFile = process.argv[2] 
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '..', 'dist', 'js', 'index.js');

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
