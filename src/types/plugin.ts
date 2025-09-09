import type { LDClient, LDDebugOverride, LDFlagSet, LDFlagValue, LDPlugin } from 'launchdarkly-js-client-sdk';
import { ProcessedEvent } from './events';

/**
 * Interface for flag override plugins that can be used with the LaunchDarkly Toolbar
 */
export interface IDebugOverridePlugin extends LDDebugOverride {
  /**
   * Sets an override value for a feature flag
   * @param flagKey - The key of the flag to override
   * @param value - The value to set for the flag
   */
  setOverride(flagKey: string, value: LDFlagValue): void;

  /**
   * Removes an override for a specific feature flag
   * @param flagKey - The key of the flag to remove the override for
   */
  removeOverride(flagKey: string): void;

  /**
   * Clears all feature flag overrides
   */
  clearAllOverrides(): void;

  /**
   * Returns all currently active feature flag overrides
   * @returns Record of flag keys to their override values
   */
  getAllOverrides(): LDFlagSet;

  /**
   * Returns the LaunchDarkly client instance
   * @returns The LaunchDarkly client with allFlags method
   */
  getClient(): LDClient | null;
}

/**
 * Interface for event interception plugins that can be used with the LaunchDarkly Toolbar
 */
export interface IEventInterceptionPlugin extends LDPlugin {
  /**
   * Gets all intercepted events from the event store
   * @returns Array of processed events
   */
  getEvents(): ProcessedEvent[];

  /**
   * Subscribes to event store changes
   * @param listener - Callback function to be called when events change
   * @returns Unsubscribe function
   */
  subscribe(listener: () => void): () => void;

  /**
   * Clears all events from the event store
   */
  clearEvents(): void;
}
