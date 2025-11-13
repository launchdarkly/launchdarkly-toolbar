import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';

// Create mocks in hoisted scope
const mockLDClient = {
  waitForInitialization: vi.fn(),
  variation: vi.fn(),
  identify: vi.fn(),
  close: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
  track: vi.fn(),
};

const mockInitialize = vi.fn();

// Mock the SDK module
vi.mock('launchdarkly-js-client-sdk', () => ({
  initialize: mockInitialize,
}));

import {
  InternalClientProvider,
  useInternalClient,
  useInternalClientInstance,
} from '../ui/Toolbar/context/InternalClientProvider';
import { setToolbarFlagClient } from '../../flags/createToolbarFlagFunction';
import * as toolbarFlagClient from '../../flags/createToolbarFlagFunction';

// Spy on setToolbarFlagClient
const setToolbarFlagClientSpy = vi.spyOn(toolbarFlagClient, 'setToolbarFlagClient');

// Test component that consumes the context
function TestConsumer() {
  const { client, loading, error } = useInternalClient();

  return (
    <div>
      <div data-testid="client-status">{client ? 'initialized' : 'null'}</div>
      <div data-testid="loading-status">{loading.toString()}</div>
      <div data-testid="error-status">{error ? error.message : 'none'}</div>
    </div>
  );
}

// Test component for useInternalClientInstance hook
function TestClientInstanceConsumer() {
  const client = useInternalClientInstance();

  return (
    <div>
      <div data-testid="client-instance">{client ? 'initialized' : 'null'}</div>
    </div>
  );
}

describe('InternalClientProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset all mock functions to default behavior
    mockLDClient.waitForInitialization.mockResolvedValue(undefined);
    mockLDClient.identify.mockResolvedValue(undefined);
    mockLDClient.variation.mockReturnValue(true);
    mockLDClient.close.mockImplementation(() => {});
    mockLDClient.on.mockImplementation(() => {});
    mockLDClient.off.mockImplementation(() => {});
    mockLDClient.track.mockImplementation(() => {});

    mockInitialize.mockReturnValue(mockLDClient);

    // Clear the internal client singleton
    setToolbarFlagClient(null);

    // Clear the spy AFTER the cleanup call so it doesn't count
    setToolbarFlagClientSpy.mockClear();
  });

  afterEach(() => {
    // Additional cleanup to ensure no hanging promises or state
    vi.clearAllTimers();
    vi.unstubAllGlobals();
  });

  describe('Initialization', () => {
    test('initializes client successfully with valid clientSideID', async () => {
      render(
        <InternalClientProvider clientSideID="test-client-id-123">
          <TestConsumer />
        </InternalClientProvider>,
      );

      // Initially loading
      expect(screen.getByTestId('loading-status')).toHaveTextContent('true');
      expect(screen.getByTestId('client-status')).toHaveTextContent('null');

      // Wait for initialization
      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('client-status')).toHaveTextContent('initialized');
      expect(screen.getByTestId('error-status')).toHaveTextContent('none');
    });

    test('calls setToolbarFlagClient on successful initialization', async () => {
      render(
        <InternalClientProvider clientSideID="test-client-id-123">
          <TestConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(setToolbarFlagClientSpy).toHaveBeenCalledWith(mockLDClient);
      });
    });

    test('initializes with default anonymous context when no initialContext provided', async () => {
      render(
        <InternalClientProvider clientSideID="test-client-id-123">
          <TestConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledWith(
          'test-client-id-123',
          {
            kind: 'user',
            key: 'toolbar-anonymous',
            anonymous: true,
          },
          undefined,
        );
      });
    });

    test('uses custom initialContext when provided', async () => {
      const customContext = {
        kind: 'user' as const,
        key: 'custom-user-key',
        email: 'custom@example.com',
      };

      render(
        <InternalClientProvider clientSideID="test-client-id-123" initialContext={customContext}>
          <TestConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledWith('test-client-id-123', customContext, undefined);
      });
    });

    test('handles initialization errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const initError = new Error('Failed to connect to LaunchDarkly');
      mockLDClient.waitForInitialization.mockRejectedValueOnce(initError);

      render(
        <InternalClientProvider clientSideID="invalid-client-id">
          <TestConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('client-status')).toHaveTextContent('null');
      expect(screen.getByTestId('error-status')).toHaveTextContent('Failed to connect to LaunchDarkly');

      consoleError.mockRestore();
    });

    test('does not call setToolbarFlagClient on initialization failure', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockLDClient.waitForInitialization.mockRejectedValueOnce(new Error('Init failed'));

      render(
        <InternalClientProvider clientSideID="invalid-client-id">
          <TestConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('error-status')).toHaveTextContent('Init failed');
      });

      expect(setToolbarFlagClientSpy).not.toHaveBeenCalled();

      consoleError.mockRestore();
    });
  });

  describe('Custom Base URL Configuration', () => {
    test('configures SDK with custom baseUrl when provided', async () => {
      render(
        <InternalClientProvider clientSideID="test-client-id-123" baseUrl="https://app.ld.catamorphic.com">
          <TestConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledWith('test-client-id-123', expect.any(Object), {
          baseUrl: 'https://app.ld.catamorphic.com',
          streamUrl: 'https://clientstream.ld.catamorphic.com',
          eventsUrl: 'https://events.ld.catamorphic.com',
        });
      });
    });

    test('does not provide options when baseUrl is not specified', async () => {
      render(
        <InternalClientProvider clientSideID="test-client-id-123">
          <TestConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalledWith('test-client-id-123', expect.any(Object), undefined);
      });
    });
  });

  describe('Cleanup', () => {
    test('clears singleton and closes client on unmount', async () => {
      const { unmount } = render(
        <InternalClientProvider clientSideID="test-client-id-123">
          <TestConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('client-status')).toHaveTextContent('initialized');
      });

      unmount();

      expect(setToolbarFlagClientSpy).toHaveBeenCalledWith(null);
      expect(mockLDClient.close).toHaveBeenCalled();
    });
  });

  describe('useInternalClient Hook', () => {
    test('returns client, loading, and error state', async () => {
      render(
        <InternalClientProvider clientSideID="test-client-id-123">
          <TestConsumer />
        </InternalClientProvider>,
      );

      expect(screen.getByTestId('loading-status')).toHaveTextContent('true');

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('false');
      });

      expect(screen.getByTestId('client-status')).toHaveTextContent('initialized');
      expect(screen.getByTestId('error-status')).toHaveTextContent('none');
    });

    test('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useInternalClient must be used within InternalClientProvider');

      consoleError.mockRestore();
    });
  });

  describe('useInternalClientInstance Hook', () => {
    test('returns client instance when initialized', async () => {
      render(
        <InternalClientProvider clientSideID="test-client-id-123">
          <TestClientInstanceConsumer />
        </InternalClientProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('client-instance')).toHaveTextContent('initialized');
      });
    });

    test('returns null before initialization', () => {
      render(
        <InternalClientProvider clientSideID="test-client-id-123">
          <TestClientInstanceConsumer />
        </InternalClientProvider>,
      );

      expect(screen.getByTestId('client-instance')).toHaveTextContent('null');
    });
  });
});
