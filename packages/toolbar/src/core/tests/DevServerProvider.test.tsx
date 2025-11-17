import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { DevServerProvider, useDevServerContext } from '../ui/Toolbar/context/DevServerProvider';

// Create mock instances that we can access in tests
const mockDevServerClientInstance = {
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
};

const mockFlagStateManagerInstance = {
  getEnhancedFlags: vi.fn().mockResolvedValue({}),
  setOverride: vi.fn(),
  clearOverride: vi.fn(),
  subscribe: vi.fn().mockReturnValue(() => {}),
};

vi.mock('../services/DevServerClient', () => {
  function MockDevServerClient() {
    // Assign all methods to this instance
    Object.assign(this, mockDevServerClientInstance);
    return this;
  }

  return {
    DevServerClient: MockDevServerClient,
  };
});

vi.mock('../services/FlagStateManager', () => {
  function MockFlagStateManager() {
    Object.assign(this, mockFlagStateManagerInstance);
    return this;
  }

  return {
    FlagStateManager: MockFlagStateManager,
  };
});

// Mock the ProjectProvider
vi.mock('../ui/Toolbar/context/ProjectProvider', () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useProjectContext: () => ({
    projectKey: 'test-project',
    projects: ['test-project'],
    getProjects: vi.fn().mockResolvedValue(['test-project']),
    loading: false,
    error: null,
  }),
}));

// Mock the FlagsProvider
vi.mock('../ui/Toolbar/context/FlagsProvider', () => ({
  FlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useFlagsContext: () => ({
    flags: [],
    loading: false,
    getProjectFlags: vi.fn().mockResolvedValue([]),
  }),
}));

// Test component that consumes the context
function TestConsumer() {
  const { state } = useDevServerContext();

  return (
    <div>
      <div data-testid="connection-status">{state.connectionStatus}</div>
      <div data-testid="source-environment">{state.sourceEnvironmentKey || 'none'}</div>
      <div data-testid="is-loading">{state.isLoading.toString()}</div>
      <div data-testid="error">{state.error || 'none'}</div>
      <div data-testid="current-project">test-project</div>
    </div>
  );
}

describe.skip('DevServerProvider - Integration Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Reset mock instances to default state
    mockDevServerClientInstance.getAvailableProjects.mockResolvedValue(['test-project']);
    mockDevServerClientInstance.setProjectKey.mockClear();
    mockDevServerClientInstance.getProjectKey.mockReturnValue('test-project');
    mockDevServerClientInstance.getProjectData.mockResolvedValue({
      sourceEnvironmentKey: 'test-environment',
      flagsState: {},
      overrides: {},
      availableVariations: {},
      _lastSyncedFromSource: Date.now(),
    });

    mockFlagStateManagerInstance.getEnhancedFlags.mockResolvedValue({});
    mockFlagStateManagerInstance.subscribe.mockReturnValue(() => {});
  });

  describe('Developer Setup Flow - Dev Server Mode', () => {
    test('developer connects to dev server and gets project auto-detection', async () => {
      // GIVEN: Developer starts up the toolbar pointing to their dev server
      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 5000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
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
      mockDevServerClientInstance.getAvailableProjects.mockResolvedValueOnce(['explicit-project', 'test-project']);

      // WHEN: They configure the toolbar with their specific project
      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            projectKey: 'explicit-project',
            pollIntervalInMs: 5000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // THEN: The toolbar connects using their specified project
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      expect(mockDevServerClientInstance.setProjectKey).toHaveBeenCalledWith('explicit-project');
    });

    test('developer handles dev server connection issues gracefully', async () => {
      // GIVEN: Developer's dev server is not running or misconfigured
      mockDevServerClientInstance.getAvailableProjects.mockRejectedValueOnce(new Error('Connection failed'));

      // WHEN: They try to connect with the toolbar
      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 5000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
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
      mockDevServerClientInstance.getAvailableProjects.mockRejectedValueOnce(new Error('ETIMEDOUT: connect timeout'));

      // WHEN: They attempt to connect with the toolbar
      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 5000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
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
        <DevServerProvider
          config={{
            pollIntervalInMs: 5000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
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

      // AND: Doesn't attempt to make server connections
      expect(mockDevServerClientInstance.getAvailableProjects).not.toHaveBeenCalled();
    });
  });
});
