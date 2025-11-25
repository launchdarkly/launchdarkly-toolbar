import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Subtab } from '../types';

interface ActiveSubtabContextValue {
  activeSubtab: Subtab | undefined;
  setActiveSubtab: (subtab: Subtab) => void;
}

const ActiveSubtabContext = createContext<ActiveSubtabContextValue | undefined>(undefined);

export interface ActiveSubtabProviderProps {
  children: ReactNode;
}

export function ActiveSubtabProvider({ children }: ActiveSubtabProviderProps) {
  const [activeSubtab, setActiveSubtab] = useState<Subtab | undefined>('flags');

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
