import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, beforeEach } from 'vitest';
import { TabSearchProvider, useTabSearchContext } from '../ui/Toolbar/components/new/context/TabSearchProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { TabId } from '../ui/Toolbar/types';

// Test component that consumes the TabSearchContext
function TestConsumer() {
  const { searchTerms, setSearchTerm } = useTabSearchContext();

  return (
    <div>
      <div data-testid="flag-sdk-term">{searchTerms['flag-sdk']}</div>
      <div data-testid="flag-dev-server-term">{searchTerms['flag-dev-server']}</div>
      <div data-testid="events-term">{searchTerms.events}</div>
      <div data-testid="settings-term">{searchTerms.settings}</div>
      <div data-testid="flags-term">{searchTerms.flags}</div>
      <div data-testid="monitoring-term">{searchTerms.monitoring}</div>
      <div data-testid="interactive-term">{searchTerms.interactive}</div>
      <div data-testid="ai-term">{searchTerms.ai}</div>
      <div data-testid="optimize-term">{searchTerms.optimize}</div>
      <button onClick={() => setSearchTerm('flag-sdk', 'test flag')}>Set Flag SDK Term</button>
      <button onClick={() => setSearchTerm('events', 'test event')}>Set Events Term</button>
      <button onClick={() => setSearchTerm('settings', 'test setting')}>Set Settings Term</button>
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
          setSearchTerm('flag-sdk', 'first');
          setSearchTerm('events', 'second');
          setSearchTerm('settings', 'third');
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
    test('initializes with empty search terms for all tabs', () => {
      // GIVEN: TabSearchProvider is rendered with a test consumer
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // THEN: All search terms should be empty strings
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('');
      expect(screen.getByTestId('flag-dev-server-term')).toHaveTextContent('');
      expect(screen.getByTestId('events-term')).toHaveTextContent('');
      expect(screen.getByTestId('settings-term')).toHaveTextContent('');
      expect(screen.getByTestId('flags-term')).toHaveTextContent('');
      expect(screen.getByTestId('monitoring-term')).toHaveTextContent('');
      expect(screen.getByTestId('interactive-term')).toHaveTextContent('');
      expect(screen.getByTestId('ai-term')).toHaveTextContent('');
      expect(screen.getByTestId('optimize-term')).toHaveTextContent('');
    });
  });

  describe('Setting Search Terms', () => {
    test('updates search term for a specific tab', () => {
      // GIVEN: TabSearchProvider is rendered
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // WHEN: User sets a search term for flag-sdk tab
      fireEvent.click(screen.getByText('Set Flag SDK Term'));

      // THEN: Only the flag-sdk search term should be updated
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('test flag');
      expect(screen.getByTestId('events-term')).toHaveTextContent('');
      expect(screen.getByTestId('settings-term')).toHaveTextContent('');
    });

    test('updates search term for events tab independently', () => {
      // GIVEN: TabSearchProvider is rendered
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // WHEN: User sets a search term for events tab
      fireEvent.click(screen.getByText('Set Events Term'));

      // THEN: Only the events search term should be updated
      expect(screen.getByTestId('events-term')).toHaveTextContent('test event');
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('');
      expect(screen.getByTestId('settings-term')).toHaveTextContent('');
    });

    test('updates multiple tabs independently', () => {
      // GIVEN: TabSearchProvider is rendered
      render(
        <TabSearchProvider>
          <TestConsumer />
        </TabSearchProvider>,
      );

      // WHEN: User sets search terms for multiple tabs
      fireEvent.click(screen.getByText('Set Flag SDK Term'));
      fireEvent.click(screen.getByText('Set Events Term'));
      fireEvent.click(screen.getByText('Set Settings Term'));

      // THEN: All specified tabs should have their search terms updated
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('test flag');
      expect(screen.getByTestId('events-term')).toHaveTextContent('test event');
      expect(screen.getByTestId('settings-term')).toHaveTextContent('test setting');
    });

    test('overwrites existing search term when set again', () => {
      // GIVEN: TabSearchProvider with an existing search term
      const TestUpdater = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="flag-sdk-term">{searchTerms['flag-sdk']}</div>
            <button onClick={() => setSearchTerm('flag-sdk', 'test flag')}>Set Flag SDK Term</button>
            <button onClick={() => setSearchTerm('flag-sdk', 'updated flag')}>Update Flag SDK Term</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <TestUpdater />
        </TabSearchProvider>,
      );

      // WHEN: User sets a search term
      fireEvent.click(screen.getByText('Set Flag SDK Term'));
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('test flag');

      // WHEN: User sets a new search term for the same tab
      fireEvent.click(screen.getByText('Update Flag SDK Term'));

      // THEN: The search term should be replaced with the new value
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('updated flag');
    });

    test('can set search term to empty string', () => {
      // GIVEN: TabSearchProvider with a search term set
      const TestClearConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="flag-sdk-term">{searchTerms['flag-sdk']}</div>
            <button onClick={() => setSearchTerm('flag-sdk', 'test')}>Set Term</button>
            <button onClick={() => setSearchTerm('flag-sdk', '')}>Clear Term</button>
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <TestClearConsumer />
        </TabSearchProvider>,
      );

      fireEvent.click(screen.getByText('Set Term'));
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('test');

      // WHEN: User clears the search term
      fireEvent.click(screen.getByText('Clear Term'));

      // THEN: The search term should be empty
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('');
    });
  });

  describe('Multiple Consumers', () => {
    test('shares state between multiple consumers', () => {
      // GIVEN: Multiple components consuming the same context
      const FirstConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="first-flag-sdk">{searchTerms['flag-sdk']}</div>
            <button onClick={() => setSearchTerm('flag-sdk', 'shared term')}>Set From First</button>
          </div>
        );
      };

      const SecondConsumer = () => {
        const { searchTerms } = useTabSearchContext();
        return <div data-testid="second-flag-sdk">{searchTerms['flag-sdk']}</div>;
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
      expect(screen.getByTestId('first-flag-sdk')).toHaveTextContent('shared term');
      expect(screen.getByTestId('second-flag-sdk')).toHaveTextContent('shared term');
    });
  });

  describe('All Tab IDs', () => {
    test('supports all defined TabId types', () => {
      // GIVEN: A consumer that sets search terms for all tabs
      const AllTabsConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();

        React.useEffect(() => {
          const tabIds: TabId[] = [
            'flag-sdk',
            'flag-dev-server',
            'events',
            'settings',
            'flags',
            'monitoring',
            'interactive',
            'ai',
            'optimize',
          ];
          tabIds.forEach((tabId) => setSearchTerm(tabId, `search-${tabId}`));
        }, [setSearchTerm]);

        return (
          <div>
            {Object.entries(searchTerms).map(([tabId, term]) => (
              <div key={tabId} data-testid={`term-${tabId}`}>
                {term}
              </div>
            ))}
          </div>
        );
      };

      render(
        <TabSearchProvider>
          <AllTabsConsumer />
        </TabSearchProvider>,
      );

      // THEN: All tabs should have their search terms set
      expect(screen.getByTestId('term-flag-sdk')).toHaveTextContent('search-flag-sdk');
      expect(screen.getByTestId('term-flag-dev-server')).toHaveTextContent('search-flag-dev-server');
      expect(screen.getByTestId('term-events')).toHaveTextContent('search-events');
      expect(screen.getByTestId('term-settings')).toHaveTextContent('search-settings');
      expect(screen.getByTestId('term-flags')).toHaveTextContent('search-flags');
      expect(screen.getByTestId('term-monitoring')).toHaveTextContent('search-monitoring');
      expect(screen.getByTestId('term-interactive')).toHaveTextContent('search-interactive');
      expect(screen.getByTestId('term-ai')).toHaveTextContent('search-ai');
      expect(screen.getByTestId('term-optimize')).toHaveTextContent('search-optimize');
    });
  });

  describe('Context Hook - useTabSearchContext', () => {
    test('provides default values when used outside of TabSearchProvider', () => {
      // NOTE: The current implementation has a default value for the context,
      // so it doesn't throw an error when used outside the provider.
      // This is different from other providers like StarredFlagsProvider.
      // Consider updating the implementation to use null as default for consistency.

      // GIVEN: Component uses context without provider
      const TestWithoutProvider = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="has-context">true</div>
            <div data-testid="flag-sdk-term">{searchTerms['flag-sdk']}</div>
            <button onClick={() => setSearchTerm('flag-sdk', 'test')}>Set Term</button>
          </div>
        );
      };

      // WHEN: Rendered without TabSearchProvider
      render(<TestWithoutProvider />);

      // THEN: Should use default context values (empty strings and no-op function)
      expect(screen.getByTestId('has-context')).toHaveTextContent('true');
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('');

      // The setSearchTerm will be a no-op since there's no provider
      fireEvent.click(screen.getByText('Set Term'));
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent(''); // Still empty
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
            <div data-testid="flag-sdk-term">{searchTerms['flag-sdk']}</div>
            <button onClick={() => setSearchTerm('flag-sdk', 'persistent term')}>Set Term</button>
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
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('persistent term');

      fireEvent.click(screen.getByText('Re-render'));
      fireEvent.click(screen.getByText('Re-render'));

      // THEN: Search term should persist across re-renders
      expect(screen.getByTestId('render-count')).toHaveTextContent('2');
      expect(screen.getByTestId('flag-sdk-term')).toHaveTextContent('persistent term');
    });
  });

  describe('Edge Cases', () => {
    test('handles special characters in search terms', () => {
      // GIVEN: TabSearchProvider
      const SpecialCharsConsumer = () => {
        const { searchTerms, setSearchTerm } = useTabSearchContext();
        return (
          <div>
            <div data-testid="search-term">{searchTerms['flag-sdk']}</div>
            <button onClick={() => setSearchTerm('flag-sdk', '!@#$%^&*()_+-=[]{}|;:,.<>?')}>Set Special Chars</button>
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
            <div data-testid="search-length">{searchTerms['flag-sdk'].length}</div>
            <button onClick={() => setSearchTerm('flag-sdk', longTerm)}>Set Long Term</button>
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
            <div data-testid="search-term">{searchTerms['flag-sdk']}</div>
            <button onClick={() => setSearchTerm('flag-sdk', '🚀 émojis & àccents')}>Set Unicode</button>
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
            <button onClick={() => setSearchTerm('flag-sdk', 'test')}>Update Term</button>
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
