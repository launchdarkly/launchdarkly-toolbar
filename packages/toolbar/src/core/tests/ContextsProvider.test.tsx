import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { ContextsProvider, useContextsContext } from '../ui/Toolbar/context/api/ContextsProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { Context } from '../ui/Toolbar/types/ldApi';
import { loadContexts, saveContexts } from '../ui/Toolbar/utils/localStorage';

// Mock localStorage utilities
vi.mock('../ui/Toolbar/utils/localStorage', () => ({
  loadContexts: vi.fn(() => []),
  saveContexts: vi.fn(),
}));

// Mock the useCurrentSdkContext hook
const mockIsCurrentContext = vi.fn((_context: any, _kind: string, _key: string) => false);
vi.mock('../ui/Toolbar/context/state/useCurrentSdkContext', () => ({
  useCurrentSdkContext: vi.fn(() => null),
  isCurrentContext: (context: any, kind: string, key: string) => mockIsCurrentContext(context, kind, key),
}));

// Mock the usePlugins hook
vi.mock('../ui/Toolbar/context/state/PluginsProvider', () => ({
  usePlugins: vi.fn(() => ({
    flagOverridePlugin: null,
    eventInterceptionPlugin: null,
    baseUrl: '',
  })),
}));

// Test component
function TestConsumer() {
  const { contexts, filter, setFilter, addContext, removeContext, isActiveContext } = useContextsContext();

  return (
    <div>
      <div data-testid="contexts-count">{contexts.length}</div>
      <div data-testid="filter">{filter}</div>
      {contexts.map((context) => (
        <div key={`${context.kind}-${context.key}`} data-testid={`context-${context.kind}-${context.key}`}>
          {context.name || context.key}
        </div>
      ))}
      <button
        data-testid="add-context"
        onClick={() => addContext({ kind: 'user', key: 'test-user', name: 'Test User' })}
      >
        Add
      </button>
      <button data-testid="remove-context" onClick={() => removeContext('user', 'test-user')}>
        Remove
      </button>
      <button data-testid="set-filter" onClick={() => setFilter('test')}>
        Set Filter
      </button>
      <div data-testid="is-active">{isActiveContext('user', 'test-user') ? 'true' : 'false'}</div>
    </div>
  );
}

describe('ContextsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (loadContexts as any).mockReturnValue([]);
    mockIsCurrentContext.mockReturnValue(false);
  });

  describe('Initialization', () => {
    test('loads contexts from localStorage on mount', () => {
      const storedContexts: Context[] = [
        { kind: 'user', key: 'user-1', name: 'User One' },
        { kind: 'organization', key: 'org-1', name: 'Org One' },
      ];
      (loadContexts as any).mockReturnValue(storedContexts);

      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      expect(screen.getByTestId('context-user-user-1')).toHaveTextContent('User One');
      expect(screen.getByTestId('context-organization-org-1')).toHaveTextContent('Org One');
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

      expect(screen.getByTestId('context-user-test-user')).toHaveTextContent('Test User');
      expect(saveContexts).toHaveBeenCalledWith([{ kind: 'user', key: 'test-user', name: 'Test User' }]);
    });

    test('does not add duplicate contexts', () => {
      const storedContexts: Context[] = [{ kind: 'user', key: 'test-user', name: 'Existing User' }];
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
        { kind: 'user', key: 'user-1', name: 'User One' },
        { kind: 'user', key: 'test-user', name: 'Test User' },
      ];
      (loadContexts as any).mockReturnValue(storedContexts);
      mockIsCurrentContext.mockReturnValue(false);

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

      expect(screen.queryByTestId('context-user-test-user')).not.toBeInTheDocument();
      expect(saveContexts).toHaveBeenCalled();
    });

    test('prevents deletion of active context', async () => {
      const storedContexts: Context[] = [
        { kind: 'user', key: 'user-1', name: 'User One' },
        { kind: 'user', key: 'test-user', name: 'Test User' },
      ];
      (loadContexts as any).mockReturnValue(storedContexts);
      // Make test-user the active context
      mockIsCurrentContext.mockImplementation((context: any, kind: string, key: string) => {
        return kind === 'user' && key === 'test-user';
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');

      const removeButton = screen.getByTestId('remove-context');
      removeButton.click();

      // Wait a bit to ensure the function has been called
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Cannot delete active context');
      });

      // Context should still be in the list
      expect(screen.getByTestId('contexts-count')).toHaveTextContent('2');
      expect(screen.getByTestId('context-user-test-user')).toBeInTheDocument();
      // saveContexts should not have been called
      expect(saveContexts).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Filtering', () => {
    test('filters contexts by key, kind, or name', async () => {
      const storedContexts: Context[] = [
        { kind: 'user', key: 'user-1', name: 'John Doe' },
        { kind: 'organization', key: 'org-1', name: 'Acme Corp' },
        { kind: 'user', key: 'user-2', name: 'Jane Smith' },
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
        { kind: 'user', key: 'user-1', name: 'User One' },
        { kind: 'user', key: 'user-2', name: 'User Two' },
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
    test('correctly identifies active context', () => {
      mockIsCurrentContext.mockReturnValue(true);

      render(
        <ContextsProvider>
          <TestConsumer />
        </ContextsProvider>,
      );

      expect(screen.getByTestId('is-active')).toHaveTextContent('true');
    });

    test('returns false for non-active context', () => {
      mockIsCurrentContext.mockReturnValue(false);

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
    test('sorts contexts to put active context first', () => {
      const storedContexts: Context[] = [
        { kind: 'user', key: 'user-1', name: 'User One' },
        { kind: 'user', key: 'user-2', name: 'User Two' },
        { kind: 'user', key: 'user-3', name: 'User Three' },
      ];
      (loadContexts as any).mockReturnValue(storedContexts);

      // Make user-2 active - note: the implementation passes name (not key) to isActiveContext
      // So isActiveContext calls isCurrentContext(kind, name), meaning we need to match by name
      mockIsCurrentContext.mockImplementation((context: any, kind: string, key: string) => {
        // The implementation calls isActiveContext(a.kind, a.name || '')
        // which calls isCurrentContext(currentSdkContext, kind, name)
        // So 'key' parameter here is actually the name from the context
        return kind === 'user' && key === 'User Two';
      });

      const TestWithSorting = () => {
        const { contexts } = useContextsContext();
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

      // Active context (user-2 with name 'User Two') should be first
      expect(screen.getByTestId('context-0')).toHaveTextContent('user-2');
    });
  });
});
