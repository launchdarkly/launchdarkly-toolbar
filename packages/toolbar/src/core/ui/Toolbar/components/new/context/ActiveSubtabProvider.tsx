import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { SubTab } from '../types';

interface ActiveSubtabContextValue {
  activeSubtab: SubTab | undefined;
  setActiveSubtab: (subtab: SubTab) => void;
}

const ActiveSubtabContext = createContext<ActiveSubtabContextValue | undefined>(undefined);

export interface ActiveSubtabProviderProps {
  children: ReactNode;
}

export function ActiveSubtabProvider({ children }: ActiveSubtabProviderProps) {
  const [activeSubtab, setActiveSubtab] = useState<SubTab | undefined>('flags');

  const value = useMemo(
    () => ({
      activeSubtab,
      setActiveSubtab,
    }),
    [activeSubtab],
  );

  return <ActiveSubtabContext.Provider value={value}>{children}</ActiveSubtabContext.Provider>;
}

export function useActiveSubtabContext(): ActiveSubtabContextValue {
  const context = useContext(ActiveSubtabContext);
  if (!context) {
    throw new Error('useActiveSubtabContext must be used within ActiveSubtabProvider');
  }
  return context;
}
