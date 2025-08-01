import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
    },
    include: ['./src/index.ts'],
    exclude: ['./src/**/*.test.*'],
  },
  lib: [
    {
      bundle: true,
      dts: true,
      format: 'esm',
    },
  ],
  output: {
    injectStyles: true,
    target: 'web',
    distPath: {
      root: 'dist',
      js: 'js',
    },
    filename: {
      js: '[name].js',
    },
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [new VanillaExtractPlugin()],
    },
  },
});
