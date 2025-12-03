import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  FiltersProvider,
  useFilters,
  useSubtabFilters,
  SUBTAB_FILTER_CONFIGS,
} from '../../ui/Toolbar/components/new/context/FiltersProvider';
import React from 'react';
import '@testing-library/jest-dom/vitest';

describe('FiltersProvider', () => {
  describe('useFilters hook', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = console.error;
      console.error = () => {};

      expect(() => {
        renderHook(() => useFilters());
      }).toThrow('useFilters must be used within a FiltersProvider');

      console.error = consoleError;
    });

    it('should provide initial filter state with default "all" filter', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      const flagsFilters = result.current.getActiveFilters('flags');
      expect(flagsFilters.has('all')).toBe(true);
      expect(flagsFilters.size).toBe(1);
    });

    it('should return filter config for configured subtabs', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      const flagsConfig = result.current.getFilterConfig('flags');
      expect(flagsConfig).not.toBeNull();
      expect(flagsConfig?.options).toHaveLength(3);
      expect(flagsConfig?.options.map((o) => o.id)).toEqual(['all', 'overrides', 'starred']);
    });

    it('should return null config for unconfigured subtabs', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      const config = result.current.getFilterConfig('general');
      expect(config).toBeNull();
    });

    it('should report hasFilters correctly', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      expect(result.current.hasFilters('flags')).toBe(true);
      expect(result.current.hasFilters('events')).toBe(true);
      expect(result.current.hasFilters('general')).toBe(false);
      expect(result.current.hasFilters('context')).toBe(false);
    });
  });

  describe('toggleFilter', () => {
    it('should select "all" when clicking "all" filter', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      // First select a different filter
      act(() => {
        result.current.toggleFilter('flags', 'overrides');
      });

      // Then select "all"
      act(() => {
        result.current.toggleFilter('flags', 'all');
      });

      const filters = result.current.getActiveFilters('flags');
      expect(filters.has('all')).toBe(true);
      expect(filters.size).toBe(1);
    });

    it('should deselect "all" when selecting another filter', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      // "all" is selected by default
      expect(result.current.getActiveFilters('flags').has('all')).toBe(true);

      // Select "overrides"
      act(() => {
        result.current.toggleFilter('flags', 'overrides');
      });

      const filters = result.current.getActiveFilters('flags');
      expect(filters.has('all')).toBe(false);
      expect(filters.has('overrides')).toBe(true);
    });

    it('should allow multiple non-"all" filters when allowMultiple is true', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      act(() => {
        result.current.toggleFilter('flags', 'overrides');
      });

      act(() => {
        result.current.toggleFilter('flags', 'starred');
      });

      const filters = result.current.getActiveFilters('flags');
      expect(filters.has('overrides')).toBe(true);
      expect(filters.has('starred')).toBe(true);
      expect(filters.size).toBe(2);
    });

    it('should toggle off a filter when clicked again', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      // Select overrides
      act(() => {
        result.current.toggleFilter('flags', 'overrides');
      });
      expect(result.current.getActiveFilters('flags').has('overrides')).toBe(true);

      // Toggle it off
      act(() => {
        result.current.toggleFilter('flags', 'overrides');
      });

      // Should default back to "all" when no filters are selected
      const filters = result.current.getActiveFilters('flags');
      expect(filters.has('overrides')).toBe(false);
      expect(filters.has('all')).toBe(true);
    });

    it('should default to "all" when last non-"all" filter is removed', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      // Select overrides (removes "all")
      act(() => {
        result.current.toggleFilter('flags', 'overrides');
      });

      // Toggle overrides off
      act(() => {
        result.current.toggleFilter('flags', 'overrides');
      });

      const filters = result.current.getActiveFilters('flags');
      expect(filters.has('all')).toBe(true);
      expect(filters.size).toBe(1);
    });
  });

  describe('setFilters', () => {
    it('should set specific filters', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      act(() => {
        result.current.setFilters('flags', ['overrides', 'starred']);
      });

      const filters = result.current.getActiveFilters('flags');
      expect(filters.has('overrides')).toBe(true);
      expect(filters.has('starred')).toBe(true);
      expect(filters.has('all')).toBe(false);
    });

    it('should default to configured defaults when empty array is passed', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      // First change to non-default
      act(() => {
        result.current.setFilters('flags', ['overrides']);
      });

      // Then set empty array
      act(() => {
        result.current.setFilters('flags', []);
      });

      const filters = result.current.getActiveFilters('flags');
      expect(filters.has('all')).toBe(true);
    });
  });

  describe('resetFilters', () => {
    it('should reset filters to default', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      // Change filters
      act(() => {
        result.current.toggleFilter('flags', 'overrides');
        result.current.toggleFilter('flags', 'starred');
      });

      // Reset
      act(() => {
        result.current.resetFilters('flags');
      });

      const filters = result.current.getActiveFilters('flags');
      expect(filters.has('all')).toBe(true);
      expect(filters.size).toBe(1);
    });
  });

  describe('hasActiveNonDefaultFilters', () => {
    it('should return false when default filters are active', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      expect(result.current.hasActiveNonDefaultFilters('flags')).toBe(false);
    });

    it('should return true when non-default filters are active', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      act(() => {
        result.current.toggleFilter('flags', 'overrides');
      });

      expect(result.current.hasActiveNonDefaultFilters('flags')).toBe(true);
    });

    it('should return false for unconfigured subtabs', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      expect(result.current.hasActiveNonDefaultFilters('general')).toBe(false);
    });
  });

  describe('filter overlay state', () => {
    it('should start with overlay closed', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      expect(result.current.isFilterOverlayOpen).toBe(false);
    });

    it('should open overlay when openFilterOverlay is called', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      act(() => {
        result.current.openFilterOverlay();
      });

      expect(result.current.isFilterOverlayOpen).toBe(true);
    });

    it('should close overlay when closeFilterOverlay is called', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      act(() => {
        result.current.openFilterOverlay();
      });

      act(() => {
        result.current.closeFilterOverlay();
      });

      expect(result.current.isFilterOverlayOpen).toBe(false);
    });

    it('should toggle overlay when toggleFilterOverlay is called', () => {
      const { result } = renderHook(() => useFilters(), {
        wrapper: FiltersProvider,
      });

      act(() => {
        result.current.toggleFilterOverlay();
      });
      expect(result.current.isFilterOverlayOpen).toBe(true);

      act(() => {
        result.current.toggleFilterOverlay();
      });
      expect(result.current.isFilterOverlayOpen).toBe(false);
    });
  });

  describe('useSubtabFilters convenience hook', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <FiltersProvider>{children}</FiltersProvider>;

    it('should provide filter state for specific subtab', () => {
      const { result } = renderHook(() => useSubtabFilters('flags'), {
        wrapper,
      });

      expect(result.current.activeFilters.has('all')).toBe(true);
      expect(result.current.config).not.toBeNull();
      expect(result.current.hasFilters).toBe(true);
    });

    it('should provide toggle function for specific subtab', () => {
      const { result } = renderHook(() => useSubtabFilters('flags'), {
        wrapper,
      });

      act(() => {
        result.current.toggle('overrides');
      });

      expect(result.current.activeFilters.has('overrides')).toBe(true);
      expect(result.current.activeFilters.has('all')).toBe(false);
    });

    it('should provide reset function for specific subtab', () => {
      const { result } = renderHook(() => useSubtabFilters('flags'), {
        wrapper,
      });

      act(() => {
        result.current.toggle('overrides');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.activeFilters.has('all')).toBe(true);
    });
  });

  describe('SUBTAB_FILTER_CONFIGS', () => {
    it('should have flags configuration', () => {
      expect(SUBTAB_FILTER_CONFIGS.flags).toBeDefined();
      expect(SUBTAB_FILTER_CONFIGS.flags.subtab).toBe('flags');
      expect(SUBTAB_FILTER_CONFIGS.flags.allowMultiple).toBe(true);
    });

    it('should have events configuration', () => {
      expect(SUBTAB_FILTER_CONFIGS.events).toBeDefined();
      expect(SUBTAB_FILTER_CONFIGS.events.subtab).toBe('events');
      expect(SUBTAB_FILTER_CONFIGS.events.options).toContainEqual(expect.objectContaining({ id: 'feature' }));
    });
  });
});
