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
  // In production, use short prefixed hash
  // Format: ldtb_{hash} or ldtb_{debugId}_{hash}
  const prefix = 'ldtb_';
  return debugId ? `${prefix}${debugId}_${hash}` : `${prefix}${hash}`;
};

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
      plugins: [
        new VanillaExtractPlugin({
          identifiers: toolbarIdentifiers,
        }),
      ],
      optimization: {
        splitChunks: false,
      },
    },
  },
});
