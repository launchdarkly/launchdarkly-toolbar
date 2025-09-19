/**
 * Demo configuration for LaunchDarkly integration
 */
export interface DemoConfig {
  /** Force use of mocks instead of real LaunchDarkly */
  useMocks: boolean;
  /** Enable fallback to mocks if real LaunchDarkly fails */
  fallbackToMocks: boolean;
  /** Timeout in ms for LaunchDarkly initialization before fallback */
  initTimeout: number;
  /** Enable debug logging */
  enableLogging: boolean;
}

export const DEMO_CONFIG: DemoConfig = {
  // Use mocks if explicitly enabled via env var
  useMocks: import.meta.env.VITE_USE_MOCK_FLAGS === 'true',

  // Always enable fallback to mocks for reliability
  fallbackToMocks: true,

  // 10 second timeout for LD initialization
  initTimeout: 10000,

  // Enable logging in development
  enableLogging: import.meta.env.DEV,
};

/**
 * Utility to log demo messages
 */
export const demoLog = (message: string, ...args: unknown[]) => {
  if (DEMO_CONFIG.enableLogging) {
    console.log(`🚀 [Demo]: ${message}`, ...args);
  }
};
