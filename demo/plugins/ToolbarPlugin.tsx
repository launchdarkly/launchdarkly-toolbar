import type { LDClient, LDPlugin, LDDebugOverride } from 'launchdarkly-react-client-sdk';
export type ToolbarPluginConfig = {
  storageNamespace?: string;
};

const DEFAULT_STORAGE_NAMESPACE = 'ld-toolbar';

export class ToolbarPlugin implements LDPlugin {
  private debugOverride?: LDDebugOverride;
  private config: Required<ToolbarPluginConfig>;

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  register(_ldClient: LDClient): void {
    console.log('ToolbarPlugin: Registered with LaunchDarkly client');
  }

  registerDebug(debugOverride: LDDebugOverride): void {
    console.log('ToolbarPlugin: Debug interface registered');
    this.debugOverride = debugOverride;
    this.loadExistingOverrides();
  }

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

            this.debugOverride.setOverride(flagKey, value);
            loadedCount++;
          } catch {
            console.warn('ToolbarPlugin: Invalid stored value for', key);
            storage.removeItem(key);
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
      this.persistOverride(flagKey, value);
      this.debugOverride.setOverride(flagKey, value);
      console.log(`ToolbarPlugin: Set override ${flagKey} =`, value);
    } catch (error) {
      console.error('ToolbarPlugin: Failed to set override:', error);
    }
  }

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
      this.removePersistedOverride(flagKey);
      this.debugOverride.removeOverride(flagKey);
      console.log(`ToolbarPlugin: Removed override for ${flagKey}`);
    } catch (error) {
      console.error('ToolbarPlugin: Failed to remove override:', error);
    }
  }

  clearAllOverrides(): void {
    if (!this.debugOverride) {
      console.warn('ToolbarPlugin: Debug interface not available');
      return;
    }

    try {
      this.clearPersistedOverrides();
      this.debugOverride.clearAllOverrides();
    } catch (error) {
      console.error('ToolbarPlugin: Failed to clear overrides:', error);
    }
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
      console.error('ToolbarPlugin: Failed to persist override:', error);
    }
  }

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
