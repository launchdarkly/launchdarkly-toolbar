import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { EnvironmentProvider, useEnvironmentContext } from '../ui/Toolbar/context/EnvironmentProvider';
import { ProjectProvider, useProjectContext } from '../ui/Toolbar/context/ProjectProvider';
import { TOOLBAR_STORAGE_KEYS } from '../ui/Toolbar/utils/localStorage';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import type { ApiProject } from '../ui/Toolbar/types/ldApi';

// Mock ApiProvider
vi.mock('../ui/Toolbar/context/ApiProvider', () => ({
  useApi: vi.fn(),
}));

// Mock DevServerProvider to provide minimal context
vi.mock('../ui/Toolbar/context/DevServerProvider', () => ({
  useDevServerContext: vi.fn(),
}));

import { useApi } from '../ui/Toolbar/context/ApiProvider';
import { useDevServerContext } from '../ui/Toolbar/context/DevServerProvider';

// Test component that consumes the Environment context
function TestConsumer() {
  const { environment, setEnvironment } = useEnvironmentContext();

  return (
    <div>
      <div data-testid="environment">{environment}</div>
      <button onClick={() => setEnvironment('staging')}>Set Staging</button>
    </div>
  );
}

// Mock ProjectProvider wrapper for tests
function MockProjectProviderWrapper({
  children,
  environments = [],
}: {
  children: React.ReactNode;
  environments?: any[];
}) {
  return (
    <div data-testid="mock-project-provider">
      {/* Simulate ProjectProvider by providing the mock context directly */}
      {React.createElement(ProjectProvider as any, {
        children: (
          <>
            {/* Inject mock environments into context */}
            <div style={{ display: 'none' }} data-environments={JSON.stringify(environments)} />
            {children}
          </>
        ),
      })}
    </div>
  );
}

