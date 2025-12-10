import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, beforeEach } from 'vitest';
import { TabSearchProvider, useTabSearchContext } from '../ui/Toolbar/components/new/context/TabSearchProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { SubTab } from '../ui/Toolbar/components/new/types';

// Test component that consumes the TabSearchContext
function TestConsumer() {
  const { searchTerms, setSearchTerm } = useTabSearchContext();

  return (
    <div>
      <div data-testid="flags-term">{searchTerms['flags']}</div>
      <div data-testid="contexts-term">{searchTerms['contexts']}</div>
      <div data-testid="events-term">{searchTerms['events']}</div>
      <div data-testid="general-term">{searchTerms['general']}</div>
      <div data-testid="workflows-term">{searchTerms['workflows']}</div>
      <button onClick={() => setSearchTerm('flags', 'test flag')}>Set Flags Term</button>
      <button onClick={() => setSearchTerm('contexts', 'test context')}>Set Contexts Term</button>
      <button onClick={() => setSearchTerm('events', 'test event')}>Set Events Term</button>
      <button onClick={() => setSearchTerm('general', 'test general')}>Set General Term</button>
    </div>
  );
}

// Component to test multiple updates
function MultipleUpdatesConsumer() {
  const { searchTerms, setSearchTerm } = useTabSearchContext();

  return (
    <div>
      <div data-testid="all-terms">{JSON.stringify(searchTerms)}</div>
      <button
        onClick={() => {
          setSearchTerm('flags', 'first');
          setSearchTerm('events', 'second');
          setSearchTerm('general', 'third');
        }}
      >
        Update Multiple
      </button>
    </div>
  );
}

