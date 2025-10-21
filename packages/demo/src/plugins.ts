import { EventInterceptionPlugin, FlagOverridePlugin } from '@launchdarkly/toolbar-types';

export const flagOverridePlugin = new FlagOverridePlugin({
  storageNamespace: 'ld-demo-overrides',
});

export const eventInterceptionPlugin = new EventInterceptionPlugin({ eventCapacity: 150 });
