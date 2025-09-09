import { DebugOverridePlugin } from '../../src/plugins/DebugOverridePlugin';

// Plugin for flag overrides
export const debugOverridePlugin = new DebugOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});
