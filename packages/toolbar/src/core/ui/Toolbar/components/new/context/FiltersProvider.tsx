import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { SubTab } from '../types';

// Filter option definition
export interface FilterOption {
  id: string;
  label: string;
  description?: string;
}

// Filter configuration for a subtab
export interface SubtabFilterConfig {
  subtab: SubTab;
  options: FilterOption[];
  defaultSelected: string[];
  allowMultiple: boolean;
}

// Predefined filter configurations for each subtab that supports filtering
export const SUBTAB_FILTER_CONFIGS: Record<string, SubtabFilterConfig> = {
  flags: {
    subtab: 'flags',
    options: [
      { id: 'all', label: 'All', description: 'Show all flags' },
      { id: 'overrides', label: 'Overrides', description: 'Show overridden flags' },
      { id: 'starred', label: 'Starred', description: 'Show starred flags' },
    ],
    defaultSelected: ['all'],
    allowMultiple: true,
  },
  events: {
    subtab: 'events',
    options: [
      { id: 'all', label: 'All', description: 'Show all events' },
      { id: 'feature', label: 'Feature', description: 'Show feature flag evaluations' },
      { id: 'custom', label: 'Custom', description: 'Show custom events' },
      { id: 'identify', label: 'Identify', description: 'Show identify events' },
    ],
    defaultSelected: ['all'],
    allowMultiple: true,
  },
};

// Filter state for a single subtab
interface SubtabFilterState {
  activeFilters: Set<string>;
  config: SubtabFilterConfig;
}

// Context value type
interface FiltersContextValue {
  // Get the current filter state for the active subtab
  getActiveFilters: (subtab: SubTab) => Set<string>;

  // Get the filter config for a subtab
  getFilterConfig: (subtab: SubTab) => SubtabFilterConfig | null;

  // Toggle a filter for a subtab
  toggleFilter: (subtab: SubTab, filterId: string) => void;

  // Set all filters for a subtab
  setFilters: (subtab: SubTab, filterIds: string[]) => void;

  // Reset filters to default for a subtab
  resetFilters: (subtab: SubTab) => void;

  // Check if a subtab has filters available
  hasFilters: (subtab: SubTab) => boolean;

  // Check if any non-default filters are active
  hasActiveNonDefaultFilters: (subtab: SubTab) => boolean;

  // Filter overlay state
  isFilterOverlayOpen: boolean;
  openFilterOverlay: () => void;
  closeFilterOverlay: () => void;
  toggleFilterOverlay: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

interface FiltersProviderProps {
  children: ReactNode;
}

export function FiltersProvider({ children }: FiltersProviderProps) {
  // Store filter state per subtab
  const [filterStates, setFilterStates] = useState<Record<string, SubtabFilterState>>(() => {
    // Initialize with default filters for each configured subtab
    const initial: Record<string, SubtabFilterState> = {};
    Object.entries(SUBTAB_FILTER_CONFIGS).forEach(([key, config]) => {
      initial[key] = {
        activeFilters: new Set(config.defaultSelected),
        config,
      };
    });
    return initial;
  });

  // Filter overlay state
  const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);

  const getActiveFilters = useCallback(
    (subtab: SubTab): Set<string> => {
      return filterStates[subtab]?.activeFilters || new Set(['all']);
    },
    [filterStates],
  );

  const getFilterConfig = useCallback((subtab: SubTab): SubtabFilterConfig | null => {
    return SUBTAB_FILTER_CONFIGS[subtab] || null;
  }, []);

