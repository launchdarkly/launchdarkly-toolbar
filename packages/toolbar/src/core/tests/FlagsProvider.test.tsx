import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { FlagsProvider, useFlagsContext } from '../ui/Toolbar/context/FlagsProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock the dependencies
vi.mock('../ui/Toolbar/context/ProjectProvider', () => ({
  useProjectContext: vi.fn(),
}));

vi.mock('../ui/Toolbar/context/ApiProvider', () => ({
  useApi: vi.fn(),
}));

vi.mock('../ui/Toolbar/context/AuthProvider', () => ({
  useAuthContext: vi.fn(),
}));

vi.mock('../ui/Toolbar/context/SearchProvider', () => ({
  useSearchContext: vi.fn(() => ({
    searchTerm: '',
    debouncedSearchTerm: '',
    setSearchTerm: vi.fn(),
  })),
}));

vi.mock('../ui/Toolbar/context/ActiveTabProvider', () => ({
  ActiveTabProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useActiveTabContext: vi.fn(() => ({
    activeTab: 'flag-sdk', // Default to flag tab active for tests
    setActiveTab: vi.fn(),
  })),
}));

import { useProjectContext } from '../ui/Toolbar/context/ProjectProvider';
import { useApi } from '../ui/Toolbar/context/ApiProvider';
import { useAuthContext } from '../ui/Toolbar/context/AuthProvider';
import { useActiveTabContext } from '../ui/Toolbar/context/ActiveTabProvider';
import { ActiveTabProvider } from '../ui/Toolbar/context/ActiveTabProvider';

// Test component
function TestConsumer() {
  const { flags, loading } = useFlagsContext();

  return (
    <div>
      <div data-testid="flags-count">{flags.length}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      {flags.map((flag) => (
        <div key={flag.key} data-testid={`flag-${flag.key}`}>
          {flag.name}
        </div>
      ))}
    </div>
  );
}

// Wrapper for tests
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ActiveTabProvider>{children}</ActiveTabProvider>;
}

// Helper to create proper paginated response
function createPaginatedResponse(items: any[], hasMore = false) {
  return {
    items,
    totalCount: items.length,
    ...(hasMore && { _links: { next: { href: '/next' } } }),
  };
}

