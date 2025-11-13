import type { IEventInterceptionPlugin, IFlagOverridePlugin } from './plugins';
import type { ToolbarPosition } from './position';

export interface ToolbarConfig {
  /**
   * The client side ID of the LaunchDarkly project.
   *
   * Default `undefined`. Either `clientSideId` or `projectKey` must be provided to make requests to the LaunchDarkly API.
   * If both are provided, `projectKey` will take precedence.
   */
  clientSideId?: string;

  /**
   * The base LaunchDarkly URL the toolbar should use when creating deep links.
   *
   * Default `https://app.launchdarkly.com`
   */
  baseUrl?: string;

  /**
   * The LaunchDarkly Auth URL the toolbar should use when authenticating.
   *
   * Default `https://integrations.launchdarkly.com`
   */
  authUrl?: string;

  /**
   * The Dev Server URL (if you have a local instance of LaunchDarkly running). If
   * provided, will set the toolbar to run in Dev Server mode.
   *
   * Default `undefined`
   */
  devServerUrl?: string;

  /**
   * General: Used by the toolbar when making requests to the LaunchDarkly API.
   *
   * Dev Server Mode: The project key that the toolbar should use. If left blank, will
   * auto-detect the first available project.
   *
   * Default `undefined`. Either `clientSideId` or `projectKey` must be provided to make requests to the LaunchDarkly API.
   * If both are provided, `projectKey` will take precedence.
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
   * Toolbar position on screen.
   *
   * Default `'bottom-right'`
   */
  position?: ToolbarPosition;
}

export interface InitializationConfig extends ToolbarConfig {}
