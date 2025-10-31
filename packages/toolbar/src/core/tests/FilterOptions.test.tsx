import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi } from 'vitest';

import { FilterOptions, type FilterOptionsProps } from '../ui/Toolbar/components/FilterOptions/FilterOptions';
import {
  FlagFilterOptionsContext,
  type FlagFilterMode,
} from '../ui/Toolbar/components/FilterOptions/useFlagFilterOptions';

describe('FilterOptions', () => {
  const defaultProps: FilterOptionsProps = {
    totalFlags: 5,
    filteredFlags: 5,
    totalOverriddenFlags: 2,
    starredCount: 1,
    onClearOverrides: vi.fn(),
    onClearStarred: vi.fn(),
    isLoading: false,
  };

  const renderWithContext = (props: FilterOptionsProps = defaultProps, activeFilter: FlagFilterMode = 'all') => {
    const onFilterChange = vi.fn();

    return {
      onFilterChange,
      ...render(
        <FlagFilterOptionsContext.Provider value={{ activeFilter, onFilterChange }}>
          <FilterOptions {...props} />
        </FlagFilterOptionsContext.Provider>,
      ),
    };
  };

  describe('Status Text', () => {
    test('shows "Showing all X flags" when on All filter with no search', () => {
      renderWithContext({ ...defaultProps, filteredFlags: 5, totalFlags: 5 }, 'all');

      expect(screen.getByText('Showing all 5 flags')).toBeInTheDocument();
    });

    test('shows "Showing X of Y flags" when searching on All filter', () => {
      renderWithContext({ ...defaultProps, filteredFlags: 2, totalFlags: 5 }, 'all');

      expect(screen.getByText('Showing 2 of 5 flags')).toBeInTheDocument();
    });

    test('shows "Showing X of Y flags" when on Overrides filter', () => {
      renderWithContext({ ...defaultProps, filteredFlags: 2, totalFlags: 5 }, 'overrides');

      expect(screen.getByText('Showing 2 of 5 flags')).toBeInTheDocument();
    });

    test('shows "Showing X of Y flags" when on Starred filter', () => {
      renderWithContext({ ...defaultProps, filteredFlags: 1, totalFlags: 5 }, 'starred');

      expect(screen.getByText('Showing 1 of 5 flags')).toBeInTheDocument();
    });
  });

  describe('Clear Buttons', () => {
    test('shows clear button on Overrides filter when totalOverriddenFlags > 0', () => {
      renderWithContext({ ...defaultProps, totalOverriddenFlags: 2 }, 'overrides');

      expect(screen.getByText(/Clear Overrides \(2\)/)).toBeInTheDocument();
    });

    test('does not show clear button on Overrides filter when totalOverriddenFlags = 0', () => {
      renderWithContext({ ...defaultProps, totalOverriddenFlags: 0 }, 'overrides');

      expect(screen.queryByText(/Clear Overrides/)).not.toBeInTheDocument();
    });

    test('shows clear button on Starred filter when starredCount > 0', () => {
      renderWithContext({ ...defaultProps, starredCount: 3 }, 'starred');

      expect(screen.getByText(/Clear Starred \(3\)/)).toBeInTheDocument();
    });

    test('does not show clear button on Starred filter when starredCount = 0', () => {
      renderWithContext({ ...defaultProps, starredCount: 0 }, 'starred');

      expect(screen.queryByText(/Clear Starred/)).not.toBeInTheDocument();
    });

    test('does not show clear button on All filter', () => {
      renderWithContext(defaultProps, 'all');

      expect(screen.queryByText(/Clear Overrides/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Clear Starred/)).not.toBeInTheDocument();
    });

    test('disables clear button when isLoading is true', () => {
      renderWithContext({ ...defaultProps, isLoading: true }, 'overrides');

      const clearButton = screen.getByText(/Clear Overrides/);
      expect(clearButton).toBeDisabled();
    });
  });
});
