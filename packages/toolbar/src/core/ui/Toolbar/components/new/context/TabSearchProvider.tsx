import { createContext } from 'react';
import { useState } from 'react';
import { TabId } from '../../../types';
import { useCallback } from 'react';
import { useContext } from 'react';

type TabSearchContextType = {
  searchTerms: Record<TabId, string>;
  setSearchTerm: (tab: TabId, searchTerm: string) => void;
};

const TabSearchContext = createContext<TabSearchContextType>({
  searchTerms: {
    'flag-sdk': '',
    'flag-dev-server': '',
    events: '',
    settings: '',
    flags: '',
    monitoring: '',
    interactive: '',
    ai: '',
    optimize: '',
  },
  setSearchTerm: () => {},
});

export function TabSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerms, setSearchTerms] = useState<Record<TabId, string>>({
    'flag-sdk': '',
    'flag-dev-server': '',
    events: '',
    settings: '',
    flags: '',
    monitoring: '',
    interactive: '',
    ai: '',
    optimize: '',
  });

  const setSearchTerm = useCallback((tab: TabId, searchTerm: string) => {
    setSearchTerms((prev) => ({ ...prev, [tab]: searchTerm }));
  }, []);

  return <TabSearchContext.Provider value={{ searchTerms, setSearchTerm }}>{children}</TabSearchContext.Provider>;
}

export function useTabSearchContext() {
  const context = useContext(TabSearchContext);
  if (!context) {
    throw new Error('useTabSearchContext must be used within TabSearchProvider');
  }
  return context;
}
