import { vi } from 'vitest';

/**
 * Shared mock factory functions for provider contexts.
 *
 * GLOBAL MOCKS:
 * AnalyticsPreferencesProvider is mocked globally in vitest.setup.ts.
 * Most test files don't need to do anything - the mock is automatic.
 *
 * TESTING REAL IMPLEMENTATIONS:
 * If your test file tests the REAL implementation of a provider, add this at
 * the top of your test file:
 *
 * @example
 * vi.unmock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider');
 *
 * OVERRIDING WITH DYNAMIC VALUES:
 * If your test needs to change mock values during execution, override the
 * global mock with createDynamicAnalyticsPreferencesProviderMock:
 *
 * @example
 * const { getMockValue, setMockValue } = vi.hoisted(() => {
 *   let value = false;
 *   return { getMockValue: () => value, setMockValue: (v) => { value = v; } };
 * });
 *
 * vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', async () => {
 *   const { createDynamicAnalyticsPreferencesProviderMock } = await import('./mocks/providers');
 *   return createDynamicAnalyticsPreferencesProviderMock(getMockValue);
 * });
 */

/**
 * Creates a mock for AnalyticsPreferencesProvider.
 * Used by vitest.setup.ts for global mocking.
 */
export function createAnalyticsPreferencesProviderMock(overrides?: {
  isOptedInToAnalytics?: boolean;
  isOptedInToEnhancedAnalytics?: boolean;
  isOptedInToSessionReplay?: boolean;
}) {
  return {
    useAnalyticsPreferences: () => ({
      isOptedInToAnalytics: overrides?.isOptedInToAnalytics ?? false,
      isOptedInToEnhancedAnalytics: overrides?.isOptedInToEnhancedAnalytics ?? false,
      isOptedInToSessionReplay: overrides?.isOptedInToSessionReplay ?? false,
      handleToggleAnalyticsOptOut: vi.fn(),
      handleToggleEnhancedAnalyticsOptOut: vi.fn(),
      handleToggleSessionReplayOptOut: vi.fn(),
    }),
    AnalyticsPreferencesProvider: ({ children }: { children: React.ReactNode }) => children,
  };
}

/**
 * Creates a mock for AnalyticsPreferencesProvider with dynamic values.
 * Use this when you need to change mock values during test execution.
 *
 * @example
 * let mockIsOptedIn = false;
 * vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', async () => {
 *   const { createDynamicAnalyticsPreferencesProviderMock } = await import('./mocks/providers');
 *   return createDynamicAnalyticsPreferencesProviderMock(() => mockIsOptedIn);
 * });
 *
 * // In tests:
 * mockIsOptedIn = true;  // Changes mock behavior
 */
export function createDynamicAnalyticsPreferencesProviderMock(
  getIsOptedInToAnalytics: () => boolean,
  overrides?: {
    isOptedInToEnhancedAnalytics?: boolean;
    isOptedInToSessionReplay?: boolean;
  },
) {
  return {
    useAnalyticsPreferences: () => ({
      isOptedInToAnalytics: getIsOptedInToAnalytics(),
      isOptedInToEnhancedAnalytics: overrides?.isOptedInToEnhancedAnalytics ?? false,
      isOptedInToSessionReplay: overrides?.isOptedInToSessionReplay ?? false,
      handleToggleAnalyticsOptOut: vi.fn(),
      handleToggleEnhancedAnalyticsOptOut: vi.fn(),
      handleToggleSessionReplayOptOut: vi.fn(),
    }),
    AnalyticsPreferencesProvider: ({ children }: { children: React.ReactNode }) => children,
  };
}

/**
 * Creates a mock for InternalClientProvider with a customizable mock LDClient.
 *
 * @example
 * const mockLDClient = { track: vi.fn(), ... };
 * vi.mock('../../ui/Toolbar/context/telemetry/InternalClientProvider', () =>
 *   createInternalClientProviderMock(mockLDClient)
 * );
 */
export function createInternalClientProviderMock(mockClient?: Record<string, unknown>) {
  return {
    useInternalClient: () => ({
      client: mockClient ?? null,
      loading: false,
      error: null,
      updateContext: vi.fn(),
    }),
    InternalClientProvider: ({ children }: { children: React.ReactNode }) => children,
  };
}

/**
 * Creates a mock for DevServerProvider.
 *
 * @example
 * vi.mock('../../ui/Toolbar/context/DevServerProvider', () =>
 *   createDevServerProviderMock({ connectionStatus: 'connected' })
 * );
 */
export function createDevServerProviderMock(overrides?: {
  sourceEnvironmentKey?: string;
  connectionStatus?: string;
  flags?: Record<string, unknown>;
  isLoading?: boolean;
  error?: Error | null;
}) {
  return {
    useDevServerContext: () => ({
      state: {
        sourceEnvironmentKey: overrides?.sourceEnvironmentKey ?? 'production',
        connectionStatus: overrides?.connectionStatus ?? 'connected',
        flags: overrides?.flags ?? {},
        lastSyncTime: Date.now(),
        isLoading: overrides?.isLoading ?? false,
        error: overrides?.error ?? null,
      },
      setOverride: vi.fn(),
      clearOverride: vi.fn(),
      clearAllOverrides: vi.fn(),
      refresh: vi.fn(),
    }),
    DevServerProvider: ({ children }: { children: React.ReactNode }) => children,
  };
}