describe('FlagsProvider', () => {
  const mockGetFlags = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useAuthContext as any).mockReturnValue({
      authenticated: true,
    });

    (useProjectContext as any).mockReturnValue({
      projectKey: 'test-project',
    });

    (useApi as any).mockReturnValue({
      getFlags: mockGetFlags,
      apiReady: true,
    });
  });

  describe('Flags Loading - Developer Workflow', () => {
    test('automatically fetches flags when project is selected', async () => {
      // GIVEN: Developer has selected a project
      mockGetFlags.mockResolvedValue(
        createPaginatedResponse([
          { key: 'feature-1', name: 'Feature 1', kind: 'boolean' },
          { key: 'feature-2', name: 'Feature 2', kind: 'multivariate' },
        ]),
      );

      // WHEN: FlagsProvider initializes
      render(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // THEN: Shows loading state initially
      expect(screen.getByTestId('loading')).toHaveTextContent('true');

      // AND: Eventually loads the flags
      await waitFor(() => {
        expect(screen.getByTestId('flags-count')).toHaveTextContent('2');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // AND: All flags are available
      expect(screen.getByTestId('flag-feature-1')).toHaveTextContent('Feature 1');
      expect(screen.getByTestId('flag-feature-2')).toHaveTextContent('Feature 2');
    });

    test('does not fetch flags when API is not ready', async () => {
      // GIVEN: API is not ready
      (useApi as any).mockReturnValue({
        apiReady: false,
      });

      // WHEN: Provider tries to initialize
      render(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // THEN: No API call is made
      await waitFor(() => {
        expect(mockGetFlags).not.toHaveBeenCalled();
      });

      // AND: No flags are shown
      expect(screen.getByTestId('flags-count')).toHaveTextContent('0');
    });

    test('does not fetch flags when API is not ready', async () => {
      // GIVEN: API iframe hasn't loaded yet
      (useApi as any).mockReturnValue({
        getFlags: mockGetFlags,
        apiReady: false,
      });

      // WHEN: Provider tries to initialize
      render(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // THEN: Waits for API to be ready
      await waitFor(() => {
        expect(mockGetFlags).not.toHaveBeenCalled();
      });
    });

    test('shows loading state when no project is selected yet', async () => {
      // GIVEN: Project hasn't been selected/loaded yet
      (useProjectContext as any).mockReturnValue({
        projectKey: '', // Empty!
      });

      // WHEN: Provider initializes
      render(
        <FlagsProvider>
          <TestConsumer />
        </FlagsProvider>,
      );

      // THEN: Shows loading (waiting for project)
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('true');
      });
    });
  });

  describe('Project Switching - Dynamic Updates', () => {
    test('refetches flags when project changes', async () => {
      // GIVEN: Developer is viewing flags for project-1
      mockGetFlags.mockResolvedValue(createPaginatedResponse([{ key: 'flag-a', name: 'Flag A', kind: 'boolean' }]));

      const { rerender } = render(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('flags-count')).toHaveTextContent('1');
      });

      // WHEN: They switch to project-2
      (useProjectContext as any).mockReturnValue({
        projectKey: 'project-2',
      });

      mockGetFlags.mockResolvedValue(
        createPaginatedResponse([
          { key: 'flag-x', name: 'Flag X', kind: 'boolean' },
          { key: 'flag-y', name: 'Flag Y', kind: 'boolean' },
        ]),
      );

      rerender(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // THEN: New flags are loaded for project-2
      await waitFor(() => {
        expect(screen.getByTestId('flags-count')).toHaveTextContent('2');
      });
    });
  });

  describe('Manual Flag Fetching', () => {
    test('allows manual flag fetching for specific projects', async () => {
      // GIVEN: Developer wants to fetch flags for a different project temporarily
      mockGetFlags.mockResolvedValue(
        createPaginatedResponse([{ key: 'default-flag', name: 'Default Flag', kind: 'boolean' }]),
      );

      const TestWithManualFetch = () => {
        const { getProjectFlags } = useFlagsContext();
        const [customFlags, setCustomFlags] = React.useState<any[]>([]);

        return (
          <div>
            <button
              data-testid="fetch-custom"
              onClick={async () => {
                const flags = await getProjectFlags('other-project');
                setCustomFlags(flags);
              }}
            >
              Fetch Custom
            </button>
            <div data-testid="custom-flags-count">{customFlags.length}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <FlagsProvider>
            <TestWithManualFetch />
          </FlagsProvider>
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('fetch-custom')).toBeInTheDocument();
      });

      // WHEN: They manually fetch flags for another project
      const fetchButton = screen.getByTestId('fetch-custom');
      mockGetFlags.mockResolvedValue(
        createPaginatedResponse([
          { key: 'custom-1', name: 'Custom 1', kind: 'boolean' },
          { key: 'custom-2', name: 'Custom 2', kind: 'boolean' },
        ]),
      );

      fetchButton.click();

      // THEN: Custom flags are retrieved
      await waitFor(() => {
        expect(mockGetFlags).toHaveBeenCalledWith('other-project', {
          limit: 20,
          offset: 0,
          query: '',
        });
      });
    });

    test('returns empty array when fetching flags when API is not ready', async () => {
      // GIVEN: API is not ready
      (useApi as any).mockReturnValue({
        apiReady: false,
      });

      const TestManualFetch = () => {
        const { getProjectFlags } = useFlagsContext();
        const [result, setResult] = React.useState<any[] | null>(null);

        return (
          <div>
            <button
              data-testid="fetch"
              onClick={async () => {
                const flags = await getProjectFlags('some-project');
                setResult(flags);
              }}
            >
              Fetch
            </button>
            <div data-testid="result">{result ? result.length.toString() : 'null'}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <FlagsProvider>
            <TestManualFetch />
          </FlagsProvider>
        </TestWrapper>,
      );

      // WHEN: They try to fetch flags
      const fetchButton = screen.getByTestId('fetch');
      fetchButton.click();

      // THEN: Returns empty array (no authentication)
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('0');
      });
    });

    test('returns empty array when fetching flags without API ready', async () => {
      // GIVEN: API is not ready
      (useApi as any).mockReturnValue({
        apiReady: false,
      });

      const TestManualFetch = () => {
        const { getProjectFlags } = useFlagsContext();
        const [result, setResult] = React.useState<any[] | null>(null);

        return (
          <div>
            <button
              data-testid="fetch"
              onClick={async () => {
                const flags = await getProjectFlags('some-project');
                setResult(flags);
              }}
            >
              Fetch
            </button>
            <div data-testid="result">{result ? result.length.toString() : 'null'}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <FlagsProvider>
            <TestManualFetch />
          </FlagsProvider>
        </TestWrapper>,
      );

      // WHEN: They try to fetch flags
      const fetchButton = screen.getByTestId('fetch');
      fetchButton.click();

      // THEN: Returns empty array (no authentication)
      await waitFor(() => {
        expect(screen.getByTestId('result')).toHaveTextContent('0');
      });
    });
  });

  describe('Empty States', () => {
    test('handles project with no flags gracefully', async () => {
      // GIVEN: Project exists but has no feature flags yet
      mockGetFlags.mockResolvedValue(createPaginatedResponse([]));

      // WHEN: Flags are loaded
      render(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // THEN: Shows no flags (but doesn't error)
      await waitFor(() => {
        expect(screen.getByTestId('flags-count')).toHaveTextContent('0');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });
  });

  describe('Context Hook - useFlagsContext', () => {
    test('provides default values when used without FlagsProvider', () => {
      // GIVEN: Component uses context without provider
      const TestDefault = () => {
        const { flags, loading } = useFlagsContext();
        return (
          <div>
            <div data-testid="default-flags">{flags.length}</div>
            <div data-testid="default-loading">{loading.toString()}</div>
          </div>
        );
      };

      // WHEN: Rendered without FlagsProvider uses default context value
      render(
        <TestWrapper>
          <TestDefault />
        </TestWrapper>,
      );

      // THEN: Uses default values from context creation
      expect(screen.getByTestId('default-flags')).toHaveTextContent('0');
      expect(screen.getByTestId('default-loading')).toHaveTextContent('true');
    });
  });

  describe('Active Tab Optimization', () => {
    test('only fetches flags when a flag tab is active', async () => {
      // GIVEN: Settings tab is active (not a flag tab)
      (useActiveTabContext as any).mockReturnValue({
        activeTab: 'settings',
        setActiveTab: vi.fn(),
      });

      mockGetFlags.mockResolvedValue(createPaginatedResponse([{ key: 'flag-1', name: 'Flag 1', kind: 'boolean' }]));

      // WHEN: Provider initializes
      render(
        <FlagsProvider>
          <TestConsumer />
        </FlagsProvider>,
      );

      // THEN: No API call is made (tab is not active)
      await waitFor(() => {
        expect(mockGetFlags).not.toHaveBeenCalled();
      });

      // AND: No flags are loaded
      expect(screen.getByTestId('flags-count')).toHaveTextContent('0');
    });

    test('fetches flags when flag-sdk tab is active', async () => {
      // GIVEN: Flag SDK tab is active
      (useActiveTabContext as any).mockReturnValue({
        activeTab: 'flag-sdk',
        setActiveTab: vi.fn(),
      });

      mockGetFlags.mockResolvedValue(createPaginatedResponse([{ key: 'flag-1', name: 'Flag 1', kind: 'boolean' }]));

      // WHEN: Provider initializes
      render(
        <FlagsProvider>
          <TestConsumer />
        </FlagsProvider>,
      );

      // THEN: Flags are fetched
      await waitFor(() => {
        expect(mockGetFlags).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId('flags-count')).toHaveTextContent('1');
      });
    });

    test('fetches flags when flag-dev-server tab is active', async () => {
      // GIVEN: Flag dev-server tab is active
      (useActiveTabContext as any).mockReturnValue({
        activeTab: 'flag-dev-server',
        setActiveTab: vi.fn(),
      });

      mockGetFlags.mockResolvedValue(createPaginatedResponse([{ key: 'flag-1', name: 'Flag 1', kind: 'boolean' }]));

      // WHEN: Provider initializes
      render(
        <FlagsProvider>
          <TestConsumer />
        </FlagsProvider>,
      );

      // THEN: Flags are fetched
      await waitFor(() => {
        expect(mockGetFlags).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId('flags-count')).toHaveTextContent('1');
      });
    });
  });

  describe('Loading State Management', () => {
    test('properly manages loading state through fetch lifecycle', async () => {
      // GIVEN: Flags take time to load
      let resolveFlags: any;
      const flagsPromise = new Promise((resolve) => {
        resolveFlags = resolve;
      });
      mockGetFlags.mockReturnValue(flagsPromise);

      // WHEN: Provider starts loading
      render(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // THEN: Loading is true
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('true');
      });

      // WHEN: Flags finish loading
      resolveFlags(createPaginatedResponse([{ key: 'flag-1', name: 'Flag 1', kind: 'boolean' }]));

      // THEN: Loading becomes false
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });

      // AND: Flags are available
      await waitFor(() => {
        expect(screen.getByTestId('flags-count')).toHaveTextContent('1');
      });
    });
  });

  describe('Integration - Real World Scenarios', () => {
    test('handles complete authentication -> project selection -> flags loading flow', async () => {
      // GIVEN: API is not ready
      (useAuthContext as any).mockReturnValue({ authenticated: false });
      (useProjectContext as any).mockReturnValue({ projectKey: '' });
      (useApi as any).mockReturnValue({ getFlags: mockGetFlags, apiReady: false });

      const { rerender } = render(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // No flags loaded yet
      expect(screen.getByTestId('flags-count')).toHaveTextContent('0');

      // WHEN: User authenticates
      (useAuthContext as any).mockReturnValue({ authenticated: true });
      (useApi as any).mockReturnValue({ getFlags: mockGetFlags, apiReady: true });

      rerender(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // Still waiting for project
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('true');
      });

      // WHEN: Project is selected
      (useProjectContext as any).mockReturnValue({ projectKey: 'my-project' });
      mockGetFlags.mockResolvedValue(
        createPaginatedResponse([
          { key: 'feature-1', name: 'Feature 1', kind: 'boolean' },
          { key: 'feature-2', name: 'Feature 2', kind: 'multivariate' },
          { key: 'feature-3', name: 'Feature 3', kind: 'boolean' },
        ]),
      );

      rerender(
        <TestWrapper>
          <FlagsProvider>
            <TestConsumer />
          </FlagsProvider>
        </TestWrapper>,
      );

      // THEN: Flags are loaded
      await waitFor(() => {
        expect(screen.getByTestId('flags-count')).toHaveTextContent('3');
      });

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });
  });
});
