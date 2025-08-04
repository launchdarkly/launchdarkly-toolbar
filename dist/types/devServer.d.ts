import { Variation } from '../services/DevServerClient';
export type { Variation } from '../services/DevServerClient';
export interface EnhancedFlag {
    key: string;
    name: string;
    currentValue: any;
    isOverridden: boolean;
    originalValue: any;
    availableVariations: Variation[];
    type: 'boolean' | 'multivariate' | 'string' | 'number';
    sourceEnvironment: string;
    enabled: boolean;
}
export interface LdToolbarConfig {
    devServerUrl?: string;
    projectKey?: string;
    pollIntervalInMs?: number;
    showEnvironmentInfo?: boolean;
    onFlagOverride?: (flagKey: string, value: any, isOverride: boolean) => void;
    onError?: (error: string) => void;
}
export interface ToolbarState {
    flags: Record<string, EnhancedFlag>;
    connectionStatus: 'connected' | 'disconnected' | 'error';
    lastSyncTime: number;
    isLoading: boolean;
    error: string | null;
    sourceEnvironmentKey: string | null;
}
