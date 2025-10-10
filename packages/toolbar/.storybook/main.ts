import { dirname, join } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  // Check if we're in a CommonJS environment
  if (typeof require !== 'undefined') {
    try {
      return dirname(require.resolve(join(value, 'package.json')));
    } catch {
      // If require.resolve fails, fall back to returning the package name
      return value;
    }
  }

  // For ES modules or when require is not available, return the package name
  // Storybook will handle resolution in most cases
  return value;
}

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    check: true,
  },
};

export default config;
