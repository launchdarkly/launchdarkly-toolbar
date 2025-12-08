import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { ContextsProvider, useContextsContext } from '../ui/Toolbar/context/api/ContextsProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { ApiContext, SearchContextsResponse } from '../ui/Toolbar/types/ldApi';

// Mock the dependencies
vi.mock('../ui/Toolbar/context/api/ProjectProvider', () => ({
  useProjectContext: vi.fn(),
}));

vi.mock('../ui/Toolbar/context/api/ApiProvider', () => ({
  useApi: vi.fn(),
}));

vi.mock('../ui/Toolbar/context/api/AuthProvider', () => ({
  useAuthContext: vi.fn(),
}));

vi.mock('../ui/Toolbar/context/api/EnvironmentProvider', () => ({
  useEnvironmentContext: vi.fn(),
}));

// Mock the useCurrentSdkContext hook to avoid requiring PluginsProvider
vi.mock('../ui/Toolbar/context/state/useCurrentSdkContext', () => ({
  useCurrentSdkContext: vi.fn(() => null),
  isCurrentContext: vi.fn(() => false),
}));

import { useProjectContext } from '../ui/Toolbar/context/api/ProjectProvider';
import { useApi } from '../ui/Toolbar/context/api/ApiProvider';
import { useAuthContext } from '../ui/Toolbar/context/api/AuthProvider';
import { useEnvironmentContext } from '../ui/Toolbar/context/api/EnvironmentProvider';

// Test component
function TestConsumer() {
  const { contexts, loading } = useContextsContext();

  return (
    <div>
      <div data-testid="contexts-count">{contexts.length}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      {contexts.map((context) => (
        <div key={`${context.kind}-${context.key}`} data-testid={`context-${context.kind}-${context.key}`}>
          {context.name || context.key}
        </div>
      ))}
    </div>
  );
}

// Helper to create proper contexts response
function createContextsResponse(contexts: ApiContext[]): SearchContextsResponse {
  return {
    items: contexts.map((context) => ({ context })),
  };
}

