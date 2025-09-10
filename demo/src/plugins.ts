import { FlagOverridePlugin } from '@launchdarkly/toolbar';

export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});
