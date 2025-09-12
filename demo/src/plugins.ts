import { FlagOverridePlugin } from '@launchdarkly/toolbar/plugins';

export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});
