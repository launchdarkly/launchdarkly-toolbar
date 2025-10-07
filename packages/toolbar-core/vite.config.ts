import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import svgr from 'vite-plugin-svgr';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const { env } = process;
env.NODE_ENV = env.NODE_ENV ?? 'development';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({ rollupTypes: true, exclude: ['**/*.stories.(ts|tsx)'] }),
    svgr({
      include: '**/*.svg',
    }),
    vanillaExtractPlugin(),
    cssInjectedByJsPlugin({
      styleId: 'ld-toolbar-styles',
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LaunchDarklyToolbar',
      formats: ['iife'],
      // Implement a custom filename to remove the `iife` suffix
      fileName: () => 'toolbar.min.js',
    },
    rollupOptions: {
      output: {
        intro: () => {
          return 'exports = window.LaunchDarklyToolbar || {};';
        },
      },
      context: 'window',
    },
  },
  css: {
    transformer: 'postcss',
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
