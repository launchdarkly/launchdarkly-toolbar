import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

const { env } = process;
env.NODE_ENV = env.NODE_ENV ?? 'development';

const isCDN = process.env.BUILD_TARGET === 'cdn';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      rollupTypes: true,
      exclude: ['**/*.stories.(ts|tsx)', '**/*.test.(ts|tsx)'],
      // Only generate types for NPM build
      include: isCDN ? [] : ['src/**/*.ts', 'src/**/*.tsx'],
    }),
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
    outDir: isCDN ? 'cdn' : 'dist',
    minify: isCDN ? 'esbuild' : false,
    lib: {
      entry: resolve(__dirname, isCDN ? 'src/core/index.ts' : 'src/index.ts'),
      ...(isCDN
        ? {
            // CDN build: IIFE bundle
            name: 'LaunchDarklyToolbar',
            formats: ['iife'],
            fileName: () => 'toolbar.min.js',
          }
        : {
            // NPM build: ES + CJS
            fileName: 'index',
            formats: ['es', 'cjs'],
          }),
    },
    rollupOptions: isCDN
      ? {
          // CDN build: bundle everything (React included for standalone use)
        }
      : {
          // NPM build: externalize peer dependencies only
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            'launchdarkly-js-client-sdk',
          ],
        },
  },
  css: {
    transformer: 'postcss',
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
