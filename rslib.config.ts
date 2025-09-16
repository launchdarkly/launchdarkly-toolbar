import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
      'plugins/index': './src/plugins/index.ts',
    },
    include: ['./src/index.ts', './src/plugins/**/*.ts', './src/plugins/**/*.tsx'],
    exclude: ['./src/**/*.test.*'],
    define: {
      __PKG_VERSION__: JSON.stringify(process.env.npm_package_version || ''),
      // Build-time toggle for telemetry (string '0' or '1'). Defaults to undefined.
      __LD_TOOLBAR_TELEMETRY__: JSON.stringify(process.env.LD_TOOLBAR_TELEMETRY ?? ''),
    },
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
