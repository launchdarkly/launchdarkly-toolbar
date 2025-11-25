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
export const useNewToolbarDesign = createToolbarFlagFunction('use-new-toolbar-design', false);
