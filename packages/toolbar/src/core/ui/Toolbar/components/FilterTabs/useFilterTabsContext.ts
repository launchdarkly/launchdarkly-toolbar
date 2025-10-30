import { createContext, useContext } from 'react';

export type FilterMode = 'all' | 'overrides' | 'starred';

interface FilterTabsContextType {
  activeFilter: FilterMode;
  onFilterChange: (filter: FilterMode) => void;
}

export const FilterTabsContext = createContext<FilterTabsContextType | undefined>(undefined);

export const useFilterTabsContext = () => {
  const context = useContext(FilterTabsContext);
  if (!context) {
    throw new Error('useFilterTabsContext must be used within a FilterTabsContext.Provider');
  }
  return context;
};
