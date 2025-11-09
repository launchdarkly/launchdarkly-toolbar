import { createContext, useContext } from 'react';

export type FlagFilterMode = 'all' | 'overrides' | 'starred';

interface FlagFilterOptionsContextType {
  activeFilters: Set<FlagFilterMode>;
  onFilterToggle: (filter: FlagFilterMode) => void;
}

export const FlagFilterOptionsContext = createContext<FlagFilterOptionsContextType | undefined>(undefined);

export const useFlagFilterOptions = () => {
  const context = useContext(FlagFilterOptionsContext);
  if (!context) {
    throw new Error('useFlagFilterOptions must be used within a FlagFilterOptionsContext.Provider');
  }
  return context;
};
