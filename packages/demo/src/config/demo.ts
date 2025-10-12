/**
 * Demo configuration for LaunchDarkly integration
 */
export interface DemoConfig {
  /** Use mocks instead of real LaunchDarkly */
  useMocks: boolean;
  /** Enable debug logging */
  enableLogging: boolean;
}

// Check if running in an automated test environment i.e. Playwright
const isAutomatedTest = () => {
  if (typeof window === 'undefined') return false;
  // Check for webdriver (used by Playwright)
  if (navigator.webdriver === true) return true;
  return false;
};

export const DEMO_CONFIG: DemoConfig = {
  // Use mocks if explicitly enabled via env var, but never during automated tests
  // Automated tests (like Playwright) provide their own network mocking
  useMocks: import.meta.env.VITE_USE_MOCK_FLAGS === 'true' && !isAutomatedTest(),

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
