import { ToolbarPosition } from "../ui/Toolbar/types";
import { IEventInterceptionPlugin, IFlagOverridePlugin } from "./plugin";

export default interface InitConfig {
  /**
   * The root node where the Toolbar will be mounted.
   *
   * Default `document.body`
   *
   * You may pass a en HTMLElement directly, or a synchronous function to return one.
   */
  mountPoint?: undefined | HTMLElement | (() => HTMLElement);
  baseUrl?: string; // Optional - will default to https://app.launchdarkly.com
  devServerUrl?: string; // Optional - will default to dev server mode if provided
  projectKey?: string; // Optional - will auto-detect first available project if not provided
  flagOverridePlugin?: IFlagOverridePlugin; // Optional - for flag override functionality
  eventInterceptionPlugin?: IEventInterceptionPlugin; // Optional - for event tracking
  pollIntervalInMs?: number; // Optional - will default to 5000ms
  position?: ToolbarPosition; // Optional - will default to 'bottom-right'
}