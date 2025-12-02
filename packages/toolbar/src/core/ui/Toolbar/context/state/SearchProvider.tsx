import React, { createContext, Dispatch, type SetStateAction, useContext, useEffect, useState } from 'react';
import { useAnalytics } from '../telemetry/AnalyticsProvider';

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

const SearchContext = createContext<SearchContextType>({
  searchTerm: '',
  setSearchTerm: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackSearch(searchTerm);
  }, [searchTerm, analytics]);

  return <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>{children}</SearchContext.Provider>;
}

export function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }

  return context;
}
