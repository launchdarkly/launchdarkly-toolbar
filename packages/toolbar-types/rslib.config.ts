import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
    include: ['./src/**/*.ts', './src/**/*.tsx'],
    exclude: ['./src/**/*.test.*', './src/**/*.stories.*'],
  },
  lib: [
    // ESM build for NPM
    {
      bundle: true,
      dts: true,
      format: 'esm',
      output: {
        distPath: {
          root: 'dist',
          js: 'js',
        },
        filename: {
          js: 'index.js',
        },
      },
    },
    // CJS build for NPM
    {
      bundle: true,
      dts: false, // Only generate types once
      format: 'cjs',
      output: {
        distPath: {
          root: 'dist',
          js: '.',
        },
        filename: {
          js: 'index.cjs',
        },
      },
    },
  ],
  output: {
    target: 'web',
    sourceMap: true,
    externals: {
      'launchdarkly-js-client-sdk': 'launchdarkly-js-client-sdk',
    },
  },
});
