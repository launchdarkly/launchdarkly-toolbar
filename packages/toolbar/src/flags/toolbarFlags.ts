import { createToolbarFlagFunction } from './createToolbarFlagFunction';

/**
 * Toolbar feature flags
 *
 * These flags control features within the toolbar itself using the toolbar's
 * internal LaunchDarkly client (not the user's application client).
 *
 * To add a toolbar feature flag, export it here like:
 * export const myFeature = createToolbarFlagFunction('my-feature-key', defaultValue);
 */

// Placeholder - remove once real toolbar flags are added
export const __placeholder = createToolbarFlagFunction('__placeholder', false);
