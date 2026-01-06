import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Create mock LDClient
const mockLDClient = {
  waitForInitialization: vi.fn(),
  variation: vi.fn(),
  identify: vi.fn(),
  close: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  track: vi.fn(),
};

// Control analytics opt-in state for tests - defined in hoisted block for mock access
const { getMockIsOptedInToAnalytics, setMockIsOptedInToAnalytics } = vi.hoisted(() => {
  let value = false;
  return {
    getMockIsOptedInToAnalytics: () => value,
    setMockIsOptedInToAnalytics: (v: boolean) => {
      value = v;
    },
  };
});

// Mock the InternalClientProvider
vi.mock('../ui/Toolbar/context/telemetry/InternalClientProvider', () => ({
  useInternalClient: () => ({
    client: mockLDClient,
    loading: false,
    error: null,
    updateContext: vi.fn(),
  }),
  InternalClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the AnalyticsPreferencesProvider using shared dynamic factory
vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', async () => {
  const { createDynamicAnalyticsPreferencesProviderMock } = await import('./mocks/providers');
  return createDynamicAnalyticsPreferencesProviderMock({ getIsOptedInToAnalytics: getMockIsOptedInToAnalytics });
});

// Mock browser utilities to ensure isDoNotTrackEnabled returns false
vi.mock('../utils/browser', () => ({
  isDoNotTrackEnabled: () => false,
}));

import { AnalyticsProvider, useAnalytics } from '../ui/Toolbar/context/telemetry/AnalyticsProvider';

// Test consumer component that triggers analytics events
function TestConsumer() {
  const analytics = useAnalytics();

  return (
    <div>
      <button data-testid="track-init" onClick={() => analytics.trackInitialization()}>
        Track Init
      </button>
      <button data-testid="track-tab-change" onClick={() => analytics.trackTabChange('flags', 'events')}>
        Track Tab Change
      </button>
      <button data-testid="track-logout" onClick={() => analytics.trackLogout()}>
        Track Logout
      </button>
      <button
        data-testid="track-position"
        onClick={() => analytics.trackPositionChange('bottom-left', 'top-right', 'settings')}
      >
        Track Position Change
      </button>
      <button data-testid="track-flag-override" onClick={() => analytics.trackFlagOverride('my-flag', true, 'set')}>
        Track Flag Override
      </button>
    </div>
  );
}

describe('AnalyticsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setMockIsOptedInToAnalytics(false);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Analytics Opt-In State', () => {
    describe('when isOptedInToAnalytics is false', () => {
      beforeEach(() => {
        setMockIsOptedInToAnalytics(false);
      });

      test('should NOT send trackInitialization event', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-init').click();

        expect(mockLDClient.track).not.toHaveBeenCalled();
      });

      test('should NOT send trackTabChange event', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-tab-change').click();

        expect(mockLDClient.track).not.toHaveBeenCalled();
      });

      test('should NOT send trackLogout event', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-logout').click();

        expect(mockLDClient.track).not.toHaveBeenCalled();
      });

      test('should NOT send trackPositionChange event', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-position').click();

        expect(mockLDClient.track).not.toHaveBeenCalled();
      });

      test('should NOT send trackFlagOverride event', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-flag-override').click();

        expect(mockLDClient.track).not.toHaveBeenCalled();
      });
    });

    describe('when isOptedInToAnalytics is true', () => {
      beforeEach(() => {
        setMockIsOptedInToAnalytics(true);
      });

      test('should send trackInitialization event', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-init').click();

        expect(mockLDClient.track).toHaveBeenCalledWith('ld.toolbar.initialized', expect.any(Object));
      });

      test('should send trackTabChange event with correct properties', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        // Clear any initialization tracking calls
        mockLDClient.track.mockClear();

        screen.getByTestId('track-tab-change').click();

        expect(mockLDClient.track).toHaveBeenCalledWith('ld.toolbar.tab.changed', {
          fromTab: 'flags',
          toTab: 'events',
          mode: null,
        });
      });

      test('should send trackLogout event', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-logout').click();

        expect(mockLDClient.track).toHaveBeenCalledWith('ld.toolbar.logout', expect.any(Object));
      });

      test('should send trackPositionChange event with correct properties', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        // Clear any initialization tracking calls
        mockLDClient.track.mockClear();

        screen.getByTestId('track-position').click();

        expect(mockLDClient.track).toHaveBeenCalledWith('ld.toolbar.position.changed', {
          oldPosition: 'bottom-left',
          newPosition: 'top-right',
          source: 'settings',
          mode: null,
        });
      });

      test('should send trackFlagOverride event with correct properties', () => {
        render(
          <AnalyticsProvider>
            <TestConsumer />
          </AnalyticsProvider>,
        );

        // Clear any initialization tracking calls
        mockLDClient.track.mockClear();

        screen.getByTestId('track-flag-override').click();

        expect(mockLDClient.track).toHaveBeenCalledWith('ld.toolbar.toggle.flag', {
          flagKey: 'my-flag',
          value: true,
          action: 'set',
          mode: null,
        });
      });
    });

    describe('mode property', () => {
      beforeEach(() => {
        setMockIsOptedInToAnalytics(true);
      });

      test('should include mode in analytics events when provided', () => {
        render(
          <AnalyticsProvider mode="dev-server">
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-init').click();

        expect(mockLDClient.track).toHaveBeenCalledWith('ld.toolbar.initialized', {
          mode: 'dev-server',
        });
      });

      test('should include sdk mode in analytics events', () => {
        render(
          <AnalyticsProvider mode="sdk">
            <TestConsumer />
          </AnalyticsProvider>,
        );

        screen.getByTestId('track-logout').click();

        expect(mockLDClient.track).toHaveBeenCalledWith('ld.toolbar.logout', {
          mode: 'sdk',
        });
      });
    });
  });

  describe('useAnalytics Hook', () => {
    test('throws error when used outside provider', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useAnalytics must be used within an AnalyticsProvider');

      consoleError.mockRestore();
    });
  });

  describe('Initialization Tracking', () => {
    beforeEach(() => {
      setMockIsOptedInToAnalytics(true);
    });

    test('should track initialization when client becomes ready', async () => {
      render(
        <AnalyticsProvider>
          <TestConsumer />
        </AnalyticsProvider>,
      );

      // The initialization tracking happens in useEffect when client is ready
      await waitFor(() => {
        expect(mockLDClient.track).toHaveBeenCalledWith('ld.toolbar.initialized', expect.any(Object));
      });
    });

    test('should NOT track initialization when opted out', async () => {
      setMockIsOptedInToAnalytics(false);

      render(
        <AnalyticsProvider>
          <TestConsumer />
        </AnalyticsProvider>,
      );

      // Give time for any potential initialization tracking
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockLDClient.track).not.toHaveBeenCalled();
    });
  });
});
