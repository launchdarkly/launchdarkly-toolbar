import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import { loadEnv } from '@rsbuild/core';

// Load environment variables with TOOLBAR_ prefix from .env files
const { publicVars } = loadEnv({ prefixes: ['TOOLBAR_'] });

/**
 * Custom identifier function for vanilla-extract.
 * Prefixes all generated class names with 'ldtb_' to make them uniquely
 * identifiable. This enables reliable detection of toolbar styles for
 * Shadow DOM isolation, preventing conflicts with host app CSS Modules.
 */
const toolbarIdentifiers = ({
  hash,
  debugId,
}: {
  hash: string;
  filePath: string;
  debugId?: string;
  packageName?: string;
}) => {
  // In development, include debugId for better debugging
  // Format: ldtb_{debugId}_{hash} or ldtb_{hash}
  const prefix = 'ldtb_';
  return debugId ? `${prefix}${debugId}_${hash}` : `${prefix}${hash}`;
};

export default defineConfig({
  source: {
    entry: {
      index: './src/index.ts',
      plugins: './src/plugins.ts',
      react: './src/react.ts',
      vue: './src/vue.ts',
      'types-entry': './src/types-entry.ts',
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
          js: '[name].js',
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
          js: '[name].cjs',
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
      vue: 'vue',
      'launchdarkly-js-client-sdk': 'launchdarkly-js-client-sdk',
    },
  },
  plugins: [pluginReact()],
  tools: {
    rspack: {
      plugins: [
        new VanillaExtractPlugin({
          identifiers: toolbarIdentifiers,
        }),
      ],
    },
  },
});
