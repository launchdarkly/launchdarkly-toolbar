import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { TOOLBAR_STORAGE_KEYS } from '../utils/localStorage';
import { useLocalStorage } from '../hooks/useLocalStorage';

type StarredFlagsContextType = {
  toggleStarred: (flagKey: string) => void;
  isStarred: (flagKey: string) => boolean;
  clearAllStarred: () => void;
  starredCount: number;
};

const StarredFlagsContext = createContext<StarredFlagsContextType | null>(null);

export function StarredFlagsProvider({ children }: { children: React.ReactNode }) {
  const [starredArray, setStarredArray] = useLocalStorage<string[]>(TOOLBAR_STORAGE_KEYS.STARRED_FLAGS, []);

  const starredFlags = useMemo(() => new Set(starredArray), [starredArray]);

  const toggleStarred = useCallback(
    (flagKey: string) => {
      setStarredArray((prev) => {
        if (prev.includes(flagKey)) {
          return prev.filter((key) => key !== flagKey);
        } else {
          return [...prev, flagKey];
        }
      });
    },
    [setStarredArray],
  );

  const isStarred = useCallback(
    (flagKey: string) => {
      return starredFlags.has(flagKey);
    },
    [starredFlags],
  );

  const clearAllStarred = useCallback(() => {
    setStarredArray([]);
  }, [setStarredArray]);

  const starredCount = starredFlags.size;

  return (
    <StarredFlagsContext.Provider value={{ toggleStarred, isStarred, clearAllStarred, starredCount }}>
      {children}
    </StarredFlagsContext.Provider>
  );
}

export function useStarredFlags() {
  const context = useContext(StarredFlagsContext);

  if (!context) {
    throw new Error('useStarredFlags must be used within a StarredFlagsProvider');
  }

  return context;
}
