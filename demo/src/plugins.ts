import { FlagOverridePlugin } from '../../src/plugins/FlagOverridePlugin';

// Plugin for flag overrides
export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});
