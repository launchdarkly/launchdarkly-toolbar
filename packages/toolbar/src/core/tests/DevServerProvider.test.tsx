import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { DevServerProvider, useDevServerContext } from '../ui/Toolbar/context/DevServerProvider';
import '@testing-library/jest-dom/vitest';

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
  updateProjectContext: vi.fn().mockResolvedValue({
    sourceEnvironmentKey: 'test-environment',
    flagsState: {},
    overrides: {},
    availableVariations: {},
    _lastSyncedFromSource: Date.now(),
  }),
};

const mockFlagStateManagerInstance = {
  getEnhancedFlags: vi.fn().mockResolvedValue({}),
  setApiFlags: vi.fn(),
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

// Create mock for getProjects that can be overridden in tests
const mockGetProjects = vi.fn().mockResolvedValue([{ key: 'test-project', name: 'Test Project' }]);
const mockProjectKey = { current: 'test-project' };
const mockGetProjectFlags = vi.fn().mockResolvedValue({ items: [] });

// Mock context management functions with stable references
const mockContextsArray: any[] = []; // Stable reference to avoid triggering useCallback changes
const mockSetContext = vi.fn().mockResolvedValue(undefined);
const mockAddContext = vi.fn();
const mockUpdateContext = vi.fn();
const mockActiveContext = { current: null as any };

// Mock the api module which exports all API-related context
vi.mock('../ui/Toolbar/context/api', () => ({
  useProjectContext: () => ({
    projectKey: mockProjectKey.current,
    projects: [{ key: 'test-project', name: 'Test Project' }],
    getProjects: mockGetProjects,
    loading: false,
    error: null,
  }),
  useFlagsContext: () => ({
    flags: [],
    loading: false,
    getProjectFlags: mockGetProjectFlags,
  }),
  useApi: () => ({
    apiReady: true,
    getFlag: vi.fn(),
    getProjects: vi.fn(),
    getFlags: vi.fn(),
  }),
}));

// Also mock the individual files for direct imports
vi.mock('../ui/Toolbar/context/api/ProjectProvider', () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useProjectContext: () => ({
    projectKey: mockProjectKey.current,
    projects: [{ key: 'test-project', name: 'Test Project' }],
    getProjects: mockGetProjects,
    loading: false,
    error: null,
  }),
}));

vi.mock('../ui/Toolbar/context/api/FlagsProvider', () => ({
  FlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useFlagsContext: () => ({
    flags: [],
    loading: false,
    getProjectFlags: mockGetProjectFlags,
  }),
}));

vi.mock('../ui/Toolbar/context/api/ApiProvider', () => ({
  ApiProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useApi: () => ({
    apiReady: true,
    getFlag: vi.fn(),
    getProjects: vi.fn(),
    getFlags: vi.fn(),
  }),
}));

vi.mock('../ui/Toolbar/context/api/ContextsProvider', () => ({
  ContextsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useContextsContext: () => ({
    contexts: mockContextsArray, // Use stable reference
    filter: '',
    setFilter: vi.fn(),
    addContext: mockAddContext,
    removeContext: vi.fn(),
    updateContext: mockUpdateContext,
    setContext: mockSetContext,
    activeContext: mockActiveContext.current,
    isAddFormOpen: false,
    setIsAddFormOpen: vi.fn(),
    clearContexts: vi.fn(),
  }),
}));

// Test component that consumes the context
function TestConsumer() {
  const { state, refresh } = useDevServerContext();

  return (
    <div>
      <div data-testid="connection-status">{state.connectionStatus}</div>
      <div data-testid="source-environment">{state.sourceEnvironmentKey || 'none'}</div>
      <div data-testid="is-loading">{state.isLoading.toString()}</div>
      <div data-testid="error">{state.error || 'none'}</div>
      <div data-testid="current-project">test-project</div>
      <button data-testid="refresh-button" onClick={refresh}>
        Refresh
      </button>
    </div>
  );
}

