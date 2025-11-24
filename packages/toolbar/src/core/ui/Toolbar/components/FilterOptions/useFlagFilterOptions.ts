import { createContext, useContext } from 'react';

export const FILTER_MODES = {
  ALL: 'all',
  OVERRIDES: 'overrides',
  STARRED: 'starred',
} as const;

export type FlagFilterMode = (typeof FILTER_MODES)[keyof typeof FILTER_MODES];

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
