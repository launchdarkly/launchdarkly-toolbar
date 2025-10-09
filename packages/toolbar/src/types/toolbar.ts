import type { InitializationConfig } from './config';

export interface LaunchDarklyToolbar {
  init: (config: InitializationConfig) => () => void;
}
