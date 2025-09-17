import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const toolbarSrc = resolve(rootDir, 'src', 'index.ts');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@launchdarkly/toolbar': toolbarSrc,
    },
  },
  server: {
    fs: {
      allow: [rootDir],
    },
  },
  optimizeDeps: {
    exclude: ['@launchdarkly/toolbar'],
  },
});
