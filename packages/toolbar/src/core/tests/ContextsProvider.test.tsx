import { render, screen, waitFor, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import type { LDContext } from 'launchdarkly-js-client-sdk';
import { ContextsProvider, useContextsContext } from '../ui/Toolbar/context/api/ContextsProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { loadContexts, saveContexts, loadActiveContext } from '../ui/Toolbar/utils/localStorage';
import { generateContextId, getContextKey, getContextDisplayName } from '../ui/Toolbar/utils/context';

// Helper to create test contexts (LDContext format)
function createTestContext(overrides: { kind: string; key?: string; name?: string; anonymous?: boolean }): LDContext {
  return {
    kind: overrides.kind,
    key: overrides.key || '',
    ...(overrides.name && { name: overrides.name }),
    ...(overrides.anonymous && { anonymous: overrides.anonymous }),
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

  const isActive = (contextId: string) => {
    if (!activeContext) return false;
    return generateContextId(activeContext) === contextId;
  };

  return (
    <div>
      <div data-testid="contexts-count">{contexts.length}</div>
      <div data-testid="filter">{filter}</div>
      {contexts.map((context) => {
        const contextId = generateContextId(context);
        const contextKey = getContextKey(context);
        const displayName = getContextDisplayName(context);
        if (!testContextIdRef.current && contextKey === 'test-user') {
          testContextIdRef.current = contextId;
        }
        return (
          <div key={contextId} data-testid={`context-${contextId}`}>
            {displayName}
          </div>
        );
      })}
      <button
        data-testid="add-context"
        onClick={() => addContext({ kind: 'user', key: 'test-user', name: 'Test User' })}
      >
        Add
      </button>
      <button
        data-testid="remove-context"
        onClick={() => {
          const contextToRemove = contexts.find((c) => getContextKey(c) === 'test-user');
          if (contextToRemove) {
            removeContext(generateContextId(contextToRemove));
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
      const storedContexts: LDContext[] = [
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
      expect(screen.getByTestId(`context-${generateContextId(storedContexts[0])}`)).toHaveTextContent('User One');
      expect(screen.getByTestId(`context-${generateContextId(storedContexts[1])}`)).toHaveTextContent('Org One');
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
    });

    test('does not add duplicate contexts', () => {
      const storedContexts: LDContext[] = [
        createTestContext({ kind: 'user', key: 'test-user', name: 'Existing User' }),
      ];
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
      const storedContexts: LDContext[] = [
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

      expect(screen.queryByTestId(`context-${generateContextId(storedContexts[1])}`)).not.toBeInTheDocument();
      expect(saveContexts).toHaveBeenCalled();
    });

    test('prevents deletion of active context', async () => {
      const storedContexts: LDContext[] = [
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

        const activeContextId = activeContext ? generateContextId(activeContext) : null;
        const storedContextId = generateContextId(storedContexts[1]);

        return (
          <div>
            <div data-testid="contexts-count">{contexts.length}</div>
            {contexts.map((context) => {
              const contextId = generateContextId(context);
              return (
                <div key={contextId} data-testid={`context-${contextId}`}>
                  {getContextDisplayName(context)}
                </div>
              );
            })}
            <button
              data-testid="remove-context"
              onClick={() => {
                const contextToRemove = contexts.find((c) => getContextKey(c) === 'test-user');
                if (contextToRemove) {
                  removeContext(generateContextId(contextToRemove));
                }
              }}
            >
              Remove
            </button>
            <div data-testid="active-context">{activeContextId === storedContextId ? 'active' : 'inactive'}</div>
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
      expect(screen.getByTestId(`context-${generateContextId(storedContexts[1])}`)).toBeInTheDocument();
      // saveContexts should not have been called
      expect(saveContexts).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Filtering', () => {
    test('filters contexts by key, kind, or name', async () => {
      const storedContexts: LDContext[] = [
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
      const storedContexts: LDContext[] = [
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
      const storedContexts: LDContext[] = [createTestContext({ kind: 'user', key: 'test-user', name: 'Test User' })];
      (loadContexts as any).mockReturnValue(storedContexts);

      const TestWithActiveContext = () => {
        const { activeContext, setContext } = useContextsContext();
        React.useEffect(() => {
          // Set the context as active
          setContext(storedContexts[0]);
        }, [setContext]);

        const activeContextId = activeContext ? generateContextId(activeContext) : null;
        const storedContextId = generateContextId(storedContexts[0]);

        return (
          <div>
            <div data-testid="is-active">{activeContextId === storedContextId ? 'true' : 'false'}</div>
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
      const storedContexts: LDContext[] = [
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
              <div key={getContextKey(ctx)} data-testid={`context-${idx}`}>
                {getContextKey(ctx)}
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

  describe('Multi-kind Context Support', () => {
    test('adds a multi-kind context', async () => {
      const TestMultiKind = () => {
        const { contexts, addContext } = useContextsContext();
        return (
          <div>
            <div data-testid="contexts-count">{contexts.length}</div>
            <button
              data-testid="add-multi-kind"
              onClick={() =>
                addContext({
                  kind: 'multi',
                  user: { key: 'user-123', name: 'Test User' },
                  organization: { key: 'org-456', name: 'Test Org' },
                } as LDContext)
              }
            >
              Add Multi-kind
            </button>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestMultiKind />
        </ContextsProvider>,
      );

      screen.getByTestId('add-multi-kind').click();

      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });

      const savedContexts = (saveContexts as any).mock.calls[0][0];
      expect(savedContexts[0].kind).toBe('multi');
      expect(savedContexts[0].user.key).toBe('user-123');
      expect(savedContexts[0].organization.key).toBe('org-456');
    });

    test('filters multi-kind contexts by nested context name', async () => {
      const multiKindContext: LDContext = {
        kind: 'multi',
        user: { key: 'user-123', name: 'John Doe' },
        organization: { key: 'org-456', name: 'Acme Corp' },
      };
      (loadContexts as any).mockReturnValue([multiKindContext]);

      const TestFilterMultiKind = () => {
        const { contexts, setFilter } = useContextsContext();
        return (
          <div>
            <div data-testid="contexts-count">{contexts.length}</div>
            <button data-testid="filter-john" onClick={() => setFilter('John')}>
              Filter John
            </button>
            <button data-testid="filter-acme" onClick={() => setFilter('Acme')}>
              Filter Acme
            </button>
            <button data-testid="filter-none" onClick={() => setFilter('NonExistent')}>
              Filter None
            </button>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestFilterMultiKind />
        </ContextsProvider>,
      );

      // Initial state - should show the multi-kind context
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');

      // Filter by first nested context name (John) - should match via display name
      screen.getByTestId('filter-john').click();
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });

      // Filter by something that doesn't match
      screen.getByTestId('filter-none').click();
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('0');
      });
    });
  });

  describe('Hash-based Context Comparison', () => {
    test('treats contexts with same properties as duplicates', async () => {
      const TestDuplicateDetection = () => {
        const { contexts, addContext } = useContextsContext();
        return (
          <div>
            <div data-testid="contexts-count">{contexts.length}</div>
            <button
              data-testid="add-context-1"
              onClick={() => addContext({ kind: 'user', key: 'same-key', name: 'Same Name' })}
            >
              Add Context 1
            </button>
            <button
              data-testid="add-context-2"
              onClick={() => addContext({ kind: 'user', key: 'same-key', name: 'Same Name' })}
            >
              Add Context 2
            </button>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestDuplicateDetection />
        </ContextsProvider>,
      );

      // Add first context
      screen.getByTestId('add-context-1').click();
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });

      // Try to add duplicate - should not increase count
      screen.getByTestId('add-context-2').click();
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
    });

    test('distinguishes contexts with different attributes', async () => {
      const TestDistinctContexts = () => {
        const { contexts, addContext } = useContextsContext();
        return (
          <div>
            <div data-testid="contexts-count">{contexts.length}</div>
            <button
              data-testid="add-context-with-name"
              onClick={() => addContext({ kind: 'user', key: 'user-123', name: 'With Name' })}
            >
              Add With Name
            </button>
            <button
              data-testid="add-context-without-name"
              onClick={() => addContext({ kind: 'user', key: 'user-123' })}
            >
              Add Without Name
            </button>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestDistinctContexts />
        </ContextsProvider>,
      );

      // Add context with name
      screen.getByTestId('add-context-with-name').click();
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });

      // Add context without name - should be treated as different (different hash)
      screen.getByTestId('add-context-without-name').click();
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      });
    });

    test('updates context correctly using hash-based ID', async () => {
      const storedContexts: LDContext[] = [createTestContext({ kind: 'user', key: 'user-1', name: 'Original Name' })];
      (loadContexts as any).mockReturnValue(storedContexts);

      const TestUpdateContext = () => {
        const { contexts, updateContext } = useContextsContext();
        const firstContext = contexts[0];

        return (
          <div>
            <div data-testid="context-name">{firstContext ? getContextDisplayName(firstContext) : 'none'}</div>
            <button
              data-testid="update-context"
              onClick={() => {
                if (firstContext) {
                  updateContext(generateContextId(firstContext), { kind: 'user', key: 'user-1', name: 'Updated Name' });
                }
              }}
            >
              Update
            </button>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestUpdateContext />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('context-name')).toHaveTextContent('Original Name');

      screen.getByTestId('update-context').click();

      await waitFor(() => {
        expect(screen.getByTestId('context-name')).toHaveTextContent('Updated Name');
      });

      expect(saveContexts).toHaveBeenCalled();
    });
  });

  describe('LDContext Format Compliance', () => {
    test('stores context in LDContext format without custom id field', async () => {
      const TestLDContextFormat = () => {
        const { addContext } = useContextsContext();
        return (
          <button
            data-testid="add-context"
            onClick={() => addContext({ kind: 'user', key: 'user-123', name: 'Test User' })}
          >
            Add
          </button>
        );
      };

      render(
        <ContextsProvider>
          <TestLDContextFormat />
        </ContextsProvider>,
      );

      screen.getByTestId('add-context').click();

      await waitFor(() => {
        expect(saveContexts).toHaveBeenCalled();
      });

      const savedContexts = (saveContexts as any).mock.calls[0][0];
      expect(savedContexts[0]).toEqual({
        kind: 'user',
        key: 'user-123',
        name: 'Test User',
      });
      // Should NOT have a custom 'id' field
      expect(savedContexts[0].id).toBeUndefined();
    });

    test('handles contexts with various optional attributes', async () => {
      const TestOptionalAttributes = () => {
        const { addContext, contexts } = useContextsContext();
        return (
          <div>
            <div data-testid="contexts-count">{contexts.length}</div>
            <button
              data-testid="add-anonymous"
              onClick={() => addContext({ kind: 'user', key: 'anon-user', anonymous: true })}
            >
              Add Anonymous
            </button>
            <button
              data-testid="add-with-custom"
              onClick={() =>
                addContext({
                  kind: 'user',
                  key: 'custom-user',
                  name: 'Custom User',
                  email: 'test@example.com',
                  custom: { tier: 'premium' },
                } as LDContext)
              }
            >
              Add Custom
            </button>
          </div>
        );
      };

      render(
        <ContextsProvider>
          <TestOptionalAttributes />
        </ContextsProvider>,
      );

      screen.getByTestId('add-anonymous').click();
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('1');
      });

      screen.getByTestId('add-with-custom').click();
      await waitFor(() => {
        expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      });

      // Check that both were saved with their attributes
      const lastCall = (saveContexts as any).mock.calls[(saveContexts as any).mock.calls.length - 1][0];
      const anonymousContext = lastCall.find((c: LDContext) => getContextKey(c) === 'anon-user');
      const customContext = lastCall.find((c: LDContext) => getContextKey(c) === 'custom-user');

      expect(anonymousContext.anonymous).toBe(true);
      expect(customContext.email).toBe('test@example.com');
    });
  });
});
