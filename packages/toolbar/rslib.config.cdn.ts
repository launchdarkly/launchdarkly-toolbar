import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import { loadEnv } from '@rsbuild/core';

// Load environment variables with TOOLBAR_ prefix from .env files
const { publicVars } = loadEnv({ prefixes: ['TOOLBAR_'] });

export default defineConfig({
  source: {
    entry: {
      'toolbar.min': './src/core/index.ts',
    },
    include: ['./src/**/*.ts', './src/**/*.tsx'],
    exclude: ['./src/**/*.test.*', './src/**/*.stories.*'],
    // Inject TOOLBAR_ prefixed env vars into the build
    define: publicVars,
  },
  lib: [
    // IIFE build for CDN
    {
      bundle: true,
      dts: false, // No types needed for CDN
      format: 'iife',
      umdName: 'LaunchDarklyToolbar',
      output: {
        distPath: {
          root: 'cdn',
          js: '.',
        },
        filename: {
          js: '[name].js',
        },
      },
    },
  ],
  output: {
    injectStyles: true,
    target: 'web',
    minify: true,
    sourceMap: false,
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [new VanillaExtractPlugin()],
      optimization: {
        splitChunks: false,
      },
    },
  },
});
