import { InitializationConfig } from '@launchdarkly/toolbar-types';

export type Cleanup = () => void;

type InitFn = (initProps: InitializationConfig) => Cleanup;

export interface LaunchDarklyToolbar {
  init: InitFn;
}
