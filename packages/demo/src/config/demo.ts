/**
 * Demo configuration for LaunchDarkly integration
 */
export interface DemoConfig {
  /** Use mocks instead of real LaunchDarkly */
  useMocks: boolean;
  /** Enable debug logging */
  enableLogging: boolean;
}

/**
 * Detects if running in an automated test environment (e.g., Playwright).
 * This disables MSW so Playwright's network mocks can work.
 * See e2e/README.md for details.
 */
const isAutomatedTest = () => {
  if (typeof window === 'undefined') return false;
  if (navigator.webdriver === true) return true;
  return false;
};

export const DEMO_CONFIG: DemoConfig = {
  // Disable MSW during E2E tests to allow Playwright mocks to work
  useMocks: import.meta.env.VITE_USE_MOCK_FLAGS === 'true' && !isAutomatedTest(),
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
