import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';

import { LaunchDarklyToolbarProvider, useToolbarContext } from '../ui/Toolbar/context/LaunchDarklyToolbarProvider';

// Mock the DevServerClient and FlagStateManager
const mockDevServerClient = {
  getAvailableProjects: vi.fn().mockResolvedValue(['test-project']),
  setProjectKey: vi.fn(),
  getProjectKey: vi.fn().mockReturnValue('test-project'),
  getProjectData: vi.fn().mockResolvedValue({
    sourceEnvironmentKey: 'test-environment',
    flagsState: {},
    overrides: {},
    availableVariations: {},
    _lastSyncedFromSource: Date.now(),
  }),
  setOverride: vi.fn(),
  clearOverride: vi.fn(),
  healthCheck: vi.fn().mockResolvedValue(true),
};

const mockFlagStateManager = {
  getEnhancedFlags: vi.fn().mockResolvedValue({}),
  setOverride: vi.fn(),
  clearOverride: vi.fn(),
  subscribe: vi.fn().mockReturnValue(() => {}),
};

vi.mock('../services/DevServerClient', () => ({
  DevServerClient: vi.fn().mockImplementation(() => mockDevServerClient),
}));

vi.mock('../services/FlagStateManager', () => ({
  FlagStateManager: vi.fn().mockImplementation(() => mockFlagStateManager),
}));

// Test component that consumes the context
function TestConsumer() {
  const { state } = useToolbarContext();

  return (
    <div>
      <div data-testid="connection-status">{state.connectionStatus}</div>
      <div data-testid="position">{state.position}</div>
      <div data-testid="current-project">{state.currentProjectKey || 'none'}</div>
      <div data-testid="source-environment">{state.sourceEnvironmentKey || 'none'}</div>
      <div data-testid="is-loading">{state.isLoading.toString()}</div>
      <div data-testid="error">{state.error || 'none'}</div>
    </div>
  );
}

describe('LaunchDarklyToolbarProvider - Integration Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Developer Setup Flow - Dev Server Mode', () => {
    test('developer connects to dev server and gets project auto-detection', async () => {
      // GIVEN: Developer starts up the toolbar pointing to their dev server
      render(
        <LaunchDarklyToolbarProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 5000,
          }}
          initialPosition="right"
        >
          <TestConsumer />
        </LaunchDarklyToolbarProvider>,
      );

      // WHEN: The toolbar initializes
      // THEN: It starts in a loading state while connecting
      expect(screen.getByTestId('is-loading')).toHaveTextContent('true');
      expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');

      // AND: Eventually connects and auto-detects the first available project
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      await waitFor(() => {
        const isLoading = screen.getByTestId('is-loading');
        return isLoading.textContent === 'false';
      });

      // AND: Shows the developer they're connected to the auto-detected project
      expect(screen.getByTestId('current-project')).toHaveTextContent('test-project');
      expect(screen.getByTestId('error')).toHaveTextContent('none');
    });

    test('developer specifies exact project and connects successfully', async () => {
      // GIVEN: Developer knows exactly which project they want to work with
      mockDevServerClient.getAvailableProjects.mockResolvedValueOnce(['explicit-project', 'test-project']);

      // WHEN: They configure the toolbar with their specific project
      render(
        <LaunchDarklyToolbarProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            projectKey: 'explicit-project',
            pollIntervalInMs: 5000,
          }}
          initialPosition="right"
        >
          <TestConsumer />
        </LaunchDarklyToolbarProvider>,
      );

      // THEN: The toolbar connects using their specified project
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      expect(mockDevServerClient.setProjectKey).toHaveBeenCalledWith('explicit-project');
    });

    test('developer handles dev server connection issues gracefully', async () => {
      // GIVEN: Developer's dev server is not running or misconfigured
      mockDevServerClient.getAvailableProjects.mockRejectedValueOnce(new Error('Connection failed'));

      // WHEN: They try to connect with the toolbar
      render(
        <LaunchDarklyToolbarProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 5000,
          }}
          initialPosition="right"
        >
          <TestConsumer />
        </LaunchDarklyToolbarProvider>,
      );

      // THEN: The toolbar shows a clear error state instead of failing silently
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'error';
      });

      expect(screen.getByTestId('error')).toHaveTextContent('Connection failed');
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    });

    test('developer handles network timeout errors during initial connection', async () => {
      // GIVEN: Developer's network connection is slow or unreliable
      mockDevServerClient.getAvailableProjects.mockRejectedValueOnce(new Error('ETIMEDOUT: connect timeout'));

      // WHEN: They attempt to connect with the toolbar
      render(
        <LaunchDarklyToolbarProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 5000,
          }}
          initialPosition="right"
        >
          <TestConsumer />
        </LaunchDarklyToolbarProvider>,
      );

      // THEN: The error is handled gracefully with a user-friendly message
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'error';
      });

      expect(screen.getByTestId('error')).toHaveTextContent('ETIMEDOUT: connect timeout');
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
      expect(screen.getByTestId('current-project')).toHaveTextContent('none');
    });
  });

  describe('Developer Setup Flow - SDK Mode', () => {
    test('developer uses toolbar in client-side only mode', async () => {
      // GIVEN: Developer wants to use toolbar without a dev server (client-side only)
      render(
        <LaunchDarklyToolbarProvider
          config={{
            pollIntervalInMs: 5000,
          }}
          initialPosition="left"
        >
          <TestConsumer />
        </LaunchDarklyToolbarProvider>,
      );

      // WHEN: The toolbar initializes in SDK mode
      // THEN: It immediately shows disconnected state (not trying to connect to any server)
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        const isLoading = screen.getByTestId('is-loading');
        return connectionStatus.textContent === 'disconnected' && isLoading.textContent === 'false';
      });

      // AND: Shows appropriate state for client-side only usage
      expect(screen.getByTestId('current-project')).toHaveTextContent('none');
      expect(screen.getByTestId('source-environment')).toHaveTextContent('none');
      expect(screen.getByTestId('error')).toHaveTextContent('none');
      expect(screen.getByTestId('position')).toHaveTextContent('left');

      // AND: Doesn't attempt to make server connections
      expect(mockDevServerClient.getAvailableProjects).not.toHaveBeenCalled();
    });
  });

  describe('Developer Preference Management Flow', () => {
    test('developer sets and persists their preferred toolbar position', async () => {
      // GIVEN: Developer has previously set their preferred position
      localStorage.setItem('ld-toolbar-position', 'left');

      // WHEN: They load the toolbar again (even with different config)
      render(
        <LaunchDarklyToolbarProvider
          config={{ pollIntervalInMs: 5000 }}
          initialPosition="right" // This should be overridden by localStorage
        >
          <TestConsumer />
        </LaunchDarklyToolbarProvider>,
      );

      // THEN: Their preference is respected
      expect(screen.getByTestId('position')).toHaveTextContent('left');
    });

    test('developer gets sensible defaults when no preferences are set', () => {
      // GIVEN: Developer hasn't configured any preferences
      render(
        <LaunchDarklyToolbarProvider config={{ pollIntervalInMs: 5000 }}>
          <TestConsumer />
        </LaunchDarklyToolbarProvider>,
      );

      // WHEN: The toolbar loads
      // THEN: It uses sensible defaults (right position)
      expect(screen.getByTestId('position')).toHaveTextContent('right');
    });
  });
});
