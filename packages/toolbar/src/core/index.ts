// Enable Shadow DOM support for React Aria/Stately components BEFORE any other imports
// This must be called early to ensure all LaunchPad components work correctly in Shadow DOM
import { enableShadowDOM } from '@react-stately/flags';
enableShadowDOM();

import { InitializationConfig } from '../types';
import mount from './mount';
import hydrateConfig from './utils/hydrateConfig';
import { loadSharedStateFromUrl } from './utils/urlOverrides';

export type Cleanup = () => void;

export function init(config: InitializationConfig): Cleanup {
  try {
    const result = loadSharedStateFromUrl(undefined, undefined, config.flagOverridePlugin);
    if (result.loaded) {
      console.log('[LaunchDarkly Toolbar] Loaded shared state from URL');
    } else if (result.error) {
      console.error('[LaunchDarkly Toolbar] Failed to load shared state:', result.error);
    }
  } catch (error) {
    console.error('[LaunchDarkly Toolbar] Unexpected error loading shared state:', error);
  }

  return mount(document.body, hydrateConfig(config));
}

// For IIFE builds, create the global variable explicitly
const LaunchDarklyToolbar = { init };

// Assign to window for CDN usage
if (typeof window !== 'undefined') {
  (window as any).LaunchDarklyToolbar = LaunchDarklyToolbar;
}

// Also export as default for module systems
export default LaunchDarklyToolbar;
