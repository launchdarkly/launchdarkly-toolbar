/**
 * Plugin exports for the LaunchDarkly Toolbar
 *
 * This entry point allows importing plugins separately from the main toolbar
 * for better bundle size optimization when using lazy loading.
 *
 * @example
 * ```ts
 * import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';
 *
 * const flagOverridePlugin = new FlagOverridePlugin({
 *   storageNamespace: 'my-app-overrides',
 * });
 *
 * const eventInterceptionPlugin = new EventInterceptionPlugin({
 *   eventCapacity: 150,
 * });
 * ```
 */
export { FlagOverridePlugin, EventInterceptionPlugin } from './types/plugins';

export type {
  FlagOverridePluginConfig,
  EventInterceptionPluginConfig,
  IFlagOverridePlugin,
  IEventInterceptionPlugin,
} from './types/plugins';
