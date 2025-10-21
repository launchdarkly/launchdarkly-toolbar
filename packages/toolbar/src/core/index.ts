import { InitializationConfig } from '../types';
import mount from './mount';
import hydrateConfig from './utils/hydrateConfig';
import './globals.css';

export type Cleanup = () => void;

export function init(config: InitializationConfig): Cleanup {
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
