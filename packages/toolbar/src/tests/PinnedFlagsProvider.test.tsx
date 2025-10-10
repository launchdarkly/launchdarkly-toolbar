import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';

import { PinnedFlagsProvider, usePinnedFlags } from '../ui/Toolbar/context/PinnedFlagsProvider';
import { AnalyticsProvider } from '../ui/Toolbar/context/AnalyticsProvider';
import * as localStorageUtils from '../ui/Toolbar/utils/localStorage';

// Test component that exposes the pinned flags context
function TestConsumer() {
  const { pinnedFlags, isPinned, togglePin, clearAllPins } = usePinnedFlags();

  return (
    <div>
      <div data-testid="pinned-count">{pinnedFlags.size}</div>
      <div data-testid="pinned-flags">{Array.from(pinnedFlags).join(',')}</div>
      <button onClick={() => togglePin('flag-1')} data-testid="toggle-flag-1">
        Toggle Flag 1
      </button>
      <button onClick={() => togglePin('flag-2')} data-testid="toggle-flag-2">
        Toggle Flag 2
      </button>
      <button onClick={() => togglePin('flag-3')} data-testid="toggle-flag-3">
        Toggle Flag 3
      </button>
      <button onClick={clearAllPins} data-testid="clear-all">
        Clear All
      </button>
      <div data-testid="is-flag-1-pinned">{isPinned('flag-1').toString()}</div>
      <div data-testid="is-flag-2-pinned">{isPinned('flag-2').toString()}</div>
      <div data-testid="is-flag-3-pinned">{isPinned('flag-3').toString()}</div>
    </div>
  );
}

// Wrapper that provides all necessary context
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <PinnedFlagsProvider>{children}</PinnedFlagsProvider>
    </AnalyticsProvider>
  );
}