describe('ContextsProvider', () => {
  const mockGetContexts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthContext as any).mockReturnValue({
      authenticated: true,
    });

    (useProjectContext as any).mockReturnValue({
      projectKey: 'test-project',
    });

    (useEnvironmentContext as any).mockReturnValue({
      environment: 'production',
    });

    (useApi as any).mockReturnValue({
      getContexts: mockGetContexts,
      apiReady: true,
    });
  });

  describe('Contexts Loading - Developer Workflow', () => {
    test('automatically fetches contexts when project and environment are selected', async () => {
      // GIVEN: Developer has selected a project and environment
      mockGetContexts.mockResolvedValue(
        createContextsResponse([
          { kind: 'user', key: 'user-1', name: 'User One' },
          { kind: 'user', key: 'user-2', name: 'User Two' },
        ]),
      );

      // WHEN: ContextsProvider initializes
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: Shows loading state initially
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // AND: Eventually loads the contexts
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // AND: All contexts are available
      expect(screen.getByTestId('context-user-user-1')).toHaveTextContent('User One');
      expect(screen.getByTestId('context-user-user-2')).toHaveTextContent('User Two');
    });

    test('does not fetch contexts when API is not ready', async () => {
      // GIVEN: API is not ready
      (useApi as any).mockReturnValue({
        getContexts: mockGetContexts,
        apiReady: false,
      });

      // WHEN: Provider tries to initialize
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: No API call is made
      await waitFor(() => {
        expect(mockGetContexts).not.toHaveBeenCalled();
      });

      // AND: No contexts are shown
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
    });

    test('does not fetch contexts when not authenticated', async () => {
      // GIVEN: User is not authenticated
      (useAuthContext as any).mockReturnValue({
        authenticated: false,
      });

      // WHEN: Provider tries to initialize
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: No API call is made
      await waitFor(() => {
        expect(mockGetContexts).not.toHaveBeenCalled();
      });

      // AND: No contexts are shown
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
    });

    test('does not fetch contexts when project key is missing', async () => {
      // GIVEN: No project selected
      (useProjectContext as any).mockReturnValue({
        projectKey: '',
      });

      // WHEN: Provider tries to initialize
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: No API call is made
      await waitFor(() => {
        expect(mockGetContexts).not.toHaveBeenCalled();
      });

      // AND: No contexts are shown
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
    });

    test('does not fetch contexts when environment is missing', async () => {
      // GIVEN: No environment selected
      (useEnvironmentContext as any).mockReturnValue({
        environment: '',
      });

      // WHEN: Provider tries to initialize
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: No API call is made
      await waitFor(() => {
        expect(mockGetContexts).not.toHaveBeenCalled();
      });

      // AND: No contexts are shown
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
    });
  });

  describe('Project/Environment Switching - Dynamic Updates', () => {
    test('refetches contexts when project changes', async () => {
      // GIVEN: Developer is viewing contexts for project-1
      mockGetContexts.mockResolvedValue(createContextsResponse([{ kind: 'user', key: 'user-a', name: 'User A' }]));

      const { rerender } = render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });

      // WHEN: They switch to project-2
      (useProjectContext as any).mockReturnValue({
        projectKey: 'project-2',
      });

      mockGetContexts.mockResolvedValue(
        createContextsResponse([
          { kind: 'user', key: 'user-x', name: 'User X' },
          { kind: 'organization', key: 'org-1', name: 'Org One' },
        ]),
      );

      rerender(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: New contexts are loaded for project-2
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      });
    });

    test('refetches contexts when environment changes', async () => {
      // GIVEN: Developer is viewing contexts for production environment
      mockGetContexts.mockResolvedValue(
        createContextsResponse([{ kind: 'user', key: 'prod-user', name: 'Production User' }]),
      );

      const { rerender } = render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
        expect(mockGetContexts).toHaveBeenCalledWith('test-project', 'production');
      });

      // WHEN: They switch to staging environment
      (useEnvironmentContext as any).mockReturnValue({
        environment: 'staging',
      });

      mockGetContexts.mockResolvedValue(
        createContextsResponse([
          { kind: 'user', key: 'staging-user-1', name: 'Staging User 1' },
          { kind: 'user', key: 'staging-user-2', name: 'Staging User 2' },
        ]),
      );

      rerender(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: New contexts are loaded for staging environment
      await waitFor(() => {
        expect(mockGetContexts).toHaveBeenCalledWith('test-project', 'staging');
      });

      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      });
    });
  });

  describe('Manual Context Fetching', () => {
    test('allows manual context fetching via getContexts', async () => {
      // GIVEN: Developer wants to manually refresh contexts
      mockGetContexts.mockResolvedValue(
        createContextsResponse([{ kind: 'user', key: 'initial-user', name: 'Initial User' }]),
      );

      const TestWithManualFetch = () => {
        const { getContexts, contexts } = useContextsContext();
        const [manualContexts, setManualContexts] = React.useState<ApiContext[]>([]);

        return (
          <div>
            <button
              data-testid="fetch-manual"
              onClick={async () => {
                const result = await getContexts();
                setManualContexts(result);
              }}
            >
              Fetch Manual
            </button>
            <div data-testid="auto-contexts-count">{contexts.length}</div>
            <div data-testid="manual-contexts-count">{manualContexts.length}</div>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestWithManualFetch />
        </ContextsProvider>,
      );

      // Wait for initial auto-fetch
      await waitFor(() => {
        expect(screen.getByTestId('auto-contexts-count')).toHaveTextContent('1');
      });

      // WHEN: They manually fetch contexts
      mockGetContexts.mockResolvedValue(
        createContextsResponse([
          { kind: 'user', key: 'new-user-1', name: 'New User 1' },
          { kind: 'user', key: 'new-user-2', name: 'New User 2' },
        ]),
      );

      const fetchButton = screen.getByTestId('fetch-manual');
      fetchButton.click();

      // THEN: Manual fetch returns the new contexts
      await waitFor(() => {
        expect(screen.getByTestId('manual-contexts-count')).toHaveTextContent('2');
      });
    });

    test('returns empty array when fetching contexts without API ready', async () => {
      // GIVEN: API is not ready
      (useApi as any).mockReturnValue({
        getContexts: mockGetContexts,
        apiReady: false,
      });

      const TestManualFetch = () => {
        const { getContexts } = useContextsContext();
        const [result, setResult] = React.useState<ApiContext[] | null>(null);

        return (
          <div>
            <button
              data-testid="fetch"
              onClick={async () => {
                const contexts = await getContexts();
                setResult(contexts);
              }}
            >
              Fetch
            </button>
            <div data-testid="result">{result ? result.length.toString() : 'null'}</div>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestManualFetch />
        </ContextsProvider>,
      );

      // WHEN: They try to fetch contexts
      const fetchButton = screen.getByTestId('fetch');
      fetchButton.click();

      // THEN: Returns empty array (no API ready)
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('0');
      });
    });

    test('returns empty array when fetching contexts without authentication', async () => {
      // GIVEN: User is not authenticated
      (useAuthContext as any).mockReturnValue({
        authenticated: false,
      });

      const TestManualFetch = () => {
        const { getContexts } = useContextsContext();
        const [result, setResult] = React.useState<ApiContext[] | null>(null);

        return (
          <div>
            <button
              data-testid="fetch"
              onClick={async () => {
                const contexts = await getContexts();
                setResult(contexts);
              }}
            >
              Fetch
            </button>
            <div data-testid="result">{result ? result.length.toString() : 'null'}</div>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestManualFetch />
        </ContextsProvider>,
      );

      // WHEN: They try to fetch contexts
      const fetchButton = screen.getByTestId('fetch');
      fetchButton.click();

      // THEN: Returns empty array (not authenticated)
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('0');
      });
    });
  });

  describe('Empty States', () => {
    test('handles environment with no contexts gracefully', async () => {
      // GIVEN: Environment exists but has no contexts yet
      mockGetContexts.mockResolvedValue(createContextsResponse([]));

      // WHEN: Contexts are loaded
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: Shows no contexts (but doesn't error)
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    test('handles null response from API gracefully', async () => {
      // GIVEN: API returns null
      mockGetContexts.mockResolvedValue(null);

      // WHEN: Contexts are loaded
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: Shows no contexts (but doesn't error)
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });

    test('handles response without items gracefully', async () => {
      // GIVEN: API returns response without items array
      mockGetContexts.mockResolvedValue({});

      // WHEN: Contexts are loaded
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: Shows no contexts (but doesn't error)
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });
  });

  describe('Context Hook - useContextsContext', () => {
    test('throws error when used without ContextsProvider', () => {
      // GIVEN: Component uses context without provider
      const TestDefault = () => {
        const { contexts, loading } = useContextsContext();
        return (
          <div>
            <div data-testid="default-contexts">{contexts.length}</div>
            <div data-testid="default-loading">{loading.toString()}</div>
          </div>
        );
      };

      // WHEN: Rendered without ContextsProvider
      // THEN: Should throw an error
      expect(() => {
        render(<TestDefault />);
      }).toThrow('useContextsContext must be used within a ContextsProvider');
    });
  });

  describe('Loading State Management', () => {
    test('properly manages loading state through fetch lifecycle', async () => {
      // GIVEN: Contexts take time to load
      let resolveContexts: any;
      const contextsPromise = new Promise((resolve) => {
        resolveContexts = resolve;
      });
      mockGetContexts.mockReturnValue(contextsPromise);

      // WHEN: Provider starts loading
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: Loading is true
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('true');
      });

      // WHEN: Contexts finish loading
      resolveContexts(createContextsResponse([{ kind: 'user', key: 'user-1', name: 'User One' }]));

      // THEN: Loading becomes false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // AND: Contexts are available
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });
    });
  });

  describe('Multi-kind Contexts', () => {
    test('handles multiple context kinds correctly', async () => {
      // GIVEN: Environment has multiple context kinds
      mockGetContexts.mockResolvedValue(
        createContextsResponse([
          { kind: 'user', key: 'user-1', name: 'User One' },
          { kind: 'organization', key: 'org-1', name: 'Organization One' },
          { kind: 'device', key: 'device-1', name: 'Device One' },
          { kind: 'user', key: 'user-2', name: 'User Two', anonymous: true },
        ]),
      );

      // WHEN: Contexts are loaded
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: All context kinds are loaded
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('4');
      });

      expect(screen.getByTestId('context-user-user-1')).toHaveTextContent('User One');
      expect(screen.getByTestId('context-organization-org-1')).toHaveTextContent('Organization One');
      expect(screen.getByTestId('context-device-device-1')).toHaveTextContent('Device One');
      expect(screen.getByTestId('context-user-user-2')).toHaveTextContent('User Two');
    });
  });

  describe('Integration - Real World Scenarios', () => {
    test('handles complete authentication -> project selection -> environment selection -> contexts loading flow', async () => {
      // GIVEN: API is not ready
      (useAuthContext as any).mockReturnValue({ authenticated: false });
      (useProjectContext as any).mockReturnValue({ projectKey: '' });
      (useEnvironmentContext as any).mockReturnValue({ environment: '' });
      (useApi as any).mockReturnValue({ getContexts: mockGetContexts, apiReady: false });

      const { rerender } = render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // No contexts loaded yet
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');

      // WHEN: User authenticates
      (useAuthContext as any).mockReturnValue({ authenticated: true });
      (useApi as any).mockReturnValue({ getContexts: mockGetContexts, apiReady: true });

      rerender(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // Still no contexts (no project/environment)
      await waitFor(() => {
        expect(mockGetContexts).not.toHaveBeenCalled();
      });

      // WHEN: Project is selected
      (useProjectContext as any).mockReturnValue({ projectKey: 'my-project' });

      rerender(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // Still no contexts (no environment)
      await waitFor(() => {
        expect(mockGetContexts).not.toHaveBeenCalled();
      });

      // WHEN: Environment is selected
      (useEnvironmentContext as any).mockReturnValue({ environment: 'production' });
      mockGetContexts.mockResolvedValue(
        createContextsResponse([
          { kind: 'user', key: 'user-1', name: 'User One' },
          { kind: 'user', key: 'user-2', name: 'User Two' },
          { kind: 'organization', key: 'org-1', name: 'Organization One' },
        ]),
      );

      rerender(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      // THEN: Contexts are loaded
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('3');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });
  });
});
