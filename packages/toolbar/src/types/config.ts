import { IEventInterceptionPlugin, IFlagOverridePlugin } from "./plugins";
import { ToolbarPosition } from "./position";

export interface InitConfig {
  /**
   * The root node where the Toolbar will be mounted.
   *
   * Default `document.body`
   *
   * You may pass a en HTMLElement directly, or a synchronous function to return one.
   */
  mountPoint?: undefined | HTMLElement | (() => HTMLElement);

  /**
   * The `id` of the div where all the toolbar html will live.
   *
   * Default: `"ld-toolbar"`
   *
   * You can select the div like this: `document.getElementById('ld-toolbar')`
   */
  domId?: undefined | string;

  baseUrl?: string; // Optional - will default to https://app.launchdarkly.com
  devServerUrl?: string; // Optional - will default to dev server mode if provided
  projectKey?: string; // Optional - will auto-detect first available project if not provided
  flagOverridePlugin?: IFlagOverridePlugin; // Optional - for flag override functionality
  eventInterceptionPlugin?: IEventInterceptionPlugin; // Optional - for event tracking
  pollIntervalInMs?: number; // Optional - will default to 5000ms
  position?: ToolbarPosition; // Optional - will default to 'bottom-right'
}