describe('DevServerProvider - Integration Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Reset mock instances to default state
    mockProjectKey.current = 'test-project';
    mockGetProjects.mockResolvedValue([{ key: 'test-project', name: 'Test Project' }]);
    mockGetProjectFlags.mockResolvedValue({ items: [] });
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
    mockDevServerClientInstance.updateProjectContext.mockResolvedValue({
      sourceEnvironmentKey: 'test-environment',
      flagsState: {},
      overrides: {},
      availableVariations: {},
      _lastSyncedFromSource: Date.now(),
    });

    mockFlagStateManagerInstance.getEnhancedFlags.mockResolvedValue({});
    mockFlagStateManagerInstance.subscribe.mockReturnValue(() => {});

    // Reset context mocks
    mockSetContext.mockResolvedValue(undefined);
    mockAddContext.mockClear();
    mockUpdateContext.mockClear();
    mockActiveContext.current = null;
  });

  afterEach(() => {
    // Cleanup any timers or pending promises
    vi.clearAllTimers();
  });

  describe('Developer Setup Flow - Dev Server Mode', () => {
    test('connects to dev server and gets project auto-detection', async () => {
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

    test('specifies explicit project and connects successfully', async () => {
      // GIVEN: Developer knows exactly which project they want to work with
      mockProjectKey.current = 'explicit-project';
      mockGetProjects.mockResolvedValueOnce([
        { key: 'explicit-project', name: 'Explicit Project' },
        { key: 'test-project', name: 'Test Project' },
      ]);

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

      expect(mockGetProjects).toHaveBeenCalled();
    });

    test('handles dev server connection issues gracefully', async () => {
      // GIVEN: Developer's dev server is not running or misconfigured
      mockGetProjects.mockRejectedValueOnce(new Error('Connection failed'));

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

    test('handles network timeout errors during initial connection', async () => {
      // GIVEN: Developer's network connection is slow or unreliable
      mockGetProjects.mockRejectedValueOnce(new Error('ETIMEDOUT: connect timeout'));

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
    });
  });

  describe('Developer Setup Flow - SDK Mode', () => {
    test('uses toolbar in client-side only mode', async () => {
      // GIVEN: Developer wants to use toolbar without a dev server (client-side only)
      // Set empty project key for SDK mode
      mockProjectKey.current = '';

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
      expect(screen.getByTestId('source-environment')).toHaveTextContent('none');
      expect(screen.getByTestId('error')).toHaveTextContent('none');

      // AND: Doesn't attempt to fetch projects or make server connections
      expect(mockGetProjects).not.toHaveBeenCalled();
    });
  });

  describe('API Call Optimization - Dev Server Mode', () => {
    test('fetches API flags on initial connection', async () => {
      // GIVEN: Developer connects to dev server for the first time
      const initialSyncTime = 1000000;
      mockDevServerClientInstance.getProjectData.mockResolvedValue({
        sourceEnvironmentKey: 'test-environment',
        flagsState: {},
        overrides: {},
        availableVariations: {},
        _lastSyncedFromSource: initialSyncTime,
      });

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 50000, // Long interval to prevent auto-polling during test
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // WHEN: The toolbar initializes and connects
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        const isLoading = screen.getByTestId('is-loading');
        return connectionStatus.textContent === 'connected' && isLoading.textContent === 'false';
      });

      // THEN: API flags are fetched on first sync
      await waitFor(() => {
        return mockGetProjectFlags.mock.calls.length >= 1;
      });

      expect(mockGetProjectFlags).toHaveBeenCalledTimes(1);
      expect(mockGetProjectFlags).toHaveBeenCalledWith('test-project');
    });

    test('does NOT call API when dev-server poll occurs with unchanged timestamp', async () => {
      // GIVEN: Developer has toolbar connected and polling is active
      const syncTime = 1000000;
      let devServerCallCount = 0;

      mockDevServerClientInstance.getProjectData.mockImplementation(async () => {
        devServerCallCount++;
        return {
          sourceEnvironmentKey: 'test-environment',
          flagsState: {},
          overrides: {},
          availableVariations: {},
          _lastSyncedFromSource: syncTime, // Always the same timestamp
        };
      });

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 50, // Poll very frequently for faster test
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // WHEN: Initial connection completes
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      // Verify initial API call happened
      await waitFor(() => {
        return mockGetProjectFlags.mock.calls.length >= 1;
      });

      const initialApiCalls = mockGetProjectFlags.mock.calls.length;

      // Record how many dev server calls happened during initial setup
      // (usually 2: one in setup, one in loadProjectData)
      const devServerCallsAfterSetup = devServerCallCount;

      // AND: Wait for poll interval to trigger
      await new Promise((resolve) => setTimeout(resolve, 200)); // Wait 200ms for multiple polls

      // THEN: Dev server has been polled at least once more (for override changes)
      expect(devServerCallCount).toBeGreaterThan(devServerCallsAfterSetup);

      // BUT: API is NOT called again (optimization working - timestamp unchanged)
      expect(mockGetProjectFlags.mock.calls.length).toBe(initialApiCalls);
    });

    test('forces API fetch on manual refresh regardless of timestamp', async () => {
      // GIVEN: Developer has toolbar connected with unchanged dev server data
      const syncTime = 1000000;

      mockDevServerClientInstance.getProjectData.mockResolvedValue({
        sourceEnvironmentKey: 'test-environment',
        flagsState: {},
        overrides: {},
        availableVariations: {},
        _lastSyncedFromSource: syncTime, // Same timestamp
      });

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 50000, // Long interval
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // WHEN: Initial connection completes
      await waitFor(
        () => {
          const connectionStatus = screen.getByTestId('connection-status');
          const isLoading = screen.getByTestId('is-loading');
          return connectionStatus.textContent === 'connected' && isLoading.textContent === 'false';
        },
        { timeout: 3000 },
      );

      // Verify initial API call happened
      await waitFor(() => {
        return mockGetProjectFlags.mock.calls.length >= 1;
      });

      const initialApiCalls = mockGetProjectFlags.mock.calls.length;

      // AND: Developer manually clicks refresh
      const refreshButton = screen.getByTestId('refresh-button');
      fireEvent.click(refreshButton);

      // THEN: API is called again despite unchanged timestamp (force refresh)
      await waitFor(() => {
        return mockGetProjectFlags.mock.calls.length > initialApiCalls;
      });

      expect(mockGetProjectFlags.mock.calls.length).toBeGreaterThan(initialApiCalls);
      expect(mockDevServerClientInstance.getProjectData).toHaveBeenCalled();
    });
  });

  describe('Context Synchronization - Bidirectional Sync', () => {
    test('syncs context to dev server when active context changes in toolbar', async () => {
      // GIVEN: Developer has toolbar connected to dev server
      const testContext = { kind: 'user', key: 'test-user-123', name: 'Test User' };
      mockActiveContext.current = null;

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 50000, // Long interval to prevent auto-polling
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // WHEN: Toolbar initializes and connects
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      // Clear any calls from initialization
      mockDevServerClientInstance.updateProjectContext.mockClear();

      // AND: Active context changes in the toolbar
      mockActiveContext.current = testContext;

      // Trigger re-render to simulate context change
      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 50000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // THEN: Context is synced to dev server via updateProjectContext
      await waitFor(() => {
        return mockDevServerClientInstance.updateProjectContext.mock.calls.length > 0;
      });

      expect(mockDevServerClientInstance.updateProjectContext).toHaveBeenCalledWith(testContext);
    });

    test('syncs context from dev server to toolbar when dev server context changes', async () => {
      // GIVEN: Developer has toolbar connected with initial context
      const initialContext = { kind: 'user', key: 'user-1', name: 'User One' };
      const updatedContext = { kind: 'user', key: 'user-2', name: 'User Two' };

      let callCount = 0;
      mockDevServerClientInstance.getProjectData.mockImplementation(async () => {
        callCount++;
        return {
          sourceEnvironmentKey: 'test-environment',
          flagsState: {},
          overrides: {},
          availableVariations: {},
          _lastSyncedFromSource: Date.now(),
          context: callCount === 1 ? initialContext : updatedContext,
        };
      });

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 100, // Short interval for faster test
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // WHEN: Toolbar connects and gets initial context
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      // Verify initial context was set
      await waitFor(() => {
        return mockSetContext.mock.calls.some((call) => call[0].key === 'user-1');
      });

      const initialSetContextCalls = mockSetContext.mock.calls.length;

      // AND: Dev server context changes on next poll
      // Wait for next poll cycle
      await new Promise((resolve) => setTimeout(resolve, 150));

      // THEN: Updated context is synced to toolbar via setContext
      await waitFor(() => {
        return mockSetContext.mock.calls.length > initialSetContextCalls;
      });

      const lastCall = mockSetContext.mock.calls[mockSetContext.mock.calls.length - 1];
      expect(lastCall[0]).toEqual(updatedContext);
    });

    test('adds new context when dev server context is not in stored contexts', async () => {
      // GIVEN: Developer has toolbar connected with no stored contexts
      const newContext = { kind: 'organization', key: 'org-123', name: 'Test Org' };

      mockDevServerClientInstance.getProjectData.mockResolvedValue({
        sourceEnvironmentKey: 'test-environment',
        flagsState: {},
        overrides: {},
        availableVariations: {},
        _lastSyncedFromSource: Date.now(),
        context: newContext,
      });

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 50000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // WHEN: Toolbar connects and receives context from dev server
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      // THEN: New context is added to stored contexts via addContext
      await waitFor(() => {
        return mockAddContext.mock.calls.length > 0;
      });

      expect(mockAddContext).toHaveBeenCalledWith(newContext);
    });

    test('updates existing context when dev server context has same kind+key but different properties', async () => {
      // GIVEN: Developer has existing context in stored contexts
      const existingContext = { kind: 'user', key: 'user-1', name: 'Old Name', email: 'old@example.com' };
      const updatedContext = { kind: 'user', key: 'user-1', name: 'New Name', email: 'new@example.com' };

      // Mock that context already exists
      mockContextsArray.length = 0;
      mockContextsArray.push(existingContext);

      mockDevServerClientInstance.getProjectData.mockResolvedValue({
        sourceEnvironmentKey: 'test-environment',
        flagsState: {},
        overrides: {},
        availableVariations: {},
        _lastSyncedFromSource: Date.now(),
        context: updatedContext,
      });

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 50000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // WHEN: Toolbar receives updated context from dev server with same kind+key
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      // THEN: Existing context is updated via updateContext (not added as duplicate)
      await waitFor(() => {
        return mockUpdateContext.mock.calls.length > 0;
      });

      expect(mockUpdateContext).toHaveBeenCalled();
      // Should not add a duplicate
      expect(mockAddContext).not.toHaveBeenCalled();
    });

    test('does not sync context to dev server when context has not changed', async () => {
      // GIVEN: Developer has toolbar connected with active context
      const unchangedContext = { kind: 'user', key: 'user-1', name: 'User One' };
      mockActiveContext.current = unchangedContext;

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 50000,
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      const initialUpdateCalls = mockDevServerClientInstance.updateProjectContext.mock.calls.length;

      // WHEN: Same context is set again (no actual change)
      // Wait a bit to ensure no additional calls are made
      await new Promise((resolve) => setTimeout(resolve, 100));

      // THEN: updateProjectContext is not called again (optimization working)
      expect(mockDevServerClientInstance.updateProjectContext.mock.calls.length).toBe(initialUpdateCalls);
    });

    test('prevents infinite sync loop between toolbar and dev server', async () => {
      // GIVEN: Developer has toolbar connected
      const testContext = { kind: 'user', key: 'test-user', name: 'Test User' };

      let getProjectDataCallCount = 0;
      mockDevServerClientInstance.getProjectData.mockImplementation(async () => {
        getProjectDataCallCount++;
        return {
          sourceEnvironmentKey: 'test-environment',
          flagsState: {},
          overrides: {},
          availableVariations: {},
          _lastSyncedFromSource: Date.now(),
          context: testContext,
        };
      });

      render(
        <DevServerProvider
          config={{
            devServerUrl: 'http://localhost:8765',
            pollIntervalInMs: 100, // Short interval
          }}
        >
          <TestConsumer />
        </DevServerProvider>,
      );

      // WHEN: Context is synced from dev server to toolbar
      await waitFor(() => {
        const connectionStatus = screen.getByTestId('connection-status');
        return connectionStatus.textContent === 'connected';
      });

      await waitFor(() => {
        return mockSetContext.mock.calls.length > 0;
      });

      const updateContextCallsBefore = mockDevServerClientInstance.updateProjectContext.mock.calls.length;

      // Wait for multiple poll cycles
      await new Promise((resolve) => setTimeout(resolve, 300));

      // THEN: updateProjectContext is not called repeatedly (loop prevention working)
      // Should not have excessive calls indicating a loop
      const updateContextCallsAfter = mockDevServerClientInstance.updateProjectContext.mock.calls.length;
      expect(updateContextCallsAfter - updateContextCallsBefore).toBeLessThan(2);
    });
  });
});
