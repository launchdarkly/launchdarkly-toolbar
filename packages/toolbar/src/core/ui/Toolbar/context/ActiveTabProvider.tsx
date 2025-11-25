import { createContext, useContext, useState, useCallback } from 'react';
import type { ActiveTabId, NewActiveTabId } from '../types/toolbar';

type ActiveTabContextType = {
  activeTab: ActiveTabId | NewActiveTabId;
  setActiveTab: (tab: ActiveTabId | NewActiveTabId) => void;
};

const ActiveTabContext = createContext<ActiveTabContextType>({
  activeTab: undefined,
  setActiveTab: () => {},
});

export function ActiveTabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTabState] = useState<ActiveTabId | NewActiveTabId>(undefined);

  const setActiveTab = useCallback((tab: ActiveTabId | NewActiveTabId) => {
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
