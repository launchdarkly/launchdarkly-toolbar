import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const toolbarTypesSrc = resolve(rootDir, 'toolbar', 'src', 'types', 'index.ts');
const toolbarReactSrc = resolve(rootDir, 'toolbar', 'src', 'react', 'index.ts');

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [react(), ...vanillaExtractPlugin()],
    resolve: {
      alias: isDev
        ? [
            {
              find: '@launchdarkly/toolbar/types',
              replacement: toolbarTypesSrc,
            },
            {
              find: '@launchdarkly/toolbar/react',
              replacement: toolbarReactSrc,
            },
          ]
        : [],
    },
    server: isDev
      ? {
          fs: {
            allow: [
              rootDir,
              resolve(rootDir, 'toolbar', 'core'),
              resolve(rootDir, 'toolbar', 'types'),
              resolve(rootDir, 'toolbar', 'react'),
              resolve(rootDir, '..', '..'),
            ],
          },
        }
      : undefined,
    optimizeDeps: isDev
      ? {
          exclude: ['@launchdarkly/toolbar/types', '@launchdarkly/toolbar/react'],
        }
      : undefined,
  };
});
