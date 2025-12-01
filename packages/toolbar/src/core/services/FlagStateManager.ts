import { DevServerClient } from './DevServerClient';
import { EnhancedFlag } from '../types/devServer';
import { ApiFlag, ApiVariation } from '../ui/Toolbar/types/ldApi';
import { parseUrlOverrides } from '../utils/urlOverrides';

export class FlagStateManager {
  private devServerClient: DevServerClient;
  private listeners: Set<(flags: Record<string, EnhancedFlag>) => void> = new Set();
  private apiFlags: ApiFlag[] = [];
  private urlOverrides: Record<string, any> = {};

  constructor(devServerClient: DevServerClient) {
    this.devServerClient = devServerClient;
    this.loadUrlOverrides();
  }

  private loadUrlOverrides(): void {
    try {
      this.urlOverrides = parseUrlOverrides();
      if (Object.keys(this.urlOverrides).length > 0) {
        console.log('FlagStateManager: Loaded URL overrides for flags:', Object.keys(this.urlOverrides));
      }
    } catch (error) {
      console.error('FlagStateManager: Error loading URL overrides:', error);
    }
  }

  async getEnhancedFlags(): Promise<Record<string, EnhancedFlag>> {
    const devServerData = await this.devServerClient.getProjectData();

    const enhancedFlags: Record<string, EnhancedFlag> = {};

    // First, create a map of API flags for quick lookup
    const apiFlagsMap = new Map<string, ApiFlag>();
    this.apiFlags.forEach((apiFlag) => {
      apiFlagsMap.set(apiFlag.key, apiFlag);
    });

    // Process all flags from the dev server
    Object.entries(devServerData.flagsState).forEach(([flagKey, flagState]) => {
      const apiFlag = apiFlagsMap.get(flagKey);
      const devServerOverride = devServerData.overrides[flagKey];
      const urlOverride = this.urlOverrides[flagKey];
      const variations = devServerData.availableVariations[flagKey] || [];

      // Priority: URL override > dev server override > original value
      let currentValue = flagState.value;
      let isOverridden = false;

      if (urlOverride !== undefined) {
        currentValue = urlOverride;
        isOverridden = true;
      } else if (devServerOverride) {
        currentValue = devServerOverride.value;
        isOverridden = true;
      }

      enhancedFlags[flagKey] = {
        key: flagKey,
        // Use API flag name if available, otherwise format the key
        name: apiFlag?.name || this.formatFlagName(flagKey),
        currentValue,
        isOverridden,
        originalValue: flagState.value,
        availableVariations: variations,
        type: this.determineFlagType(variations, currentValue),
        sourceEnvironment: devServerData.sourceEnvironmentKey,
        enabled: flagState.value !== null && flagState.value !== undefined,
      };
    });

    return enhancedFlags;
  }

  private formatFlagName(flagKey: string): string {
    // Convert kebab-case to Title Case
    return flagKey
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private determineFlagType(
    variations: ApiVariation[],
    currentValue: any,
  ): 'boolean' | 'multivariate' | 'string' | 'number' | 'object' {
    // If we have exactly 2 variations and they're both boolean, it's a boolean flag
    if (variations.length === 2 && variations.every((v) => typeof v.value === 'boolean')) {
      return 'boolean';
    }

    if (variations.length >= 2 && !variations.some((v) => typeof v.value === 'object')) {
      return 'multivariate';
    }

    if (typeof currentValue === 'string') return 'string';
    if (typeof currentValue === 'number') return 'number';
    if (typeof currentValue === 'object') return 'object';
    return 'boolean';
  }

  async setOverride(flagKey: string, value: any): Promise<void> {
    await this.devServerClient.setOverride(flagKey, value);
    // Notify listeners of the change
    await this.notifyListeners();
  }

  async clearOverride(flagKey: string): Promise<void> {
    await this.devServerClient.clearOverride(flagKey);
    // Notify listeners of the change
    await this.notifyListeners();
  }

  setApiFlags(apiFlags: ApiFlag[]): void {
    this.apiFlags = apiFlags;
  }

  /**
   * Returns only the URL-based overrides
   * @returns Record of flag keys to their URL override values
   */
  getUrlOverrides(): Record<string, any> {
    return { ...this.urlOverrides };
  }

  /**
   * Checks if a specific flag override came from the URL
   * @param flagKey - The key of the flag to check
   * @returns True if the override came from the URL
   */
  isUrlOverride(flagKey: string): boolean {
    return flagKey in this.urlOverrides;
  }

  subscribe(listener: (flags: Record<string, EnhancedFlag>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async notifyListeners(): Promise<void> {
    try {
      const flags = await this.getEnhancedFlags();
      this.listeners.forEach((listener) => listener(flags));
    } catch (error) {
      console.error('Error notifying listeners:', error);
    }
  }

  destroy(): void {
    this.listeners.clear();
  }
}
