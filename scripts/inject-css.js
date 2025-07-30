#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSS_FILE_PATH = path.join(__dirname, '../dist/css/index.css');
const CSS_INJECTION_FILE_PATH = path.join(__dirname, '../src/utils/cssInjection.ts');

function injectCSS() {
  try {
    // Read the built CSS file
    const cssContent = fs.readFileSync(CSS_FILE_PATH, 'utf8');
    
    // Read the CSS injection utility file
    const injectionFileContent = fs.readFileSync(CSS_INJECTION_FILE_PATH, 'utf8');
    
    // Escape the CSS content for JavaScript string
    const escapedCSS = cssContent
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\${/g, '\\${');
    
    // Replace the placeholder with actual CSS content
    const updatedContent = injectionFileContent.replace(
      /const CSS_CONTENT = `[^`]*`;/,
      `const CSS_CONTENT = \`${escapedCSS}\`;`
    );
    
    // Write the updated file
    fs.writeFileSync(CSS_INJECTION_FILE_PATH, updatedContent, 'utf8');
    
    console.log('✅ CSS content injected successfully');
  } catch (error) {
    console.error('❌ Error injecting CSS:', error.message);
    process.exit(1);
  }
}

injectCSS();
