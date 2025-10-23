import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';

export default defineConfig({
  source: {
    entry: {
      'toolbar.min': './src/core/index.ts',
    },
    include: ['./src/**/*.ts', './src/**/*.tsx'],
    exclude: ['./src/**/*.test.*', './src/**/*.stories.*'],
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
