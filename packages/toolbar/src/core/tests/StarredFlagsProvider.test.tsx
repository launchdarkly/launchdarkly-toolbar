import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';

import { StarredFlagsProvider, useStarredFlags } from '../ui/Toolbar/context/StarredFlagsProvider';
import { TOOLBAR_STORAGE_KEYS } from '../ui/Toolbar/utils/localStorage';

// Test component that consumes the context
function TestConsumer() {
  const { isStarred, toggleStarred, clearAllStarred, starredCount } = useStarredFlags();

  return (
    <div>
      <div data-testid="starred-count">{starredCount}</div>
      <div data-testid="flag-1-starred">{isStarred('flag-1').toString()}</div>
      <div data-testid="flag-2-starred">{isStarred('flag-2').toString()}</div>
      <button onClick={() => toggleStarred('flag-1')}>Toggle Flag 1</button>
      <button onClick={() => toggleStarred('flag-2')}>Toggle Flag 2</button>
      <button onClick={clearAllStarred}>Clear All</button>
    </div>
  );
}

describe('StarredFlagsProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Initialization', () => {
    test('initializes with empty starred flags when localStorage is empty', () => {
      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('starred-count')).toHaveTextContent('0');
      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('false');
      expect(screen.getByTestId('flag-2-starred')).toHaveTextContent('false');
    });

    test('loads starred flags from localStorage', () => {
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, JSON.stringify(['flag-1', 'flag-3']));

      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('starred-count')).toHaveTextContent('2');
      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('true');
      expect(screen.getByTestId('flag-2-starred')).toHaveTextContent('false');
    });
  });

  describe('starredCount', () => {
    test('starredCount updates when flags are starred', () => {
      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('starred-count')).toHaveTextContent('0');

      fireEvent.click(screen.getByText('Toggle Flag 1'));
      expect(screen.getByTestId('starred-count')).toHaveTextContent('1');

      fireEvent.click(screen.getByText('Toggle Flag 2'));
      expect(screen.getByTestId('starred-count')).toHaveTextContent('2');
    });

    test('starredCount updates when flags are unstarred', () => {
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, JSON.stringify(['flag-1', 'flag-2']));

      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('starred-count')).toHaveTextContent('2');

      fireEvent.click(screen.getByText('Toggle Flag 1'));
      expect(screen.getByTestId('starred-count')).toHaveTextContent('1');
    });

    test('starredCount is 0 after clearAllStarred', () => {
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, JSON.stringify(['flag-1', 'flag-2']));

      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('starred-count')).toHaveTextContent('2');

      fireEvent.click(screen.getByText('Clear All'));
      expect(screen.getByTestId('starred-count')).toHaveTextContent('0');
    });
  });

  describe('toggleStarred', () => {
    test('adds flag to starred when not starred', () => {
      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('false');

      fireEvent.click(screen.getByText('Toggle Flag 1'));

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('true');
    });

    test('removes flag from starred when already starred', () => {
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, JSON.stringify(['flag-1']));

      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('true');

      fireEvent.click(screen.getByText('Toggle Flag 1'));

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('false');
    });

    test('persists changes to localStorage', () => {
      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      fireEvent.click(screen.getByText('Toggle Flag 1'));

      const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS);
      expect(stored).toBe(JSON.stringify(['flag-1']));
    });

    test('can toggle multiple flags independently', () => {
      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      fireEvent.click(screen.getByText('Toggle Flag 1'));
      fireEvent.click(screen.getByText('Toggle Flag 2'));

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('true');
      expect(screen.getByTestId('flag-2-starred')).toHaveTextContent('true');

      const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS);
      const parsed = JSON.parse(stored!);
      expect(parsed).toContain('flag-1');
      expect(parsed).toContain('flag-2');
    });
  });

  describe('isStarred', () => {
    test('returns false for non-starred flag', () => {
      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('false');
    });

    test('returns true for starred flag', () => {
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, JSON.stringify(['flag-1']));

      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('true');
      expect(screen.getByTestId('flag-2-starred')).toHaveTextContent('false');
    });
  });

  describe('clearAllStarred', () => {
    test('removes all starred flags', () => {
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, JSON.stringify(['flag-1', 'flag-2']));

      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('true');
      expect(screen.getByTestId('flag-2-starred')).toHaveTextContent('true');

      fireEvent.click(screen.getByText('Clear All'));

      expect(screen.getByTestId('flag-1-starred')).toHaveTextContent('false');
      expect(screen.getByTestId('flag-2-starred')).toHaveTextContent('false');
    });

    test('persists empty state to localStorage', () => {
      localStorage.setItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, JSON.stringify(['flag-1', 'flag-2']));

      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      fireEvent.click(screen.getByText('Clear All'));

      const stored = localStorage.getItem(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS);
      expect(stored).toBe(JSON.stringify([]));
    });

    test('works when no flags are starred', () => {
      render(
        <StarredFlagsProvider>
          <TestConsumer />
        </StarredFlagsProvider>,
      );

      fireEvent.click(screen.getByText('Clear All'));

      expect(screen.getByTestId('starred-count')).toHaveTextContent('0');
    });
  });
});
