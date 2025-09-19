/**
 * Demo configuration for LaunchDarkly integration
 */
export interface DemoConfig {
  /** Use mocks instead of real LaunchDarkly */
  useMocks: boolean;
  /** Enable debug logging */
  enableLogging: boolean;
}

export const DEMO_CONFIG: DemoConfig = {
  // Use mocks if explicitly enabled via env var
  useMocks: import.meta.env.VITE_USE_MOCK_FLAGS === 'true',

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
