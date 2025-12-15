import { render, screen, waitFor, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { ContextsProvider, useContextsContext } from '../ui/Toolbar/context/api/ContextsProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { Context } from '../ui/Toolbar/types/ldApi';
import { loadContexts, saveContexts, loadActiveContext } from '../ui/Toolbar/utils/localStorage';

// Helper to create test contexts with ids
function createTestContext(overrides: Partial<Context> & { kind: string; key?: string; name: string }): Context {
  return {
    id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    kind: overrides.kind,
    key: overrides.key,
    name: overrides.name,
    anonymous: overrides.anonymous,
  };
}

// Mock localStorage utilities
vi.mock('../ui/Toolbar/utils/localStorage', () => ({
  loadContexts: vi.fn(() => []),
  saveContexts: vi.fn(),
  loadActiveContext: vi.fn(() => null),
  saveActiveContext: vi.fn(),
}));

// Mock the usePlugins hook with LD client
// Note: We need to create the mock client inside the factory to avoid hoisting issues
vi.mock('../ui/Toolbar/context/state/PluginsProvider', () => {
  const mockClient = {
    identify: vi.fn().mockResolvedValue(undefined),
    getContext: vi.fn(() => null), // Return null to prevent auto-adding contexts in tests
    on: vi.fn(),
    off: vi.fn(),
  };

  return {
    usePlugins: () => ({
      flagOverridePlugin: {
        getClient: () => mockClient,
      },
      eventInterceptionPlugin: null,
      baseUrl: '',
    }),
  };
});

// Mock analytics
vi.mock('../ui/Toolbar/context/telemetry/AnalyticsProvider', () => ({
  useAnalytics: vi.fn().mockReturnValue({
    trackContextAdded: vi.fn(),
    trackContextRemoved: vi.fn(),
    trackContextUpdated: vi.fn(),
    trackContextSelected: vi.fn(),
    trackContextEditStarted: vi.fn(),
    trackContextEditCancelled: vi.fn(),
    trackContextKeyCopy: vi.fn(),
  }),
}));

// Test component
function TestConsumer() {
  const { contexts, filter, setFilter, addContext, removeContext, activeContext } = useContextsContext();
  const testContextIdRef = React.useRef<string | null>(null);

  const isActive = (id: string) => {
    return activeContext?.id === id;
  };

  return (
    <div>
      <div data-testid="contexts-count">{contexts.length}</div>
      <div data-testid="filter">{filter}</div>
      {contexts.map((context) => {
        if (!testContextIdRef.current && context.key === 'test-user') {
          testContextIdRef.current = context.id;
        }
        return (
          <div key={context.id} data-testid={`context-${context.id}`}>
            {context.name || context.key}
          </div>
        );
      })}
      <button
        data-testid="add-context"
        onClick={() => addContext({ id: 'test-context-id', kind: 'user', key: 'test-user', name: 'Test User' })}
      >
        Add
      </button>
      <button
        data-testid="remove-context"
        onClick={() => {
          const contextToRemove = contexts.find((c) => c.key === 'test-user');
          if (contextToRemove) {
            removeContext(contextToRemove.id);
          }
        }}
      >
        Remove
      </button>
      <button data-testid="set-filter" onClick={() => setFilter('test')}>
        Set Filter
      </button>
      <div data-testid="is-active">
        {testContextIdRef.current && isActive(testContextIdRef.current) ? 'true' : 'false'}
      </div>
    </div>
  );
}

describe('ContextsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (loadContexts as any).mockReturnValue([]);
    (loadActiveContext as any).mockReturnValue(null);
  });

  describe('Initialization', () => {
    test('loads contexts from localStorage on mount', () => {
      const storedContexts: Context[] = [
        createTestContext({ kind: 'user', key: 'user-1', name: 'User One' }),
        createTestContext({ kind: 'organization', key: 'org-1', name: 'Org One' }),
      ];
      (loadContexts as any).mockReturnValue(storedContexts);

      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      expect(screen.getByTestId(`context-${storedContexts[0].id}`)).toHaveTextContent('User One');
      expect(screen.getByTestId(`context-${storedContexts[1].id}`)).toHaveTextContent('Org One');
    });

    test('starts with empty list when localStorage is empty', () => {
      (loadContexts as any).mockReturnValue([]);

      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
    });
  });

  describe('Adding Contexts', () => {
    test('adds a new context to the list', async () => {
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');

      const addButton = screen.getByTestId('add-context');
      addButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });

      const savedContexts = (saveContexts as any).mock.calls[0][0];
      expect(savedContexts).toHaveLength(1);
      expect(savedContexts[0].kind).toBe('user');
      expect(savedContexts[0].key).toBe('test-user');
      expect(savedContexts[0].name).toBe('Test User');
      expect(savedContexts[0].id).toBeDefined();
    });

    test('does not add duplicate contexts', () => {
      const storedContexts: Context[] = [createTestContext({ kind: 'user', key: 'test-user', name: 'Existing User' })];
      (loadContexts as any).mockReturnValue(storedContexts);

      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');

      const addButton = screen.getByTestId('add-context');
      addButton.click();

      // Should still be 1 (duplicate not added)
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
    });
  });

  describe('Removing Contexts', () => {
    test('removes a context from the list', async () => {
      const storedContexts: Context[] = [
        createTestContext({ kind: 'user', key: 'user-1', name: 'User One' }),
        createTestContext({ kind: 'user', key: 'test-user', name: 'Test User' }),
      ];
      (loadContexts as any).mockReturnValue(storedContexts);

      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');

      const removeButton = screen.getByTestId('remove-context');
      removeButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });

      expect(screen.queryByTestId(`context-${storedContexts[1].id}`)).not.toBeInTheDocument();
      expect(saveContexts).toHaveBeenCalled();
    });

    test('prevents deletion of active context', async () => {
      const storedContexts: Context[] = [
        createTestContext({ kind: 'user', key: 'user-1', name: 'User One' }),
        createTestContext({ kind: 'user', key: 'test-user', name: 'Test User' }),
      ];
      (loadContexts as any).mockReturnValue(storedContexts);

      const TestWithActiveContext = () => {
        const { contexts, removeContext, setContext, activeContext } = useContextsContext();
        React.useEffect(() => {
          // Set test-user as active
          setContext(storedContexts[1]);
        }, [setContext]);

        return (
          <div>
            <div data-testid="contexts-count">{contexts.length}</div>
            {contexts.map((context) => (
              <div key={context.id} data-testid={`context-${context.id}`}>
                {context.name || context.key}
              </div>
            ))}
            <button
              data-testid="remove-context"
              onClick={() => {
                const contextToRemove = contexts.find((c) => c.key === 'test-user');
                if (contextToRemove) {
                  removeContext(contextToRemove.id);
                }
              }}
            >
              Remove
            </button>
            <div data-testid="active-context">{activeContext?.id === storedContexts[1].id ? 'active' : 'inactive'}</div>
          </div>
        );
      };

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <ContextsProvider>
          <TestWithActiveContext />
        </ContextsProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('active-context')).toHaveTextContent('active');
      });

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');

      const removeButton = screen.getByTestId('remove-context');
      removeButton.click();

      // Wait a bit to ensure the function has been called
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Cannot delete active context');
      });

      // Context should still be in the list
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      expect(screen.getByTestId(`context-${storedContexts[1].id}`)).toBeInTheDocument();
      // saveContexts should not have been called
      expect(saveContexts).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Filtering', () => {
    test('filters contexts by key, kind, or name', async () => {
      const storedContexts: Context[] = [
        createTestContext({ kind: 'user', key: 'user-1', name: 'John Doe' }),
        createTestContext({ kind: 'organization', key: 'org-1', name: 'Acme Corp' }),
        createTestContext({ kind: 'user', key: 'user-2', name: 'Jane Smith' }),
      ];
      (loadContexts as any).mockReturnValue(storedContexts);

      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('3');

      const setFilterButton = screen.getByTestId('set-filter');
      setFilterButton.click();

      // Filter "test" should match nothing
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
      });
    });

    test('filters by key', async () => {
      const storedContexts: Context[] = [
        createTestContext({ kind: 'user', key: 'user-1', name: 'User One' }),
        createTestContext({ kind: 'user', key: 'user-2', name: 'User Two' }),
      ];
      (loadContexts as any).mockReturnValue(storedContexts);

      const TestWithFilter = () => {
        const { contexts, setFilter } = useContextsContext();
        return (
          <div>
            <div data-testid="contexts-count">{contexts.length}</div>
            <button data-testid="filter-user-1" onClick={() => setFilter('user-1')}>
              Filter
            </button>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestWithFilter />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');

      screen.getByTestId('filter-user-1').click();

      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });
    });
  });

  describe('Active Context Detection', () => {
    test('correctly identifies active context', async () => {
      const storedContexts: Context[] = [createTestContext({ kind: 'user', key: 'test-user', name: 'Test User' })];
      (loadContexts as any).mockReturnValue(storedContexts);

      const TestWithActiveContext = () => {
        const { activeContext, setContext } = useContextsContext();
        React.useEffect(() => {
          // Set the context as active
          setContext(storedContexts[0]);
        }, [setContext]);

        return (
          <div>
            <div data-testid="is-active">{activeContext?.id === storedContexts[0].id ? 'true' : 'false'}</div>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestWithActiveContext />
        </ContextsProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-active')).toHaveTextContent('true');
      });
    });

    test('returns false for non-active context', () => {
      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('is-active')).toHaveTextContent('false');
    });
  });

  describe('Context Hook - useContextsContext', () => {
    test('throws error when used without ContextsProvider', () => {
      const TestDefault = () => {
        const { contexts } = useContextsContext();
        return <div data-testid="default-contexts">{contexts.length}</div>;
      };

      expect(() => {
        render(<TestDefault />);
      }).toThrow('useContextsContext must be used within a ContextsProvider');
    });
  });

  describe('Sorting', () => {
    test('sorts contexts to put active context first', async () => {
      const storedContexts: Context[] = [
        createTestContext({ kind: 'user', key: 'user-1', name: 'User One' }),
        createTestContext({ kind: 'user', key: 'user-2', name: 'User Two' }),
        createTestContext({ kind: 'user', key: 'user-3', name: 'User Three' }),
      ];
      (loadContexts as any).mockReturnValue(storedContexts);

      const TestWithSorting = () => {
        const { contexts, setContext } = useContextsContext();
        React.useEffect(() => {
          // Set user-2 as active
          setContext(storedContexts[1]);
        }, [setContext]);

        return (
          <div>
            {contexts.map((ctx, idx) => (
              <div key={ctx.key} data-testid={`context-${idx}`}>
                {ctx.key}
              </div>
            ))}
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestWithSorting />
        </ContextsProvider>,
      );

      // Active context (user-2) should be first
      await waitFor(() => {
        expect(screen.getByTestId('context-0')).toHaveTextContent('user-2');
      });
    });
  });
});
