import type { IEventInterceptionPlugin, IFlagOverridePlugin } from './plugins';
import type { ToolbarPosition } from './position';

export interface InitializationProps {
  /**
   * The base LaunchDarkly URL the toolbar should use when creating deep links.
   *
   * Default `https://app.launchdarkly.com`
   */
  baseUrl?: string;

  /**
   * The Dev Server URL (if you have a local instance of LaunchDarkly running). If
   * provided, will set the toolbar to run in Dev Server mode.
   *
   * Default `undefined`
   */
  devServerUrl?: string;

  /**
   * Dev Server Mode: The project key that the toolbar should use. If left blank, will
   * auto-detect the first available project.
   *
   * Default `undefined`
   */
  projectKey?: string;

  /**
   * Implementation of the {@link IFlagOverridePlugin} interface. Allows the toolbar + local app to override flag
   * values without changing the flag value/targeting in LaunchDarkly. If not provided, will default to our base
   * default implementation/configuration.
   *
   * Default `undefined`
   */
  flagOverridePlugin?: IFlagOverridePlugin;

  /**
   * Implementation of the {@link IEventInterceptionPlugin} interface. Allows the toolbar to track events. Useful
   * for being able to see when flags are evaluated, what they evaluate to, detect missing feature flags, and
   * seeing any custom events your app is tracking.
   *
   * Default `undefined`
   */
  eventInterceptionPlugin?: IEventInterceptionPlugin;

  /**
   * Dev Server Mode: the interval (in milliseconds) determining how frequently the toolbar should poll the Dev Server.
   *
   * Default `undefined`
   */
  pollIntervalInMs?: number;

  /**
   *
   */
  position?: ToolbarPosition; // Optional - will default to 'bottom-right'
}

export interface InitializationConfig extends InitializationProps {
  /**
   * The root node where the Toolbar will be mounted.
   *
   * Default `document.body`
   *
   * You may pass a en HTMLElement directly, or a synchronous function to return one.
   */
  mountPoint?: HTMLElement | (() => HTMLElement);

  /**
   * The `id` of the div where all the toolbar html will live.
   *
   * Default: `"ld-toolbar"`
   *
   * You can select the div like this: `document.getElementById('ld-toolbar')`
   */
  domId?: string;
}