describe('TabSearchProvider', () => {
  beforeEach(() => {
    // No setup needed for this simple context
  });

  describe('Initial State', () => {
    test('initializes with empty search terms for all subtabs', () => {
      // GIVEN: TabSearchProvider is rendered with a test consumer
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // THEN: All search terms should be empty strings
      expect(screen.getByTestId('flags-term')).toHaveTextContent('');
      expect(screen.getByTestId('contexts-term')).toHaveTextContent('');
      expect(screen.getByTestId('events-term')).toHaveTextContent('');
      expect(screen.getByTestId('general-term')).toHaveTextContent('');
      expect(screen.getByTestId('workflows-term')).toHaveTextContent('');
    });
  });

  describe('Setting Search Terms', () => {
    test('updates search term for a specific subtab', () => {
      // GIVEN: TabSearchProvider is rendered
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // WHEN: User sets a search term for flags subtab
      fireEvent.click(screen.getByText('Set Flags Term'));

      // THEN: Only the flags search term should be updated
      expect(screen.getByTestId('flags-term')).toHaveTextContent('test flag');
      expect(screen.getByTestId('events-term')).toHaveTextContent('');
      expect(screen.getByTestId('general-term')).toHaveTextContent('');
    });

    test('updates search term for contexts subtab independently', () => {
      // GIVEN: TabSearchProvider is rendered
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // WHEN: User sets a search term for contexts subtab
      fireEvent.click(screen.getByText('Set Contexts Term'));

      // THEN: Only the contexts search term should be updated
      expect(screen.getByTestId('contexts-term')).toHaveTextContent('test context');
      expect(screen.getByTestId('flags-term')).toHaveTextContent('');
      expect(screen.getByTestId('events-term')).toHaveTextContent('');
    });

    test('updates search term for events subtab independently', () => {
      // GIVEN: TabSearchProvider is rendered
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // WHEN: User sets a search term for events subtab
      fireEvent.click(screen.getByText('Set Events Term'));

      // THEN: Only the events search term should be updated
      expect(screen.getByTestId('events-term')).toHaveTextContent('test event');
      expect(screen.getByTestId('flags-term')).toHaveTextContent('');
      expect(screen.getByTestId('general-term')).toHaveTextContent('');
    });

    test('updates multiple subtabs independently', () => {
      // GIVEN: TabSearchProvider is rendered
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // WHEN: User sets search terms for multiple subtabs
      fireEvent.click(screen.getByText('Set Flags Term'));
      fireEvent.click(screen.getByText('Set Events Term'));
      fireEvent.click(screen.getByText('Set General Term'));

      // THEN: All specified subtabs should have their search terms updated
      expect(screen.getByTestId('flags-term')).toHaveTextContent('test flag');
      expect(screen.getByTestId('events-term')).toHaveTextContent('test event');
      expect(screen.getByTestId('general-term')).toHaveTextContent('test general');
    });

    test('overwrites existing search term when set again', () => {
      // GIVEN: TabSearchProvider with an existing search term
      const TestUpdater = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="flags-term">{searchTerms['flags']}</div>
            <button onClick={() => setSearchTerm('flags', 'test flag')}>Set Flags Term</button>
            <button onClick={() => setSearchTerm('flags', 'updated flag')}>Update Flags Term</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <TestUpdater />
        </TabSearchProvider>,
      );

      // WHEN: User sets a search term
      fireEvent.click(screen.getByText('Set Flags Term'));
      expect(screen.getByTestId('flags-term')).toHaveTextContent('test flag');

      // WHEN: User sets a new search term for the same subtab
      fireEvent.click(screen.getByText('Update Flags Term'));

      // THEN: The search term should be replaced with the new value
      expect(screen.getByTestId('flags-term')).toHaveTextContent('updated flag');
    });

    test('can set search term to empty string', () => {
      // GIVEN: TabSearchProvider with a search term set
      const TestClearConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="flags-term">{searchTerms['flags']}</div>
            <button onClick={() => setSearchTerm('flags', 'test')}>Set Term</button>
            <button onClick={() => setSearchTerm('flags', '')}>Clear Term</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <TestClearConsumer />
        </TabSearchProvider>,
      );

      fireEvent.click(screen.getByText('Set Term'));
      expect(screen.getByTestId('flags-term')).toHaveTextContent('test');

      // WHEN: User clears the search term
      fireEvent.click(screen.getByText('Clear Term'));

      // THEN: The search term should be empty
      expect(screen.getByTestId('flags-term')).toHaveTextContent('');
    });
  });

  describe('Clear Functions', () => {
    test('clearSearchTerm clears a specific subtab', () => {
      const TestClearConsumer = () => {
        const { searchTerms, setSearchTerm, clearSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="flags-term">{searchTerms['flags']}</div>
            <div data-testid="contexts-term">{searchTerms['contexts']}</div>
            <button onClick={() => setSearchTerm('flags', 'test flags')}>Set Flags</button>
            <button onClick={() => setSearchTerm('contexts', 'test contexts')}>Set Contexts</button>
            <button onClick={() => clearSearchTerm('flags')}>Clear Flags</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <TestClearConsumer />
        </TabSearchProvider>,
      );

      // Set both terms
      fireEvent.click(screen.getByText('Set Flags'));
      fireEvent.click(screen.getByText('Set Contexts'));

      expect(screen.getByTestId('flags-term')).toHaveTextContent('test flags');
      expect(screen.getByTestId('contexts-term')).toHaveTextContent('test contexts');

      // Clear only flags
      fireEvent.click(screen.getByText('Clear Flags'));

      expect(screen.getByTestId('flags-term')).toHaveTextContent('');
      expect(screen.getByTestId('contexts-term')).toHaveTextContent('test contexts');
    });

    test('clearAllSearchTerms clears all subtabs', () => {
      const TestClearAllConsumer = () => {
        const { searchTerms, setSearchTerm, clearAllSearchTerms } = useTabSearchContext();
        return (
          <div>
            <div data-testid="flags-term">{searchTerms['flags']}</div>
            <div data-testid="contexts-term">{searchTerms['contexts']}</div>
            <div data-testid="events-term">{searchTerms['events']}</div>
            <button onClick={() => setSearchTerm('flags', 'test flags')}>Set Flags</button>
            <button onClick={() => setSearchTerm('contexts', 'test contexts')}>Set Contexts</button>
            <button onClick={() => setSearchTerm('events', 'test events')}>Set Events</button>
            <button onClick={() => clearAllSearchTerms()}>Clear All</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <TestClearAllConsumer />
        </TabSearchProvider>,
      );

      // Set multiple terms
      fireEvent.click(screen.getByText('Set Flags'));
      fireEvent.click(screen.getByText('Set Contexts'));
      fireEvent.click(screen.getByText('Set Events'));

      expect(screen.getByTestId('flags-term')).toHaveTextContent('test flags');
      expect(screen.getByTestId('contexts-term')).toHaveTextContent('test contexts');
      expect(screen.getByTestId('events-term')).toHaveTextContent('test events');

      // Clear all
      fireEvent.click(screen.getByText('Clear All'));

      expect(screen.getByTestId('flags-term')).toHaveTextContent('');
      expect(screen.getByTestId('contexts-term')).toHaveTextContent('');
      expect(screen.getByTestId('events-term')).toHaveTextContent('');
    });
  });

  describe('Multiple Consumers', () => {
    test('shares state between multiple consumers', () => {
      // GIVEN: Multiple components consuming the same context
      const FirstConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="first-flags">{searchTerms['flags']}</div>
            <button onClick={() => setSearchTerm('flags', 'shared term')}>Set From First</button>
          </div>
        );
      };

      const SecondConsumer = () => {
        const { searchTerms } = useTabSearchContext();
        return <div data-testid="second-flags">{searchTerms['flags']}</div>;
      };

      render(
        <TabSearchProvider>
          <FirstConsumer />
          <SecondConsumer />
        </TabSearchProvider>,
      );

      // WHEN: First consumer updates the search term
      fireEvent.click(screen.getByText('Set From First'));

      // THEN: Both consumers should see the updated value
      expect(screen.getByTestId('first-flags')).toHaveTextContent('shared term');
      expect(screen.getByTestId('second-flags')).toHaveTextContent('shared term');
    });
  });

  describe('All SubTab IDs', () => {
    test('supports all defined SubTab types', () => {
      // GIVEN: A consumer that sets search terms for all subtabs
      const AllSubtabsConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();

        React.useEffect(() => {
          const subtabIds: SubTab[] = ['flags', 'contexts', 'events', 'general', 'workflows'];
          subtabIds.forEach((subtabId) => setSearchTerm(subtabId, `search-${subtabId}`));
        }, [setSearchTerm]);

        return (
          <div>
            {Object.entries(searchTerms).map(([subtabId, term]) => (
              <div key={subtabId} data-testid={`term-${subtabId}`}>
                {term}
              </div>
            ))}
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <AllSubtabsConsumer />
        </TabSearchProvider>,
      );

      // THEN: All subtabs should have their search terms set
      expect(screen.getByTestId('term-flags')).toHaveTextContent('search-flags');
      expect(screen.getByTestId('term-contexts')).toHaveTextContent('search-contexts');
      expect(screen.getByTestId('term-events')).toHaveTextContent('search-events');
      expect(screen.getByTestId('term-general')).toHaveTextContent('search-general');
      expect(screen.getByTestId('term-workflows')).toHaveTextContent('search-workflows');
    });
  });

  describe('Context Hook - useTabSearchContext', () => {
    test('provides default values when used outside of TabSearchProvider', () => {
      // NOTE: The current implementation has a default value for the context,
      // so it doesn't throw an error when used outside the provider.

      // GIVEN: Component uses context without provider
      const TestWithoutProvider = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="has-context">true</div>
            <div data-testid="flags-term">{searchTerms['flags']}</div>
            <button onClick={() => setSearchTerm('flags', 'test')}>Set Term</button>
          </div>
        );
      };

      // WHEN: Rendered without TabSearchProvider
      render(<TestWithoutProvider />);

      // THEN: Should use default context values (empty strings and no-op function)
      expect(screen.getByTestId('has-context')).toHaveTextContent('true');
      expect(screen.getByTestId('flags-term')).toHaveTextContent('');

      // The setSearchTerm will be a no-op since there's no provider
      fireEvent.click(screen.getByText('Set Term'));
      expect(screen.getByTestId('flags-term')).toHaveTextContent(''); // Still empty
    });
  });

  describe('State Persistence', () => {
    test('maintains search terms across re-renders', () => {
      // GIVEN: Component that can trigger re-renders
      const RerenderConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        const [renderCount, setRenderCount] = React.useState(0);

        return (
          <div>
            <div data-testid="render-count">{renderCount}</div>
            <div data-testid="flags-term">{searchTerms['flags']}</div>
            <button onClick={() => setSearchTerm('flags', 'persistent term')}>Set Term</button>
            <button onClick={() => setRenderCount((c) => c + 1)}>Re-render</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <RerenderConsumer />
        </TabSearchProvider>,
      );

      // WHEN: Search term is set and component re-renders
      fireEvent.click(screen.getByText('Set Term'));
      expect(screen.getByTestId('flags-term')).toHaveTextContent('persistent term');

      fireEvent.click(screen.getByText('Re-render'));
      fireEvent.click(screen.getByText('Re-render'));

      // THEN: Search term should persist across re-renders
      expect(screen.getByTestId('render-count')).toHaveTextContent('2');
      expect(screen.getByTestId('flags-term')).toHaveTextContent('persistent term');
    });
  });

  describe('Edge Cases', () => {
    test('handles special characters in search terms', () => {
      // GIVEN: TabSearchProvider
      const SpecialCharsConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="search-term">{searchTerms['flags']}</div>
            <button onClick={() => setSearchTerm('flags', '!@#$%^&*()_+-=[]{}|;:,.<>?')}>Set Special Chars</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <SpecialCharsConsumer />
        </TabSearchProvider>,
      );

      // WHEN: Search term with special characters is set
      fireEvent.click(screen.getByText('Set Special Chars'));

      // THEN: Special characters should be preserved
      expect(screen.getByTestId('search-term')).toHaveTextContent('!@#$%^&*()_+-=[]{}|;:,.<>?');
    });

    test('handles very long search terms', () => {
      // GIVEN: TabSearchProvider
      const LongTermConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        const longTerm = 'a'.repeat(1000);
        return (
          <div>
            <div data-testid="search-length">{searchTerms['flags'].length}</div>
            <button onClick={() => setSearchTerm('flags', longTerm)}>Set Long Term</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <LongTermConsumer />
        </TabSearchProvider>,
      );

      // WHEN: Very long search term is set
      fireEvent.click(screen.getByText('Set Long Term'));

      // THEN: Long search term should be stored correctly
      expect(screen.getByTestId('search-length')).toHaveTextContent('1000');
    });

    test('handles unicode characters in search terms', () => {
      // GIVEN: TabSearchProvider
      const UnicodeConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="search-term">{searchTerms['flags']}</div>
            <button onClick={() => setSearchTerm('flags', '🚀 émojis & àccents')}>Set Unicode</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <UnicodeConsumer />
        </TabSearchProvider>,
      );

      // WHEN: Search term with unicode characters is set
      fireEvent.click(screen.getByText('Set Unicode'));

      // THEN: Unicode characters should be preserved
      expect(screen.getByTestId('search-term')).toHaveTextContent('🚀 émojis & àccents');
    });
  });

  describe('Performance', () => {
    test('setSearchTerm callback remains stable across renders', () => {
      // GIVEN: Component that tracks callback identity
      const CallbackStabilityConsumer = () => {
        const { setSearchTerm } = useTabSearchContext();
        const callbackRef = React.useRef(setSearchTerm);
        const [isStable, setIsStable] = React.useState(true);

        React.useEffect(() => {
          if (callbackRef.current !== setSearchTerm) {
            setIsStable(false);
          }
        }, [setSearchTerm]);

        return (
          <div>
            <div data-testid="callback-stable">{isStable.toString()}</div>
            <button onClick={() => setSearchTerm('flags', 'test')}>Update Term</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <CallbackStabilityConsumer />
        </TabSearchProvider>,
      );

      // WHEN: Search term is updated multiple times
      fireEvent.click(screen.getByText('Update Term'));
      fireEvent.click(screen.getByText('Update Term'));
      fireEvent.click(screen.getByText('Update Term'));

      // THEN: Callback should remain stable (memoized)
      expect(screen.getByTestId('callback-stable')).toHaveTextContent('true');
    });
  });
});