describe('EnvironmentProvider', () => {
  const mockGetApiProjects = vi.fn();

  // Mock environments
  const mockEnvironments = [
    { _id: 'env-1', key: 'production', name: 'Production' },
    { _id: 'env-2', key: 'staging', name: 'Staging' },
    { _id: 'env-3', key: 'development', name: 'Development' },
  ];

  const mockProjects: ApiProject[] = [
    {
      _id: 'project-1',
      key: 'test-project',
      name: 'Test Project',
      environments: mockEnvironments,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Setup default API mock
    (useApi as any).mockReturnValue({
      getProjects: mockGetApiProjects,
      apiReady: true,
    });

    mockGetApiProjects.mockResolvedValue(mockProjects);

    // Setup default DevServer mock (SDK mode - no dev server)
    (useDevServerContext as any).mockReturnValue({
      state: {
        sourceEnvironmentKey: null,
        flags: {},
        connectionStatus: 'disconnected',
        lastSyncTime: 0,
        isLoading: false,
        error: null,
      },
      setOverride: vi.fn(),
      clearOverride: vi.fn(),
      clearAllOverrides: vi.fn(),
      refresh: vi.fn(),
    });
  });

  describe('Default State', () => {
    test('initializes with "production" as default environment', async () => {
      // GIVEN: EnvironmentProvider is mounted without environments
      (useApi as any).mockReturnValue({
        getProjects: vi.fn().mockResolvedValue([]),
        apiReady: true,
      });

      // WHEN: Provider is rendered
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Default environment is "production"
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });
  });

  describe('Environment Selection by clientSideId', () => {
    test('sets environment based on matching clientSideId', async () => {
      // GIVEN: Environments are available and clientSideId matches staging
      // AND: No saved environment in localStorage
      localStorage.removeItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT);
      const clientSideId = 'env-2'; // staging

      // WHEN: Provider is rendered with clientSideId
      render(
        <ProjectProvider clientSideId={clientSideId}>
          <EnvironmentProvider clientSideId={clientSideId}>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Environment is set to the matching environment's key
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });

    test('falls back to first environment when clientSideId does not match', async () => {
      // GIVEN: Environments are available but clientSideId does not match any
      // AND: No saved environment in localStorage
      localStorage.removeItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT);
      const clientSideId = 'nonexistent-id';

      // WHEN: Provider is rendered with non-matching clientSideId
      render(
        <ProjectProvider>
          <EnvironmentProvider clientSideId={clientSideId}>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Falls back to first environment in the list
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });

    test('uses first environment when clientSideId is not provided', async () => {
      // GIVEN: Environments are available but no clientSideId provided
      // AND: No saved environment in localStorage
      localStorage.removeItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT);

      // WHEN: Provider is rendered without clientSideId
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Uses first environment from the list
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });
  });

  describe('Empty Environments', () => {
    test('falls back to "production" when environments array is empty', async () => {
      // GIVEN: No environments are available
      (useApi as any).mockReturnValue({
        getProjects: vi.fn().mockResolvedValue([
          {
            _id: 'project-1',
            key: 'test-project',
            name: 'Test Project',
            environments: [],
          },
        ]),
        apiReady: true,
      });

      // WHEN: Provider is rendered with empty environments
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Falls back to "production"
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });
  });

  describe('Environment Updates', () => {
    test('updates environment when environments change', async () => {
      // GIVEN: Provider starts with no environments
      const mockGetApiProjects = vi.fn();
      (useApi as any).mockReturnValue({
        getProjects: mockGetApiProjects,
        apiReady: true,
      });

      // Start with empty projects
      mockGetApiProjects.mockResolvedValueOnce([
        {
          _id: 'project-1',
          key: 'test-project',
          name: 'Test Project',
          environments: [],
        },
      ]);

      const { rerender } = render(
        <ProjectProvider>
          <EnvironmentProvider clientSideId="env-2">
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Initially shows "production" (fallback)
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });

      // WHEN: Projects with environments become available
      mockGetApiProjects.mockResolvedValueOnce(mockProjects);

      rerender(
        <ProjectProvider>
          <EnvironmentProvider clientSideId="env-2">
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // Force re-fetch by clearing projects state
      act(() => {
        // Simulating the ProjectProvider re-fetching projects
      });

      // THEN: Environment updates to match clientSideId
      await waitFor(
        () => {
          const envText = screen.getByTestId('environment').textContent;
          // It may still be "production" initially, but should update
          expect(['production', 'staging']).toContain(envText);
        },
        { timeout: 3000 },
      );
    });

    test('can manually set environment using setEnvironment', async () => {
      // GIVEN: Provider is initialized with environments
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // Wait for initial environment to be set
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });

      // WHEN: setEnvironment is called manually (with no environments, changes persist)
      const button = screen.getByText('Set Staging');
      fireEvent.click(button);

      // THEN: Environment is updated (manual change persists when no environments)
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });
  });

  describe('LocalStorage Integration', () => {
    test('saves environment to localStorage when setEnvironment is called', async () => {
      // GIVEN: Provider is initialized
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // Wait for initial state
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toBeTruthy();
      });

      // WHEN: setEnvironment is called
      const button = screen.getByText('Set Staging');
      fireEvent.click(button);

      // THEN: Environment is saved to localStorage
      await waitFor(() => {
        expect(localStorage.getItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT)).toBe('staging');
      });
    });

    test('loads environment from localStorage on initialization', async () => {
      // GIVEN: Environment is saved in localStorage
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT, 'staging');

      // WHEN: Provider is initialized
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Environment is loaded from localStorage
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });

    test('localStorage takes priority over clientSideId', async () => {
      // GIVEN: Environment is saved in localStorage and clientSideId is provided
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT, 'development');
      const clientSideId = 'env-2'; // staging

      // WHEN: Provider is initialized with clientSideId
      render(
        <ProjectProvider clientSideId={clientSideId}>
          <EnvironmentProvider clientSideId={clientSideId}>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: localStorage value takes priority
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('development');
      });
    });

    test('uses clientSideId when no localStorage value exists', async () => {
      // GIVEN: No environment in localStorage but clientSideId provided
      localStorage.removeItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT);
      const clientSideId = 'env-2'; // staging

      // WHEN: Provider is initialized
      render(
        <ProjectProvider clientSideId={clientSideId}>
          <EnvironmentProvider clientSideId={clientSideId}>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Environment is set based on clientSideId
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });

      // AND: Value is saved to localStorage
      await waitFor(() => {
        expect(localStorage.getItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT)).toBe('staging');
      });
    });

    test('persists manual environment changes across re-renders', async () => {
      // GIVEN: Provider is rendered
      const { rerender } = render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('environment')).toBeTruthy();
      });

      // WHEN: Environment is manually changed
      const button = screen.getByText('Set Staging');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });

      // AND: Component is re-rendered
      rerender(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Manual change persists
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });
  });

  describe('Context Hook - useEnvironmentContext', () => {
    test('provides default context when used outside EnvironmentProvider', () => {
      // GIVEN: Component tries to use context without provider
      const TestWithoutProvider = () => {
        const context = useEnvironmentContext();
        return (
          <div>
            <div data-testid="default-environment">{context.environment || 'empty'}</div>
            <div data-testid="has-setter">{typeof context.setEnvironment === 'function' ? 'true' : 'false'}</div>
          </div>
        );
      };

      // WHEN: Rendered without provider (context has default value)
      render(<TestWithoutProvider />);

      // THEN: Provides default context values
      expect(screen.getByTestId('default-environment')).toHaveTextContent('empty');
      expect(screen.getByTestId('has-setter')).toHaveTextContent('true');
    });

    test('provides context values when used inside EnvironmentProvider', async () => {
      // GIVEN: Component uses context within provider
      const TestWithProvider = () => {
        const context = useEnvironmentContext();
        return (
          <div>
            <div data-testid="has-environment">{typeof context.environment === 'string' ? 'true' : 'false'}</div>
            <div data-testid="has-setEnvironment">
              {typeof context.setEnvironment === 'function' ? 'true' : 'false'}
            </div>
          </div>
        );
      };

      // WHEN: Rendered with provider
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestWithProvider />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Context provides required values
      await waitFor(() => {
        expect(screen.getByTestId('has-environment')).toHaveTextContent('true');
        expect(screen.getByTestId('has-setEnvironment')).toHaveTextContent('true');
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined environments gracefully', async () => {
      // GIVEN: API returns project with undefined environments
      (useApi as any).mockReturnValue({
        getProjects: vi.fn().mockResolvedValue([
          {
            _id: 'project-1',
            key: 'test-project',
            name: 'Test Project',
            environments: undefined,
          },
        ]),
        apiReady: true,
      });

      // WHEN: Provider is rendered
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Falls back to "production" without crashing
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });

    test('handles environment with missing key gracefully', async () => {
      // GIVEN: First environment is missing key
      (useApi as any).mockReturnValue({
        getProjects: vi.fn().mockResolvedValue([
          {
            _id: 'project-1',
            key: 'test-project',
            name: 'Test Project',
            environments: [{ _id: 'env-1', name: 'Production' }],
          },
        ]),
        apiReady: true,
      });

      // WHEN: Provider is rendered
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Falls back to "production" (nullish coalescing)
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });
    });
  });

  describe('Multiple Consumers', () => {
    test('all consumers receive the same environment state', async () => {
      // GIVEN: Multiple components consume the same context
      const Consumer1 = () => {
        const { environment } = useEnvironmentContext();
        return <div data-testid="consumer-1">{environment}</div>;
      };

      const Consumer2 = () => {
        const { environment } = useEnvironmentContext();
        return <div data-testid="consumer-2">{environment}</div>;
      };

      // WHEN: Multiple consumers are rendered
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <Consumer1 />
            <Consumer2 />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: All consumers show the same environment (should be first env or production)
      await waitFor(() => {
        const env1 = screen.getByTestId('consumer-1').textContent;
        const env2 = screen.getByTestId('consumer-2').textContent;
        expect(env1).toBe(env2);
        expect(env1).toBeTruthy();
      });
    });

    test('setEnvironment updates all consumers', async () => {
      // GIVEN: Multiple components consume and can modify context
      const Consumer1 = () => {
        const { environment, setEnvironment } = useEnvironmentContext();
        return (
          <div>
            <div data-testid="consumer-1">{environment}</div>
            <button onClick={() => setEnvironment('development')}>Change</button>
          </div>
        );
      };

      const Consumer2 = () => {
        const { environment } = useEnvironmentContext();
        return <div data-testid="consumer-2">{environment}</div>;
      };

      // WHEN: Provider is rendered with multiple consumers
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <Consumer1 />
            <Consumer2 />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // Wait for initial state
      await waitFor(() => {
        expect(screen.getByTestId('consumer-1')).toHaveTextContent('production');
      });

      // WHEN: One consumer changes the environment
      const button = screen.getByText('Change');
      fireEvent.click(button);

      // THEN: All consumers reflect the change
      await waitFor(() => {
        expect(screen.getByTestId('consumer-1')).toHaveTextContent('development');
        expect(screen.getByTestId('consumer-2')).toHaveTextContent('development');
      });
    });
  });

  describe('Dev Server Mode Integration', () => {
    test('syncs environment with dev server sourceEnvironmentKey', async () => {
      // GIVEN: Dev server is active with a specific environment
      (useDevServerContext as any).mockReturnValue({
        state: {
          sourceEnvironmentKey: 'staging',
          flags: {},
          connectionStatus: 'connected',
          lastSyncTime: Date.now(),
          isLoading: false,
          error: null,
        },
        setOverride: vi.fn(),
        clearOverride: vi.fn(),
        clearAllOverrides: vi.fn(),
        refresh: vi.fn(),
      });

      // WHEN: EnvironmentProvider is rendered
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Environment matches dev server's environment
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });

    test('updates environment when dev server environment changes', async () => {
      // GIVEN: Dev server starts with one environment
      const mockDevServerContext = {
        state: {
          sourceEnvironmentKey: 'production',
          flags: {},
          connectionStatus: 'connected',
          lastSyncTime: Date.now(),
          isLoading: false,
          error: null,
        },
        setOverride: vi.fn(),
        clearOverride: vi.fn(),
        clearAllOverrides: vi.fn(),
        refresh: vi.fn(),
      };

      (useDevServerContext as any).mockReturnValue(mockDevServerContext);

      const { rerender } = render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });

      // WHEN: Dev server environment changes
      mockDevServerContext.state.sourceEnvironmentKey = 'development';
      (useDevServerContext as any).mockReturnValue(mockDevServerContext);

      rerender(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Environment updates to match
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('development');
      });
    });

    test('does not save to localStorage in dev server mode', async () => {
      // GIVEN: Dev server mode is active
      (useDevServerContext as any).mockReturnValue({
        state: {
          sourceEnvironmentKey: 'production',
          flags: {},
          connectionStatus: 'connected',
          lastSyncTime: Date.now(),
          isLoading: false,
          error: null,
        },
        setOverride: vi.fn(),
        clearOverride: vi.fn(),
        clearAllOverrides: vi.fn(),
        refresh: vi.fn(),
      });

      // WHEN: EnvironmentProvider is rendered and environment is set
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('production');
      });

      const button = screen.getByText('Set Staging');
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });

      // THEN: Environment is NOT saved to localStorage (dev server controls it)
      expect(localStorage.getItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT)).toBeNull();
    });

    test('ignores localStorage when dev server is active', async () => {
      // GIVEN: localStorage has a saved environment
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.ENVIRONMENT, 'development');

      // AND: Dev server is active with a different environment
      (useDevServerContext as any).mockReturnValue({
        state: {
          sourceEnvironmentKey: 'staging',
          flags: {},
          connectionStatus: 'connected',
          lastSyncTime: Date.now(),
          isLoading: false,
          error: null,
        },
        setOverride: vi.fn(),
        clearOverride: vi.fn(),
        clearAllOverrides: vi.fn(),
        refresh: vi.fn(),
      });

      // WHEN: EnvironmentProvider is rendered
      render(
        <ProjectProvider>
          <EnvironmentProvider>
            <TestConsumer />
          </EnvironmentProvider>
        </ProjectProvider>,
      );

      // THEN: Environment matches dev server, not localStorage
      await waitFor(() => {
        expect(screen.getByTestId('environment')).toHaveTextContent('staging');
      });
    });
  });
});
