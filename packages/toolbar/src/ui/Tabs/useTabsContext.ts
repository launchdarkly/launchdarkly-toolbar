import { createContext, useContext } from 'react';

interface TabsContextType {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a Tabs component');
  }
  return context;
};
