import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const toolbarSrc = resolve(rootDir, 'toolbar', 'src', 'index.ts');
const toolbarPluginsSrc = resolve(rootDir, 'toolbar', 'src', 'plugins.ts');
const toolbarReactSrc = resolve(rootDir, 'toolbar', 'src', 'react.ts');
const toolbarTypesSrc = resolve(rootDir, 'toolbar', 'src', 'types-entry.ts');

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    plugins: [react(), ...vanillaExtractPlugin()],
    resolve: {
      alias: isDev
        ? [
            // More specific paths must come before the base path
            {
              find: '@launchdarkly/toolbar/plugins',
              replacement: toolbarPluginsSrc,
            },
            {
              find: '@launchdarkly/toolbar/react',
              replacement: toolbarReactSrc,
            },
            {
              find: '@launchdarkly/toolbar/types',
              replacement: toolbarTypesSrc,
            },
            // Base path last (catches @launchdarkly/toolbar without subpath)
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
            allow: [rootDir],
          },
        }
      : undefined,
    optimizeDeps: isDev
      ? {
          exclude: [
            '@launchdarkly/toolbar',
            '@launchdarkly/toolbar/plugins',
            '@launchdarkly/toolbar/react',
            '@launchdarkly/toolbar/types',
          ],
        }
      : undefined,
  };
});
