/**
 * Vue-specific exports for the LaunchDarkly Toolbar
 *
 * This entry point provides Vue composables and utilities for integrating
 * the toolbar with Vue 3 applications.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar/vue';
 * import { FlagOverridePlugin } from '@launchdarkly/toolbar/plugins';
 *
 * // Create plugins outside the component (only once)
 * const flagOverridePlugin = new FlagOverridePlugin();
 *
 * useLaunchDarklyToolbar({
 *   flagOverridePlugin,
 *   enabled: true,
 * });
 * </script>
 * ```
 */
export { default as useLaunchDarklyToolbar } from './vue/useLaunchDarklyToolbar';
export { default as lazyLoadToolbar } from './react/lazyLoadToolbar';
