import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const toolbarSrc = resolve(rootDir, 'toolbar', 'src', 'index.ts');

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [react(), ...vanillaExtractPlugin()],
    resolve: {
      alias: isDev
        ? [
            {
              find: '@launchdarkly/toolbar',
              replacement: toolbarSrc,
            },
          ]
        : [],
    },
    server: isDev
      ? {
          fs: {
            allow: [rootDir, resolve(rootDir, 'toolbar'), resolve(rootDir, '..', '..')],
          },
        }
      : undefined,
    optimizeDeps: isDev
      ? {
          exclude: ['@launchdarkly/toolbar'],
        }
      : undefined,
  };
});
