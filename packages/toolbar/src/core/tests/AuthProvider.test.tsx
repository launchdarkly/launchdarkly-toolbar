import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Control enhanced analytics opt-in state for tests
const { getMockIsOptedInToEnhancedAnalytics, setMockIsOptedInToEnhancedAnalytics } = vi.hoisted(() => {
  let value = false;
  return {
    getMockIsOptedInToEnhancedAnalytics: () => value,
    setMockIsOptedInToEnhancedAnalytics: (v: boolean) => {
      value = v;
    },
  };
});

// Mock the IFrameProvider
vi.mock('../ui/Toolbar/context/api/IFrameProvider', () => ({
  IFRAME_COMMANDS: {
    LOGOUT: 'LOGOUT',
  },
  IFRAME_EVENTS: {
    AUTHENTICATED: 'AUTHENTICATED',
    AUTH_REQUIRED: 'AUTH_REQUIRED',
    AUTH_ERROR: 'AUTH_ERROR',
  },
  getResponseTopic: vi.fn().mockImplementation((command) => `${command}-response`),
  getErrorTopic: vi.fn().mockImplementation((command) => `${command}-error`),
  useIFrameContext: vi.fn(),
}));

// Mock the AnalyticsProvider
const mockTrackLoginSuccess = vi.fn();
const mockTrackAuthError = vi.fn();

vi.mock('../ui/Toolbar/context/telemetry/AnalyticsProvider', () => ({
  useAnalytics: () => ({
    trackLoginSuccess: mockTrackLoginSuccess,
    trackLoginCancelled: vi.fn(),
    trackAuthError: mockTrackAuthError,
  }),
}));

// Mock the InternalClientProvider
const mockUpdateContext = vi.fn();

vi.mock('../ui/Toolbar/context/telemetry/InternalClientProvider', () => ({
  useInternalClient: () => ({
    client: null,
    loading: false,
    error: null,
    updateContext: mockUpdateContext,
  }),
}));

// Override the global AnalyticsPreferencesProvider mock with dynamic control
vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', async () => {
  const { createDynamicAnalyticsPreferencesProviderMock } = await import('./mocks/providers');
  return createDynamicAnalyticsPreferencesProviderMock({
    getIsOptedInToEnhancedAnalytics: getMockIsOptedInToEnhancedAnalytics,
  });
});

import { AuthProvider, useAuthContext } from '../ui/Toolbar/context/api/AuthProvider';
import {
  useIFrameContext,
  IFRAME_EVENTS,
  getResponseTopic,
  IFRAME_COMMANDS,
} from '../ui/Toolbar/context/api/IFrameProvider';

// Test consumer component
function TestConsumer() {
  const { authenticated, loading, logout } = useAuthContext();

  return (
    <div>
      <div data-testid="authenticated">{authenticated ? 'true' : 'false'}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <button data-testid="logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('AuthProvider', () => {
  const mockIframeRef = {
    current: {
      contentWindow: {
        postMessage: vi.fn(),
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    setMockIsOptedInToEnhancedAnalytics(false);

    (useIFrameContext as any).mockReturnValue({
      ref: mockIframeRef,
      iframeSrc: 'https://integrations.launchdarkly.com',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication Flow', () => {
    test('sets authenticated to true when AUTHENTICATED event is received', async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: IFRAME_EVENTS.AUTHENTICATED,
              accountId: 'account-123',
              memberId: 'member-456',
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    test('sets authenticated to false when AUTH_REQUIRED event is received', async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: IFRAME_EVENTS.AUTH_REQUIRED },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    test('ignores messages from unauthorized origins', async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: IFRAME_EVENTS.AUTHENTICATED,
              accountId: 'account-123',
              memberId: 'member-456',
            },
            origin: 'https://evil.com',
          }),
        );
      });

      // Should remain in initial state
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('loading')).toHaveTextContent('true');
    });
  });

  describe('Enhanced Analytics - Context Update', () => {
    test('calls updateContext when isOptedInToEnhancedAnalytics is true', async () => {
      setMockIsOptedInToEnhancedAnalytics(true);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: IFRAME_EVENTS.AUTHENTICATED,
              accountId: 'account-123',
              memberId: 'member-456',
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      await waitFor(() => {
        expect(mockUpdateContext).toHaveBeenCalledWith('account-123', 'member-456');
      });

      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    test('does NOT call updateContext when isOptedInToEnhancedAnalytics is false', async () => {
      setMockIsOptedInToEnhancedAnalytics(false);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: IFRAME_EVENTS.AUTHENTICATED,
              accountId: 'account-123',
              memberId: 'member-456',
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      // updateContext should NOT have been called
      expect(mockUpdateContext).not.toHaveBeenCalled();
    });

    test('does NOT call updateContext when accountId is missing', async () => {
      setMockIsOptedInToEnhancedAnalytics(true);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: IFRAME_EVENTS.AUTHENTICATED,
              memberId: 'member-456',
              // accountId is missing
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // Wait a bit to ensure no async calls happen
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockUpdateContext).not.toHaveBeenCalled();
    });

    test('does NOT call updateContext when memberId is missing', async () => {
      setMockIsOptedInToEnhancedAnalytics(true);

      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: IFRAME_EVENTS.AUTHENTICATED,
              accountId: 'account-123',
              // memberId is missing
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      // Wait a bit to ensure no async calls happen
      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(mockUpdateContext).not.toHaveBeenCalled();
    });
  });

  describe('Analytics Tracking', () => {
    test('tracks login success on authentication', async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: IFRAME_EVENTS.AUTHENTICATED,
              accountId: 'account-123',
              memberId: 'member-456',
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      await waitFor(() => {
        expect(mockTrackLoginSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Logout', () => {
    test('sends logout message to iframe when logout is called', async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      const logoutButton = screen.getByTestId('logout');
      logoutButton.click();

      expect(mockIframeRef.current.contentWindow.postMessage).toHaveBeenCalledWith(
        { type: IFRAME_COMMANDS.LOGOUT },
        'https://integrations.launchdarkly.com',
      );
    });

    test('sets authenticated to false when logout response is received', async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>,
      );

      // First authenticate
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: {
              type: IFRAME_EVENTS.AUTHENTICATED,
              accountId: 'account-123',
              memberId: 'member-456',
            },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      });

      // Then logout
      act(() => {
        window.dispatchEvent(
          new MessageEvent('message', {
            data: { type: getResponseTopic(IFRAME_COMMANDS.LOGOUT) },
            origin: 'https://integrations.launchdarkly.com',
          }),
        );
      });

      await waitFor(() => {
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      });
    });
  });

  describe('useAuthContext Hook', () => {
    test('throws error when used outside provider', () => {
      const BadComponent = () => {
        useAuthContext();
        return <div>Bad</div>;
      };

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<BadComponent />);
      }).toThrow('useAuthContext must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
