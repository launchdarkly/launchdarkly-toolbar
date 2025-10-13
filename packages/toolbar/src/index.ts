export * from './types';

import useLaunchDarklyToolbar from './react/useLaunchDarklyToolbar';
import type { InitializationConfig } from './types';

export { useLaunchDarklyToolbar };

export type Cleanup = () => void;

type InitFn = (initProps: InitializationConfig) => Cleanup;

export interface LaunchDarklyToolbar {
  init: InitFn;
}
