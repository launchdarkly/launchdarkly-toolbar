/**
 * Import plugins from the dedicated plugins entry point.
 * This allows for better tree-shaking and smaller bundle sizes
 * when lazy-loading the main toolbar.
 */
import { EventInterceptionPlugin, FlagOverridePlugin } from '@launchdarkly/toolbar/plugins';

export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});

export const eventInterceptionPlugin = new EventInterceptionPlugin({ eventCapacity: 150 });