  const toggleFilter = useCallback((subtab: SubTab, filterId: string) => {
    setFilterStates((prev) => {
      const config = SUBTAB_FILTER_CONFIGS[subtab];
      if (!config) return prev;

      const currentState = prev[subtab] || {
        activeFilters: new Set(config.defaultSelected),
        config,
      };

      const newFilters = new Set(currentState.activeFilters);

      // Special handling for 'all' filter
      if (filterId === 'all') {
        // If clicking 'all', select only 'all'
        return {
          ...prev,
          [subtab]: {
            ...currentState,
            activeFilters: new Set(['all']),
          },
        };
      }

      // If 'all' is currently selected and we're selecting something else
      if (newFilters.has('all')) {
        newFilters.delete('all');
      }

      // Toggle the filter
      if (newFilters.has(filterId)) {
        newFilters.delete(filterId);
        // If no filters left, default to 'all'
        if (newFilters.size === 0) {
          newFilters.add('all');
        }
      } else {
        if (config.allowMultiple) {
          newFilters.add(filterId);
        } else {
          // Single select mode - replace current selection
          newFilters.clear();
          newFilters.add(filterId);
        }
      }

      return {
        ...prev,
        [subtab]: {
          ...currentState,
          activeFilters: newFilters,
        },
      };
    });
  }, []);

  const setFilters = useCallback((subtab: SubTab, filterIds: string[]) => {
    const config = SUBTAB_FILTER_CONFIGS[subtab];
    if (!config) return;

    setFilterStates((prev) => ({
      ...prev,
      [subtab]: {
        config,
        activeFilters: new Set(filterIds.length > 0 ? filterIds : config.defaultSelected),
      },
    }));
  }, []);

  const resetFilters = useCallback((subtab: SubTab) => {
    const config = SUBTAB_FILTER_CONFIGS[subtab];
    if (!config) return;

    setFilterStates((prev) => ({
      ...prev,
      [subtab]: {
        config,
        activeFilters: new Set(config.defaultSelected),
      },
    }));
  }, []);

  const hasFilters = useCallback((subtab: SubTab): boolean => {
    return SUBTAB_FILTER_CONFIGS[subtab] !== undefined;
  }, []);

  const hasActiveNonDefaultFilters = useCallback(
    (subtab: SubTab): boolean => {
      const config = SUBTAB_FILTER_CONFIGS[subtab];
      if (!config) return false;

      const currentFilters = filterStates[subtab]?.activeFilters || new Set(config.defaultSelected);
      const defaultFilters = new Set(config.defaultSelected);

      // Check if current filters differ from defaults
      if (currentFilters.size !== defaultFilters.size) return true;
      for (const filter of currentFilters) {
        if (!defaultFilters.has(filter)) return true;
      }
      return false;
    },
    [filterStates],
  );

  const openFilterOverlay = useCallback(() => setIsFilterOverlayOpen(true), []);
  const closeFilterOverlay = useCallback(() => setIsFilterOverlayOpen(false), []);
  const toggleFilterOverlay = useCallback(() => setIsFilterOverlayOpen((prev) => !prev), []);

  const value = useMemo<FiltersContextValue>(
    () => ({
      getActiveFilters,
      getFilterConfig,
      toggleFilter,
      setFilters,
      resetFilters,
      hasFilters,
      hasActiveNonDefaultFilters,
      isFilterOverlayOpen,
      openFilterOverlay,
      closeFilterOverlay,
      toggleFilterOverlay,
    }),
    [
      getActiveFilters,
      getFilterConfig,
      toggleFilter,
      setFilters,
      resetFilters,
      hasFilters,
      hasActiveNonDefaultFilters,
      isFilterOverlayOpen,
      openFilterOverlay,
      closeFilterOverlay,
      toggleFilterOverlay,
    ],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters(): FiltersContextValue {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}

// Convenience hook to get filter state for the current subtab
export function useSubtabFilters(subtab: SubTab) {
  const { getActiveFilters, getFilterConfig, toggleFilter, resetFilters, hasFilters, hasActiveNonDefaultFilters } =
    useFilters();

  return useMemo(
    () => ({
      activeFilters: getActiveFilters(subtab),
      config: getFilterConfig(subtab),
      toggle: (filterId: string) => toggleFilter(subtab, filterId),
      reset: () => resetFilters(subtab),
      hasFilters: hasFilters(subtab),
      hasActiveNonDefaultFilters: hasActiveNonDefaultFilters(subtab),
    }),
    [subtab, getActiveFilters, getFilterConfig, toggleFilter, resetFilters, hasFilters, hasActiveNonDefaultFilters],
  );
}
