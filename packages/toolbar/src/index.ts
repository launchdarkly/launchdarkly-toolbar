import './globals.css';
import mount from './mount';
import InitConfig from './types/initConfig';
import { LaunchDarklyToolbarProps } from './ui/Toolbar/LaunchDarklyToolbar';

export { LaunchDarklyToolbar } from './ui/Toolbar/LaunchDarklyToolbar';
export type { LaunchDarklyToolbarProps } from './ui/Toolbar/LaunchDarklyToolbar';
export type { ToolbarPosition } from './ui/Toolbar/types/toolbar';

export type { IFlagOverridePlugin, IEventInterceptionPlugin } from './types/plugin';
export { FlagOverridePlugin, EventInterceptionPlugin } from './plugins';
export type { FlagOverridePluginConfig, EventInterceptionPluginConfig } from './plugins';

export { AfterEvaluationHook, AfterIdentifyHook, AfterTrackHook, EventStore } from './hooks';
export type { AfterEvaluationHookConfig, AfterIdentifyHookConfig, AfterTrackHookConfig } from './hooks';
export type { ProcessedEvent, EventFilter } from './types/events';

export type Cleanup = () => void;

export function init(config: InitConfig): Cleanup {
  const {mountPoint} = config;
  const root = typeof mountPoint === 'function' ? mountPoint() : mountPoint;

  return mount(root ?? document.body, config);
}
