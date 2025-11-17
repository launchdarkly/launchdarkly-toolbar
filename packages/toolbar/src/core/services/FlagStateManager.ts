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

  async getEnhancedFlags(apiFlags: ApiFlag[]): Promise<Record<string, EnhancedFlag>> {
    this.apiFlags = apiFlags;
    const devServerData = await this.devServerClient.getProjectData();

    const enhancedFlags: Record<string, EnhancedFlag> = {};
    apiFlags.forEach((apiFlag) => {
      const flagState = devServerData.flagsState[apiFlag.key];
      if (!flagState) return;

      const override = devServerData.overrides[apiFlag.key];
      const variations = devServerData.availableVariations[apiFlag.key] || [];

      // Current value is override if exists, otherwise original value
      const currentValue = override ? override.value : flagState.value;

      enhancedFlags[apiFlag.key] = {
        key: apiFlag.key,
        name: this.formatFlagName(apiFlag.key),
        currentValue,
        isOverridden: false,
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

  subscribe(listener: (flags: Record<string, EnhancedFlag>) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private async notifyListeners(): Promise<void> {
    try {
      const flags = await this.getEnhancedFlags(this.apiFlags);
      this.listeners.forEach((listener) => listener(flags));
    } catch (error) {
      console.error('Error notifying listeners:', error);
    }
  }

  destroy(): void {
    this.listeners.clear();
  }
}
