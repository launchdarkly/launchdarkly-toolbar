import React, { createContext, useCallback, useContext, useState } from 'react';
import { loadStarredFlags, saveStarredFlags } from '../utils/localStorage';

type StarredFlagsContextType = {
  toggleStarred: (flagKey: string) => void;
  isStarred: (flagKey: string) => boolean;
};

const StarredFlagsContext = createContext<StarredFlagsContextType | null>(null);

export function StarredFlagsProvider({ children }: { children: React.ReactNode }) {
  const [starredFlags, setStarredFlags] = useState<Set<string>>(loadStarredFlags);

  const toggleStarred = useCallback((flagKey: string) => {
    setStarredFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flagKey)) {
        next.delete(flagKey);
      } else {
        next.add(flagKey);
      }
      saveStarredFlags(next);
      return next;
    });
  }, []);

  const isStarred = useCallback(
    (flagKey: string) => {
      return starredFlags.has(flagKey);
    },
    [starredFlags],
  );

  return (
    <StarredFlagsContext.Provider value={{ toggleStarred, isStarred }}>{children}</StarredFlagsContext.Provider>
  );
}

export function useStarredFlags() {
  const context = useContext(StarredFlagsContext);

  if (!context) {
    throw new Error('useStarredFlags must be used within a StarredFlagsProvider');
  }

  return context;
}
