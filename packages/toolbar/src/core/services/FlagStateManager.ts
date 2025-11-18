import { DevServerClient, Variation } from './DevServerClient';
import { EnhancedFlag } from '../types/devServer';
import { ApiFlag } from '../ui/Toolbar/types/ldApi';

export class FlagStateManager {
  private devServerClient: DevServerClient;
  private listeners: Set<(flags: Record<string, EnhancedFlag>) => void> = new Set();
  private apiFlags: ApiFlag[] = [];

  constructor(devServerClient: DevServerClient) {
    this.devServerClient = devServerClient;
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
      const override = devServerData.overrides[flagKey];
      const variations = devServerData.availableVariations[flagKey] || [];

      // Current value is override if exists, otherwise original value
      const currentValue = override ? override.value : flagState.value;

      enhancedFlags[flagKey] = {
        key: flagKey,
        // Use API flag name if available, otherwise format the key
        name: apiFlag?.name || this.formatFlagName(flagKey),
        currentValue,
        isOverridden: !!override,
        originalValue: flagState.value,
        availableVariations: variations,
        type: apiFlag?.kind || this.determineFlagType(variations, currentValue),
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
    variations: Variation[],
    currentValue: any,
  ): 'boolean' | 'multivariate' | 'string' | 'number' | 'object' {
    // If we have exactly 2 variations and they're both boolean, it's a boolean flag
    if (variations.length === 2 && variations.every((v) => typeof v.value === 'boolean')) {
      return 'boolean';
    }

    // If we have more than 2 variations, it's multivariate
    if (variations.length > 2) {
      return 'multivariate';
    }

    // Determine type based on current value
    if (typeof currentValue === 'string') {
      return 'string';
    }

    if (typeof currentValue === 'number') {
      return 'number';
    }

    if (typeof currentValue === 'object') {
      return 'object';
    }

    // Default to boolean for simple flags
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
