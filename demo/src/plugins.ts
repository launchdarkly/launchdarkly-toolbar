import { DebugOverridePlugin } from '../../src/plugins/DebugOverridePlugin';
import { EventInterceptionPlugin } from '../../src/plugins/EventInterceptionPlugin';

// Plugin for flag overrides
export const debugOverridePlugin = new DebugOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});

// Plugin for event interception
export const eventInterceptionPlugin = new EventInterceptionPlugin({
  enableLogging: false,
});
