import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';
import { loadEnv } from '@rsbuild/core';

// Load environment variables with TOOLBAR_ prefix from .env files
const { publicVars } = loadEnv({ prefixes: ['TOOLBAR_'] });

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
    include: ['./src/**/*.ts', './src/**/*.tsx'],
    exclude: ['./src/**/*.test.*', './src/**/*.stories.*'],
    // Inject TOOLBAR_ prefixed env vars into the build
    define: publicVars,
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
      // Externalize peer dependencies for NPM builds
      react: 'react',
      'react-dom': 'react-dom',
      'react/jsx-runtime': 'react/jsx-runtime',
      'launchdarkly-js-client-sdk': 'launchdarkly-js-client-sdk',
    },
  },
  plugins: [pluginReact()],
});
