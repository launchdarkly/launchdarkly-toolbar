import type { LDClient } from 'launchdarkly-js-client-sdk';

/**
 * Singleton storage for the toolbar's internal LaunchDarkly client.
 * This allows flag functions to access the client without React context.
 */
let internalClient: LDClient | null = null;

/**
 * Sets the internal client. Called during initialization.
 */
export function setToolbarFlagClient(client: LDClient | null): void {
  internalClient = client;
}

/**
 * Gets the current internal client.
 */
export function getToolbarFlagClient(): LDClient | null {
  return internalClient;
}

/**
 * Creates a function that returns the value of a toolbar feature flag.
 *
 * @param flagKey - The LaunchDarkly flag key
 * @param defaultValue - Default value if client isn't initialized or flag doesn't exist
 * @returns A function that returns the current flag value
 */
export function createToolbarFlagFunction<T>(flagKey: string, defaultValue: T): () => T {
  return () => {
    if (!internalClient) {
      return defaultValue;
    }

    return internalClient.variation(flagKey, defaultValue) as T;
  };
}
