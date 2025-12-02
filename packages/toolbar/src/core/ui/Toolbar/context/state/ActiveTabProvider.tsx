import { createContext, useContext, useState, useCallback } from 'react';
import type { ActiveTabId } from '../../types';

type ActiveTabContextType = {
  activeTab: ActiveTabId;
  setActiveTab: (tab: ActiveTabId) => void;
};

const ActiveTabContext = createContext<ActiveTabContextType>({
  activeTab: undefined,
  setActiveTab: () => {},
});

export function ActiveTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<ActiveTabId>(undefined);

  const setActiveTab = useCallback((tab: ActiveTabId) => {
    setActiveTabState(tab);
  }, []);

  return <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>{children}</ActiveTabContext.Provider>;
}

export function useActiveTabContext() {
  const context = useContext(ActiveTabContext);
  if (!context) {
    throw new Error('useActiveTabContext must be used within an ActiveTabProvider');
  }
  return context;
}