describe('PinnedFlagsProvider - Pin Management', () => {
  let savePinnedFlagsSpy: ReturnType<typeof vi.spyOn>;
  let loadPinnedFlagsSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    savePinnedFlagsSpy = vi.spyOn(localStorageUtils, 'savePinnedFlags');
    loadPinnedFlagsSpy = vi.spyOn(localStorageUtils, 'loadPinnedFlags');
  });

  afterEach(() => {
    savePinnedFlagsSpy.mockRestore();
    loadPinnedFlagsSpy.mockRestore();
  });

  describe('Pin/Unpin Operations', () => {
    test('pins a flag and persists to localStorage', async () => {
      // GIVEN: Provider with no pinned flags
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // WHEN: Initially rendered
      // THEN: No flags are pinned
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('false');

      // WHEN: Flag-1 is pinned
      fireEvent.click(screen.getByTestId('toggle-flag-1'));

      // THEN: Flag-1 is marked as pinned
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('1');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('true');
      expect(screen.getByTestId('pinned-flags')).toHaveTextContent('flag-1');

      // AND: Change is persisted to localStorage
      await waitFor(() => {
        expect(savePinnedFlagsSpy).toHaveBeenCalled();
        const lastCall = savePinnedFlagsSpy.mock.calls[savePinnedFlagsSpy.mock.calls.length - 1];
        const savedSet = lastCall[0] as Set<string>;
        expect(savedSet.has('flag-1')).toBe(true);
      });
    });

    test('unpins a previously pinned flag', async () => {
      // GIVEN: Flag-1 is already pinned
      loadPinnedFlagsSpy.mockReturnValue(new Set(['flag-1']));

      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // WHEN: Provider is rendered
      // THEN: Flag-1 is pinned
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('1');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('true');

      // WHEN: Flag-1 is unpinned
      fireEvent.click(screen.getByTestId('toggle-flag-1'));

      // THEN: Flag-1 is no longer pinned
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('false');
      expect(screen.getByTestId('pinned-flags')).toHaveTextContent('');

      // AND: Change is persisted to localStorage
      await waitFor(() => {
        expect(savePinnedFlagsSpy).toHaveBeenCalled();
        const savedSet = savePinnedFlagsSpy.mock.calls[savePinnedFlagsSpy.mock.calls.length - 1][0] as Set<string>;
        expect(savedSet.has('flag-1')).toBe(false);
      });
    });

    test('pins multiple flags simultaneously', async () => {
      // GIVEN: Provider with no pinned flags
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // WHEN: Multiple flags are pinned
      fireEvent.click(screen.getByTestId('toggle-flag-1'));
      fireEvent.click(screen.getByTestId('toggle-flag-2'));
      fireEvent.click(screen.getByTestId('toggle-flag-3'));

      // THEN: All flags are marked as pinned
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('3');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('true');
      expect(screen.getByTestId('is-flag-2-pinned')).toHaveTextContent('true');
      expect(screen.getByTestId('is-flag-3-pinned')).toHaveTextContent('true');

      // AND: Pinned flags list contains all three
      const pinnedText = screen.getByTestId('pinned-flags').textContent;
      expect(pinnedText).toContain('flag-1');
      expect(pinnedText).toContain('flag-2');
      expect(pinnedText).toContain('flag-3');
    });

    test('clears all pinned flags at once', async () => {
      // GIVEN: Multiple flags are already pinned
      loadPinnedFlagsSpy.mockReturnValue(new Set(['flag-1', 'flag-2', 'flag-3']));

      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // WHEN: Provider is rendered with pinned flags
      // THEN: All flags are pinned
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('3');

      // WHEN: Clear all is triggered
      fireEvent.click(screen.getByTestId('clear-all'));

      // THEN: All pins are removed
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('false');
      expect(screen.getByTestId('is-flag-2-pinned')).toHaveTextContent('false');
      expect(screen.getByTestId('is-flag-3-pinned')).toHaveTextContent('false');
      expect(screen.getByTestId('pinned-flags')).toHaveTextContent('');

      // AND: Cleared state is persisted to localStorage
      await waitFor(() => {
        const savedSet = savePinnedFlagsSpy.mock.calls[savePinnedFlagsSpy.mock.calls.length - 1][0] as Set<string>;
        expect(savedSet.size).toBe(0);
      });
    });
  });

  describe('Persistence and Loading', () => {
    test('pinned flags are loaded from localStorage on mount', () => {
      // GIVEN: Developer has previously pinned some flags
      const existingPins = new Set(['flag-1', 'flag-2']);
      loadPinnedFlagsSpy.mockReturnValue(existingPins);

      // WHEN: Developer opens the toolbar
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // THEN: Previously pinned flags are restored
      expect(loadPinnedFlagsSpy).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('2');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('true');
      expect(screen.getByTestId('is-flag-2-pinned')).toHaveTextContent('true');
    });

    test('pinned flags persist across component remounts', async () => {
      // GIVEN: Developer pins a flag
      const { unmount } = render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByTestId('toggle-flag-1'));

      // Capture what was saved
      await waitFor(() => {
        expect(savePinnedFlagsSpy).toHaveBeenCalled();
      });
      const savedSet = savePinnedFlagsSpy.mock.calls[savePinnedFlagsSpy.mock.calls.length - 1][0] as Set<string>;

      // WHEN: The component unmounts and remounts (simulating page refresh)
      unmount();

      // Clear mocks and set up fresh mock that returns saved pins
      vi.clearAllMocks();
      loadPinnedFlagsSpy = vi.spyOn(localStorageUtils, 'loadPinnedFlags').mockReturnValue(savedSet);
      savePinnedFlagsSpy = vi.spyOn(localStorageUtils, 'savePinnedFlags');

      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // THEN: The pinned flags are still there
      expect(loadPinnedFlagsSpy).toHaveBeenCalled();
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('1');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('true');
    });

    test('handles localStorage errors gracefully', () => {
      // GIVEN: localStorage load returns empty set due to error (error handling is in loadPinnedFlags)
      loadPinnedFlagsSpy.mockReturnValue(new Set());

      // WHEN: Developer opens the toolbar
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // THEN: It should not crash and start with empty pins
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('0');
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('false');
    });
  });

  describe('Edge Cases', () => {
    test('toggling same flag multiple times works correctly', async () => {
      // GIVEN: Developer has the toolbar open

      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // WHEN: Developer toggles the same flag multiple times
      fireEvent.click(screen.getByTestId('toggle-flag-1')); // Pin
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('true');

      fireEvent.click(screen.getByTestId('toggle-flag-1')); // Unpin
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('false');

      fireEvent.click(screen.getByTestId('toggle-flag-1')); // Pin again
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('true');

      // THEN: The flag state is correct
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('1');
    });

    test('checking isPinned for non-existent flag returns false', () => {
      // GIVEN: Developer has some flags pinned
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // WHEN: Checking if a non-pinned flag is pinned
      // THEN: It returns false
      expect(screen.getByTestId('is-flag-1-pinned')).toHaveTextContent('false');
    });
  });

  describe('Error Handling', () => {
    test('throws error when usePinnedFlags is used outside provider', () => {
      // GIVEN: Component tries to use context outside provider
      const TestComponentOutsideProvider = () => {
        usePinnedFlags(); // This should throw
        return <div>Should not render</div>;
      };

      // WHEN/THEN: Error is thrown
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponentOutsideProvider />);
      }).toThrow('usePinnedFlags must be used within a PinnedFlagsProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Analytics Tracking', () => {
    test('tracks flag pin events', async () => {
      // GIVEN: Developer has the toolbar open
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      // Capture console.debug calls to verify tracking
      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      // WHEN: Developer pins a flag
      fireEvent.click(screen.getByTestId('toggle-flag-1'));

      // THEN: Analytics event is tracked
      await waitFor(() => {
        expect(debugSpy).toHaveBeenCalledWith(
          'ToolbarAnalytics: LDClient not available, skipping track event:',
          'ld.toolbar.flag.pinned',
        );
      });

      debugSpy.mockRestore();
    });

    test('tracks flag unpin events', async () => {
      // GIVEN: Developer has a pinned flag
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByTestId('toggle-flag-1')); // Pin first

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      // WHEN: Developer unpins the flag
      fireEvent.click(screen.getByTestId('toggle-flag-1'));

      // THEN: Analytics event is tracked
      await waitFor(() => {
        expect(debugSpy).toHaveBeenCalledWith(
          'ToolbarAnalytics: LDClient not available, skipping track event:',
          'ld.toolbar.flag.unpinned',
        );
      });

      debugSpy.mockRestore();
    });

    test('tracks clear all pins with count', async () => {
      // GIVEN: Developer has multiple pinned flags
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByTestId('toggle-flag-1'));
      fireEvent.click(screen.getByTestId('toggle-flag-2'));

      await waitFor(() => {
        expect(screen.getByTestId('pinned-count')).toHaveTextContent('2');
      });

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      // WHEN: Developer clears all pins
      fireEvent.click(screen.getByTestId('clear-all'));

      // THEN: Analytics event is tracked with the count
      await waitFor(() => {
        expect(debugSpy).toHaveBeenCalledWith(
          'ToolbarAnalytics: LDClient not available, skipping track event:',
          'ld.toolbar.flags.cleared',
        );
      });

      debugSpy.mockRestore();
    });

    test('does not track clear all when no flags are pinned', async () => {
      // GIVEN: Developer has no pinned flags
      render(
        <TestWrapper>
          <TestConsumer />
        </TestWrapper>,
      );

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      // WHEN: Developer tries to clear all (even though nothing is pinned)
      fireEvent.click(screen.getByTestId('clear-all'));

      // THEN: No analytics event is tracked (count is 0)
      expect(debugSpy).not.toHaveBeenCalledWith(
        'ToolbarAnalytics: LDClient not available, skipping track event:',
        'ld.toolbar.flags.cleared',
      );

      debugSpy.mockRestore();
    });
  });

  describe('Automatic Cleanup', () => {
    test('cleanup removes multiple deleted flags', async () => {
      // Test component that can trigger cleanup
      function TestCleanup() {
        const { pinnedFlags, togglePin, cleanupDeletedFlags } = usePinnedFlags();

        return (
          <div>
            <div data-testid="pinned-count">{pinnedFlags.size}</div>
            <div data-testid="pinned-flags">{Array.from(pinnedFlags).join(',')}</div>
            <button onClick={() => togglePin('flag-1')} data-testid="toggle-flag-1">
              Toggle Flag 1
            </button>
            <button onClick={() => togglePin('flag-2')} data-testid="toggle-flag-2">
              Toggle Flag 2
            </button>
            <button onClick={() => togglePin('flag-3')} data-testid="toggle-flag-3">
              Toggle Flag 3
            </button>
            <button onClick={() => cleanupDeletedFlags(new Set(['flag-1']))} data-testid="cleanup-to-flag-1-only">
              Cleanup
            </button>
          </div>
        );
      }

      // GIVEN: Developer has 3 pinned flags
      render(
        <TestWrapper>
          <TestCleanup />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByTestId('toggle-flag-1'));
      fireEvent.click(screen.getByTestId('toggle-flag-2'));
      fireEvent.click(screen.getByTestId('toggle-flag-3'));

      await waitFor(() => {
        expect(screen.getByTestId('pinned-count')).toHaveTextContent('3');
        expect(screen.getByTestId('pinned-flags')).toHaveTextContent('flag-1,flag-2,flag-3');
      });

      // WHEN: Only flag-1 exists now (flag-2 and flag-3 deleted)
      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      fireEvent.click(screen.getByTestId('cleanup-to-flag-1-only'));

      // THEN: Only flag-1 remains pinned
      await waitFor(() => {
        expect(screen.getByTestId('pinned-count')).toHaveTextContent('1');
        expect(screen.getByTestId('pinned-flags')).toHaveTextContent('flag-1');
      });

      // AND: Analytics event is tracked
      expect(debugSpy).toHaveBeenCalledWith(
        'ToolbarAnalytics: LDClient not available, skipping track event:',
        'ld.toolbar.flags.cleaned',
      );

      debugSpy.mockRestore();
    });

    test('cleanup does nothing when all pinned flags still exist', async () => {
      function TestCleanup() {
        const { pinnedFlags, togglePin, cleanupDeletedFlags } = usePinnedFlags();

        return (
          <div>
            <div data-testid="pinned-count">{pinnedFlags.size}</div>
            <button onClick={() => togglePin('flag-1')} data-testid="toggle-flag-1">
              Toggle Flag 1
            </button>
            <button onClick={() => togglePin('flag-2')} data-testid="toggle-flag-2">
              Toggle Flag 2
            </button>
            <button onClick={() => cleanupDeletedFlags(new Set(['flag-1', 'flag-2']))} data-testid="cleanup-all-exist">
              Cleanup
            </button>
          </div>
        );
      }

      // GIVEN: Developer has 2 pinned flags
      render(
        <TestWrapper>
          <TestCleanup />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByTestId('toggle-flag-1'));
      fireEvent.click(screen.getByTestId('toggle-flag-2'));

      await waitFor(() => {
        expect(screen.getByTestId('pinned-count')).toHaveTextContent('2');
      });

      const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      // WHEN: Cleanup is called but all flags still exist
      fireEvent.click(screen.getByTestId('cleanup-all-exist'));

      // THEN: Count remains the same
      expect(screen.getByTestId('pinned-count')).toHaveTextContent('2');

      // AND: No analytics event is tracked (no cleanup needed)
      expect(debugSpy).not.toHaveBeenCalledWith(
        'ToolbarAnalytics: LDClient not available, skipping track event:',
        'ld.toolbar.flags.cleaned',
      );

      debugSpy.mockRestore();
    });

    test('cleanup works when all pinned flags are deleted', async () => {
      function TestCleanup() {
        const { pinnedFlags, togglePin, cleanupDeletedFlags } = usePinnedFlags();

        return (
          <div>
            <div data-testid="pinned-count">{pinnedFlags.size}</div>
            <button onClick={() => togglePin('flag-1')} data-testid="toggle-flag-1">
              Toggle Flag 1
            </button>
            <button onClick={() => togglePin('flag-2')} data-testid="toggle-flag-2">
              Toggle Flag 2
            </button>
            <button onClick={() => cleanupDeletedFlags(new Set())} data-testid="cleanup-empty">
              Cleanup All Deleted
            </button>
          </div>
        );
      }

      // GIVEN: Developer has 2 pinned flags
      render(
        <TestWrapper>
          <TestCleanup />
        </TestWrapper>,
      );

      fireEvent.click(screen.getByTestId('toggle-flag-1'));
      fireEvent.click(screen.getByTestId('toggle-flag-2'));

      await waitFor(() => {
        expect(screen.getByTestId('pinned-count')).toHaveTextContent('2');
      });

      // WHEN: All flags are deleted (cleanup with empty set)
      fireEvent.click(screen.getByTestId('cleanup-empty'));

      // THEN: All pins are removed
      await waitFor(() => {
        expect(screen.getByTestId('pinned-count')).toHaveTextContent('0');
      });
    });

    test('cleanup persists to localStorage', async () => {
      function TestCleanup() {
        const { pinnedFlags, togglePin, cleanupDeletedFlags } = usePinnedFlags();

        return (
          <div>
            <div data-testid="pinned-count">{pinnedFlags.size}</div>
            <button onClick={() => togglePin('flag-1')} data-testid="toggle-flag-1">
              Toggle
            </button>
            <button onClick={() => togglePin('flag-2')} data-testid="toggle-flag-2">
              Toggle
            </button>
            <button onClick={() => togglePin('flag-3')} data-testid="toggle-flag-3">
              Toggle
            </button>
            <button onClick={() => cleanupDeletedFlags(new Set(['flag-1']))} data-testid="cleanup">
              Cleanup
            </button>
          </div>
        );
      }

      render(
        <TestWrapper>
          <TestCleanup />
        </TestWrapper>,
      );

      // Pin 3 flags
      fireEvent.click(screen.getByTestId('toggle-flag-1'));
      fireEvent.click(screen.getByTestId('toggle-flag-2'));
      fireEvent.click(screen.getByTestId('toggle-flag-3'));

      await waitFor(() => {
        expect(screen.getByTestId('pinned-count')).toHaveTextContent('3');
      });

      // Cleanup to only flag-1
      fireEvent.click(screen.getByTestId('cleanup'));

      await waitFor(() => {
        expect(screen.getByTestId('pinned-count')).toHaveTextContent('1');
      });

      // Verify savePinnedFlags was called with the cleaned set
      await waitFor(() => {
        expect(savePinnedFlagsSpy).toHaveBeenCalled();
        const lastCall = savePinnedFlagsSpy.mock.calls[savePinnedFlagsSpy.mock.calls.length - 1];
        const savedSet = lastCall[0] as Set<string>;
        expect(savedSet.size).toBe(1);
        expect(savedSet.has('flag-1')).toBe(true);
      });
    });
  });
});
