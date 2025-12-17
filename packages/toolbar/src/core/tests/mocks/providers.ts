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
 *   return createDynamicAnalyticsPreferencesProviderMock({ getIsOptedInToAnalytics: getMockValue });
 * });
 */

// Shared return type for analytics preferences mocks
interface AnalyticsPreferencesMock {
  useAnalyticsPreferences: () => {
    isOptedInToAnalytics: boolean;
    isOptedInToEnhancedAnalytics: boolean;
    isOptedInToSessionReplay: boolean;
    handleToggleAnalyticsOptOut: ReturnType<typeof vi.fn>;
    handleToggleEnhancedAnalyticsOptOut: ReturnType<typeof vi.fn>;
    handleToggleSessionReplayOptOut: ReturnType<typeof vi.fn>;
  };
  AnalyticsPreferencesProvider: ({ children }: { children: React.ReactNode }) => React.ReactNode;
}

/**
 * Creates a mock for AnalyticsPreferencesProvider.
 * Used by vitest.setup.ts for global mocking.
 */
export function createAnalyticsPreferencesProviderMock(overrides?: {
  isOptedInToAnalytics?: boolean;
  isOptedInToEnhancedAnalytics?: boolean;
  isOptedInToSessionReplay?: boolean;
}): AnalyticsPreferencesMock {
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
 * // For dynamic isOptedInToAnalytics:
 * let mockIsOptedIn = false;
 * vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', async () => {
 *   const { createDynamicAnalyticsPreferencesProviderMock } = await import('./mocks/providers');
 *   return createDynamicAnalyticsPreferencesProviderMock({ getIsOptedInToAnalytics: () => mockIsOptedIn });
 * });
 *
 * // For dynamic isOptedInToEnhancedAnalytics:
 * vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', async () => {
 *   const { createDynamicAnalyticsPreferencesProviderMock } = await import('./mocks/providers');
 *   return createDynamicAnalyticsPreferencesProviderMock({ getIsOptedInToEnhancedAnalytics: () => mockValue });
 * });
 *
 * // In tests:
 * mockIsOptedIn = true;  // Changes mock behavior
 */
export function createDynamicAnalyticsPreferencesProviderMock(options: {
  getIsOptedInToAnalytics?: () => boolean;
  getIsOptedInToEnhancedAnalytics?: () => boolean;
  getIsOptedInToSessionReplay?: () => boolean;
}): AnalyticsPreferencesMock {
  return {
    useAnalyticsPreferences: () => ({
      isOptedInToAnalytics: options.getIsOptedInToAnalytics?.() ?? false,
      isOptedInToEnhancedAnalytics: options.getIsOptedInToEnhancedAnalytics?.() ?? false,
      isOptedInToSessionReplay: options.getIsOptedInToSessionReplay?.() ?? false,
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
export function createInternalClientProviderMock(mockClient?: Record<string, unknown>): {
  useInternalClient: () => {
    client: Record<string, unknown> | null;
    loading: boolean;
    error: null;
    updateContext: ReturnType<typeof vi.fn>;
  };
  InternalClientProvider: ({ children }: { children: React.ReactNode }) => React.ReactNode;
} {
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
}): {
  useDevServerContext: () => {
    state: {
      sourceEnvironmentKey: string;
      connectionStatus: string;
      flags: Record<string, unknown>;
      lastSyncTime: number;
      isLoading: boolean;
      error: Error | null;
    };
    setOverride: ReturnType<typeof vi.fn>;
    clearOverride: ReturnType<typeof vi.fn>;
    clearAllOverrides: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
  };
  DevServerProvider: ({ children }: { children: React.ReactNode }) => React.ReactNode;
} {
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
