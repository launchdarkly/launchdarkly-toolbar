/**
 * React-specific exports for the LaunchDarkly Toolbar
 *
 * This entry point provides React hooks and utilities for integrating
 * the toolbar with React applications.
 *
 * @example
 * ```tsx
 * import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar/react';
 * import { FlagOverridePlugin } from '@launchdarkly/toolbar/plugins';
 *
 * // Create plugins outside the component (only once)
 * const flagOverridePlugin = new FlagOverridePlugin();
 *
 * function App() {
 *   useLaunchDarklyToolbar({
 *     flagOverridePlugin,
 *   });
 *
 *   return <YourApp />;
 * }
 * ```
 */
export { default as useLaunchDarklyToolbar } from './react/useLaunchDarklyToolbar';
export { default as lazyLoadToolbar } from './core/lazyLoadToolbar';
