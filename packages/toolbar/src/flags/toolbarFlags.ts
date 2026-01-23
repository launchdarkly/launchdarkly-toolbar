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
export const ENABLE_SESSION_REPLAY_FLAG_KEY = 'toolbar-enable-session-replay';
export const USE_NEW_TOOLBAR_DESIGN_FLAG_KEY = 'use-new-toolbar-design';

export const enableAiIcon = createToolbarFlagFunction('enable-ai-icon', false);
export const enableInteractiveIcon = createToolbarFlagFunction('enable-interactive-icon', false);
export const enableOptimizeIcon = createToolbarFlagFunction('enable-optimize-icon', false);
export const enableSessionReplay = createToolbarFlagFunction(ENABLE_SESSION_REPLAY_FLAG_KEY, false);
export const useNewToolbarDesign = createToolbarFlagFunction(USE_NEW_TOOLBAR_DESIGN_FLAG_KEY, false);
