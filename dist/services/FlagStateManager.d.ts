import { DevServerClient } from './DevServerClient';
import { EnhancedFlag } from '../types/devServer';
export declare class FlagStateManager {
    private devServerClient;
    private listeners;
    constructor(devServerClient: DevServerClient);
    getEnhancedFlags(): Promise<Record<string, EnhancedFlag>>;
    private formatFlagName;
    private determineFlagType;
    setOverride(flagKey: string, value: any): Promise<void>;
    clearOverride(flagKey: string): Promise<void>;
    subscribe(listener: (flags: Record<string, EnhancedFlag>) => void): () => void;
    private notifyListeners;
    destroy(): void;
}
