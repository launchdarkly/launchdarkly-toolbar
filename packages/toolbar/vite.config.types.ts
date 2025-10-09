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
    dts({
      rollupTypes: false, // Disable rollup to avoid the API extractor issue
      exclude: ['**/*.stories.(ts|tsx)', '**/*.test.(ts|tsx)'],
      entryRoot: 'src/types',
      outDir: 'dist/types',
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/types/index.ts'),
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        return format === 'es' ? 'index.js' : 'index.cjs';
      },
    },
    rollupOptions: {
      output: [
        // ES build - externalize all dependencies
        {
          dir: 'dist/types',
          format: 'es',
          entryFileNames: 'index.js',
          external: ['react', 'react-dom', 'react/jsx-runtime', 'launchdarkly-js-client-sdk'],
        },
        // CJS build - externalize all dependencies
        {
          dir: 'dist/types',
          format: 'cjs',
          entryFileNames: 'index.cjs',
          external: ['react', 'react-dom', 'react/jsx-runtime', 'launchdarkly-js-client-sdk'],
        },
      ],
    },
  },
});
