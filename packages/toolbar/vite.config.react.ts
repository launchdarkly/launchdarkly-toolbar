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
    dts({
      rollupTypes: false, // Disable rollup to avoid the API extractor issue
      exclude: ['**/*.stories.(ts|tsx)', '**/*.test.(ts|tsx)'],
      entryRoot: 'src/react',
      outDir: 'dist/react',
    }),
    svgr({
      include: '**/*.svg',
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/react/index.ts'),
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        if (format === 'iife') return 'index.min.js';
        return format === 'es' ? 'index.js' : 'index.cjs';
      },
    },
    rollupOptions: {
      external: (id) => {
        // For IIFE build, only externalize LaunchDarkly SDK
        // Bundle React and other dependencies
        return id === 'launchdarkly-js-client-sdk';
      },
      output: [
        // ES build - externalize all dependencies
        {
          dir: 'dist/react',
          format: 'es',
          entryFileNames: 'index.js',
          external: ['react', 'react-dom', 'react/jsx-runtime', 'launchdarkly-js-client-sdk'],
        },
        // CJS build - externalize all dependencies
        {
          dir: 'dist/react',
          format: 'cjs',
          entryFileNames: 'index.cjs',
          external: ['react', 'react-dom', 'react/jsx-runtime', 'launchdarkly-js-client-sdk'],
        },
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
