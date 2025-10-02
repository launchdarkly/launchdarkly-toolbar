import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadPinnedFlags, savePinnedFlags } from '../utils/localStorage';

interface PinnedFlagsContextValue {
  pinnedFlags: Set<string>;
  togglePin: (flagKey: string) => void;
  isPinned: (flagKey: string) => boolean;
  clearAllPins: () => void;
}

const PinnedFlagsContext = createContext<PinnedFlagsContextValue | undefined>(undefined);

interface PinnedFlagsProviderProps {
  children: React.ReactNode;
}

export function PinnedFlagsProvider({ children }: PinnedFlagsProviderProps) {
  const [pinnedFlags, setPinnedFlags] = useState<Set<string>>(() => loadPinnedFlags());

  // Persist to localStorage whenever pinnedFlags changes
  useEffect(() => {
    savePinnedFlags(pinnedFlags);
  }, [pinnedFlags]);

  const togglePin = useCallback((flagKey: string) => {
    setPinnedFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flagKey)) {
        next.delete(flagKey);
      } else {
        next.add(flagKey);
      }
      return next;
    });
  }, []);

  const isPinned = useCallback(
    (flagKey: string) => {
      return pinnedFlags.has(flagKey);
    },
    [pinnedFlags],
  );

  const clearAllPins = useCallback(() => {
    setPinnedFlags(new Set());
  }, []);

  const value: PinnedFlagsContextValue = {
    pinnedFlags,
    togglePin,
    isPinned,
    clearAllPins,
  };

  return <PinnedFlagsContext.Provider value={value}>{children}</PinnedFlagsContext.Provider>;
}

export function usePinnedFlags() {
  const context = useContext(PinnedFlagsContext);
  if (context === undefined) {
    throw new Error('usePinnedFlags must be used within a PinnedFlagsProvider');
  }
  return context;
}
