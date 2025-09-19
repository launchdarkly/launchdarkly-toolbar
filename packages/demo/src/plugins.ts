import { EventInterceptionPlugin, FlagOverridePlugin } from '@launchdarkly/toolbar';

export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});

export const eventInterceptionPlugin = new EventInterceptionPlugin();
