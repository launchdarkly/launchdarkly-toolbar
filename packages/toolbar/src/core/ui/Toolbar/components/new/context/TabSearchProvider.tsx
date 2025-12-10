import { createContext, useState, useCallback, useContext } from 'react';
import { SubTab } from '../types';

type SubTabSearchContextType = {
  searchTerms: Record<SubTab, string>;
  setSearchTerm: (subtab: SubTab, searchTerm: string) => void;
  clearSearchTerm: (subtab: SubTab) => void;
  clearAllSearchTerms: () => void;
};

const defaultSearchTerms: Record<SubTab, string> = {
  flags: '',
  contexts: '',
  events: '',
  general: '',
  workflows: '',
};

const TabSearchContext = createContext<SubTabSearchContextType>({
  searchTerms: defaultSearchTerms,
  setSearchTerm: () => {},
  clearSearchTerm: () => {},
  clearAllSearchTerms: () => {},
});

export function TabSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerms, setSearchTerms] = useState<Record<SubTab, string>>(defaultSearchTerms);

  const setSearchTerm = useCallback((subtab: SubTab, searchTerm: string) => {
    setSearchTerms((prev) => ({ ...prev, [subtab]: searchTerm }));
  }, []);

  const clearSearchTerm = useCallback((subtab: SubTab) => {
    setSearchTerms((prev) => ({ ...prev, [subtab]: '' }));
  }, []);

  const clearAllSearchTerms = useCallback(() => {
    setSearchTerms(defaultSearchTerms);
  }, []);

  return (
    <TabSearchContext.Provider value={{ searchTerms, setSearchTerm, clearSearchTerm, clearAllSearchTerms }}>
      {children}
    </TabSearchContext.Provider>
  );
}

export function useTabSearchContext() {
  const context = useContext(TabSearchContext);
  if (!context) {
    throw new Error('useTabSearchContext must be used within TabSearchProvider');
  }
  return context;
}
