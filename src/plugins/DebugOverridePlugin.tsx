import type { LDClient, LDPlugin, LDDebugOverride, LDPluginMetadata } from 'launchdarkly-js-client-sdk';

/**
 * Configuration options for the DebugOverridePlugin
 */
export type DebugOverridePluginConfig = {
  /** Namespace for localStorage keys. Defaults to 'ld-debug-override' */
  storageNamespace?: string;
};

const DEFAULT_STORAGE_NAMESPACE = 'ld-debug-override';

export class DebugOverridePlugin implements LDPlugin {
  private debugOverride?: LDDebugOverride;
  private config: Required<DebugOverridePluginConfig>;
  private ldClient: LDClient | null = null;

  constructor(config: DebugOverridePluginConfig = {}) {
    this.config = {
      storageNamespace: config.storageNamespace ?? DEFAULT_STORAGE_NAMESPACE,
    };
  }

  /**
   * Returns plugin metadata
   */
  getMetadata(): LDPluginMetadata {
    return {
      name: 'DebugOverridePlugin',
    };
  }

  /**
   * Called when the plugin is registered with the LaunchDarkly client
   */
  register(ldClient: LDClient): void {
    this.ldClient = ldClient;
  }

  /**
   * Called when the debug interface is available
   * Loads any existing overrides from localStorage
   */
  registerDebug(debugOverride: LDDebugOverride): void {
    this.debugOverride = debugOverride;
    this.loadExistingOverrides();
  }

  private loadExistingOverrides(): void {
    if (!this.debugOverride) return;

    const storage = this.getStorage();
    if (!storage) return;

    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key?.startsWith(this.config.storageNamespace + ':')) continue;

        const storedValue = storage.getItem(key);
        if (storedValue) {
          try {
            const value = JSON.parse(storedValue);
            const flagKey = key.replace(this.config.storageNamespace + ':', '');

            this.debugOverride.setOverride(flagKey, value);
          } catch {
            console.warn('debugOverridePlugin: Invalid stored value for', key);
            storage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('debugOverridePlugin: Error loading existing overrides:', error);
    }
  }

  /**
   * Sets an override value for a feature flag and persists it to localStorage
   * @param flagKey - The key of the flag to override
   * @param value - The value to set for the flag
   */
  setOverride(flagKey: string, value: unknown): void {
    if (!this.debugOverride) {
      console.warn('debugOverridePlugin: Debug interface not available');
      return;
    }

    if (!flagKey || typeof flagKey !== 'string') {
      console.error('debugOverridePlugin: Invalid flag key:', flagKey);
      return;
    }

    if (value === undefined) {
      console.error('debugOverridePlugin: Cannot set undefined value for flag override');
      return;
    }

    try {
      this.persistOverride(flagKey, value);
      this.debugOverride.setOverride(flagKey, value);
    } catch (error) {
      console.error('debugOverridePlugin: Failed to set override:', error);
    }
  }

  /**
   * Removes an override for a specific feature flag
   * @param flagKey - The key of the flag to remove the override for
   */
  removeOverride(flagKey: string): void {
    if (!this.debugOverride) {
      console.warn('debugOverridePlugin: Debug interface not available');
      return;
    }

    if (!flagKey || typeof flagKey !== 'string') {
      console.error('debugOverridePlugin: Invalid flag key:', flagKey);
      return;
    }

    try {
      this.removePersistedOverride(flagKey);
      this.debugOverride.removeOverride(flagKey);
    } catch (error) {
      console.error('debugOverridePlugin: Failed to remove override:', error);
    }
  }

  /**
   * Clears all feature flag overrides from both memory and localStorage
   */
  clearAllOverrides(): void {
    if (!this.debugOverride) {
      console.warn('debugOverridePlugin: Debug interface not available');
      return;
    }

    try {
      this.clearPersistedOverrides();
      this.debugOverride.clearAllOverrides();
    } catch (error) {
      console.error('debugOverridePlugin: Failed to clear overrides:', error);
    }
  }

  /**
   * Returns all currently active feature flag overrides
   * @returns Record of flag keys to their override values
   */
  getAllOverrides(): Record<string, unknown> {
    if (!this.debugOverride) {
      console.warn('debugOverridePlugin: Debug interface not available');
      return {};
    }

    try {
      return this.debugOverride.getAllOverrides();
    } catch (error) {
      console.error('debugOverridePlugin: Failed to get overrides:', error);
      return {};
    }
  }

  /**
   * Returns the LaunchDarkly client instance
   * @returns The LaunchDarkly client
   */
  getClient(): LDClient | null {
    return this.ldClient;
  }

  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  }

  private persistOverride(flagKey: string, value: unknown): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      const storageKey = `${this.config.storageNamespace}:${flagKey}`;
      storage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error('debugOverridePlugin: Failed to persist override:', error);
    }
  }

  private removePersistedOverride(flagKey: string): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      const storageKey = `${this.config.storageNamespace}:${flagKey}`;
      storage.removeItem(storageKey);
    } catch (error) {
      console.error('debugOverridePlugin: Failed to remove persisted override:', error);
    }
  }

  private clearPersistedOverrides(): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      const keysToRemove: string[] = [];
      const prefix = this.config.storageNamespace + ':';

      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => storage.removeItem(key));
    } catch (error) {
      console.error('debugOverridePlugin: Failed to clear persisted overrides:', error);
    }
  }
}
