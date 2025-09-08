import { FlagOverridePlugin } from '../../src/plugins/FlagOverridePlugin';
import { EventInterceptionPlugin } from '../../src/plugins/EventInterceptionPlugin';

// Plugin for flag overrides
export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});

// Plugin for event interception
export const eventInterceptionPlugin = new EventInterceptionPlugin();
