import type { LDClient, LDPlugin, LDDebugOverride } from 'launchdarkly-react-client-sdk';
export type ToolbarPluginConfig = {
  storageNamespace?: string; // default: 'ld-toolbar'
};

const DEFAULT_STORAGE_NAMESPACE = 'ld-toolbar';

export class ToolbarPlugin implements LDPlugin {
  private debugOverride?: LDDebugOverride;
  private config: Required<ToolbarPluginConfig>;
  private overrides = new Map<string, unknown>();

  constructor(config: ToolbarPluginConfig = {}) {
    this.config = {
      storageNamespace: config.storageNamespace ?? DEFAULT_STORAGE_NAMESPACE,
    };
  }

  getMetadata() {
    return {
      name: 'ToolbarPlugin',
      version: '1.0.0',
    };
  }

  register(ldClient: LDClient): void {
    console.log('🚀 ~ ToolbarPlugin ~ register ~ ldClient:', ldClient);
    // Plugin is registered, ready to work with debug interface
  }

  registerDebug(debugOverride: LDDebugOverride): void {
    console.log('🚀 ~ ToolbarPlugin ~ registerDebug ~ debugOverride:', debugOverride);
    this.debugOverride = debugOverride;

    // Load any existing overrides from storage
    this.loadExistingOverrides();
  }

  // Core function 1: Load existing overrides if there are any
  private loadExistingOverrides(): void {
    if (!this.debugOverride) return;

    const storage = this.getStorage();
    if (!storage) return;

    let loadedCount = 0;

    try {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (!key?.startsWith(this.config.storageNamespace + ':')) continue;

        const storedValue = storage.getItem(key);
        if (storedValue) {
          try {
            const value = JSON.parse(storedValue);
            const flagKey = key.replace(this.config.storageNamespace + ':', '');

            this.overrides.set(flagKey, value);
            this.debugOverride.setOverride(flagKey, value);
            loadedCount++;
          } catch (error) {
            console.warn('ToolbarPlugin: Invalid stored value for', key);
            storage.removeItem(key); // Clean up invalid entries
          }
        }
      }

      if (loadedCount > 0) {
        console.log(`ToolbarPlugin: Loaded ${loadedCount} existing overrides`);
      }
    } catch (error) {
      console.error('ToolbarPlugin: Error loading existing overrides:', error);
    }
  }

  // Core function 2: Set an override
  setOverride(flagKey: string, value: unknown): void {
    if (!this.debugOverride) {
      console.warn('ToolbarPlugin: Debug interface not available');
      return;
    }

    if (!flagKey || typeof flagKey !== 'string') {
      console.error('ToolbarPlugin: Invalid flag key:', flagKey);
      return;
    }

    try {
      // Store in memory
      // this.overrides.set(flagKey, value);

      // // Persist to storage
      // this.persistOverride(flagKey, value);

      // Apply via debug interface (triggers React updates)
      console.log('🚀 ~ ToolbarPlugin ~ setOverride ~');

      this.debugOverride.setOverride(flagKey, value);

      console.log(`ToolbarPlugin: Set override ${flagKey} =`, value);
    } catch (error) {
      console.error('ToolbarPlugin: Failed to set override:', error);
    }
  }

  // Core function 3: Remove a specific override
  removeOverride(flagKey: string): void {
    if (!this.debugOverride) {
      console.warn('ToolbarPlugin: Debug interface not available');
      return;
    }

    if (!flagKey || typeof flagKey !== 'string') {
      console.error('ToolbarPlugin: Invalid flag key:', flagKey);
      return;
    }

    try {
      // Remove from memory
      this.overrides.delete(flagKey);

      // Remove from storage
      this.removePersistedOverride(flagKey);

      // Remove via debug interface (triggers React updates)
      this.debugOverride.removeOverride(flagKey);

      console.log(`ToolbarPlugin: Removed override for ${flagKey}`);
    } catch (error) {
      console.error('ToolbarPlugin: Failed to remove override:', error);
    }
  }

  // Core function 4: Clear all overrides
  clearAllOverrides(): void {
    if (!this.debugOverride) {
      console.warn('ToolbarPlugin: Debug interface not available');
      return;
    }

    try {
      const overrideCount = this.overrides.size;

      // Clear from memory
      this.overrides.clear();

      // Clear from storage
      this.clearPersistedOverrides();

      // Clear via debug interface (triggers React updates)
      this.debugOverride.clearAllOverrides();

      console.log(`ToolbarPlugin: Cleared ${overrideCount} overrides`);
    } catch (error) {
      console.error('ToolbarPlugin: Failed to clear overrides:', error);
    }
  }

  // Utility: Get current overrides
  getOverrides(): Record<string, unknown> {
    return Object.fromEntries(this.overrides);
  }

  // Helper: Get storage
  private getStorage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return window.localStorage; // Use localStorage for persistence
  }

  // Helper: Persist single override
  private persistOverride(flagKey: string, value: unknown): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      const storageKey = `${this.config.storageNamespace}:${flagKey}`;
      storage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.error('ToolbarPlugin: Failed to persist override:', error);
    }
  }

  // Helper: Remove persisted override
  private removePersistedOverride(flagKey: string): void {
    const storage = this.getStorage();
    if (!storage) return;

    try {
      const storageKey = `${this.config.storageNamespace}:${flagKey}`;
      storage.removeItem(storageKey);
    } catch (error) {
      console.error('ToolbarPlugin: Failed to remove persisted override:', error);
    }
  }

  // Helper: Clear all persisted overrides
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
      console.error('ToolbarPlugin: Failed to clear persisted overrides:', error);
    }
  }
}
