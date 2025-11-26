import { ApiVariation } from '../ui/Toolbar/types/ldApi';

// Enhanced Flag Interface for UI
export interface EnhancedFlag {
  key: string;
  name: string;
  currentValue: any; // Override value if exists, otherwise original value
  isOverridden: boolean; // Exists in overrides object
  originalValue: any; // Value from dev server flagsState
  availableVariations: ApiVariation[]; // For UI selection
  type: 'boolean' | 'multivariate' | 'string' | 'number' | 'object';
  sourceEnvironment: string; // e.g., "production", "test"
  enabled: boolean; // Whether flag is active
}

// Configuration Interface
export interface LdToolbarConfig {
  // Dev server configuration
  devServerUrl?: string; // Optional - defaults to SDK mode if not provided
  pollIntervalInMs: number; // Auto-refresh interval in ms. Defaults to 5000ms
  projectKey?: string; // Optional - will auto-detect first available project if not provided
  showEnvironmentInfo?: boolean;

  // Events
  onDebugOverride?: (flagKey: string, value: any, isOverride: boolean) => void;
  onError?: (error: string) => void;
}

// State Management
export interface ToolbarState {
  flags: Record<string, EnhancedFlag>;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastSyncTime: number;
  isLoading: boolean;
  error: string | null;
  sourceEnvironmentKey: string | null;
}
