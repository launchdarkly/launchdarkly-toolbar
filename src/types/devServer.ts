import { Variation } from '../services/DevServerClient';

// Re-export Variation for convenience
export type { Variation } from '../services/DevServerClient';

// Enhanced Flag Interface for UI
export interface EnhancedFlag {
  key: string;
  name: string;
  currentValue: any; // Override value if exists, otherwise original value
  isOverridden: boolean; // Exists in overrides object
  originalValue: any; // Value from dev server flagsState
  availableVariations: Variation[]; // For UI selection
  type: 'boolean' | 'multivariate' | 'string' | 'number';
  sourceEnvironment: string; // e.g., "production", "test"
  enabled: boolean; // Whether flag is active
}

// Configuration Interface
export interface LdToolbarConfig {
  // Dev server configuration
  devServerUrl?: string; // defaults to http://localhost:8765
  projectKey?: string; // Optional - will auto-detect first available project if not provided

  // Optional
  pollIntervalInMs?: number; // Auto-refresh interval in ms
  showEnvironmentInfo?: boolean;

  // Events
  onFlagOverride?: (flagKey: string, value: any, isOverride: boolean) => void;
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
