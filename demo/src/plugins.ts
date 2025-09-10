import { EventInterceptionPlugin } from '../../src/plugins/EventInterceptionPlugin';
import { FlagOverridePlugin } from '../../src/plugins/FlagOverridePlugin';

// Plugin for flag overrides
export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});

export const eventInterceptionPlugin = new EventInterceptionPlugin();
