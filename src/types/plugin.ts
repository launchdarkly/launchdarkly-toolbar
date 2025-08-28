import type { LDClient } from 'launchdarkly-js-client-sdk';

/**
 * Interface for debug override plugins that can be used with the LaunchDarkly Toolbar
 */
export interface IDebugOverridePlugin {
  /**
   * Sets an override value for a feature flag
   * @param flagKey - The key of the flag to override
   * @param value - The value to set for the flag
   */
  setOverride(flagKey: string, value: unknown): void;

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
  getAllOverrides(): Record<string, unknown>;

  /**
   * Returns the LaunchDarkly client instance
   * @returns The LaunchDarkly client with allFlags method
   */
  getClient(): LDClient | null;
}
