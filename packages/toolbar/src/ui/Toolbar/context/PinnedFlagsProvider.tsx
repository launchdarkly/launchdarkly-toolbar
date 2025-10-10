import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadPinnedFlags, savePinnedFlags } from '../utils/localStorage';
import { useAnalytics } from './AnalyticsProvider';

interface PinnedFlagsContextValue {
  pinnedFlags: Set<string>;
  togglePin: (flagKey: string) => void;
  isPinned: (flagKey: string) => boolean;
  clearAllPins: () => void;
  cleanupDeletedFlags: (currentFlagKeys: Set<string>) => void;
}

const PinnedFlagsContext = createContext<PinnedFlagsContextValue | undefined>(undefined);

interface PinnedFlagsProviderProps {
  children: React.ReactNode;
}

export function PinnedFlagsProvider({ children }: PinnedFlagsProviderProps) {
  const [pinnedFlags, setPinnedFlags] = useState<Set<string>>(() => loadPinnedFlags());
  const analytics = useAnalytics();

  // Persist to localStorage whenever pinnedFlags changes
  useEffect(() => {
    savePinnedFlags(pinnedFlags);
  }, [pinnedFlags]);

  const togglePin = useCallback(
    (flagKey: string) => {
      setPinnedFlags((prev) => {
        const next = new Set(prev);
        const wasPinned = next.has(flagKey);

        if (wasPinned) {
          next.delete(flagKey);
          analytics.trackFlagUnpinned(flagKey);
        } else {
          next.add(flagKey);
          analytics.trackFlagPinned(flagKey);
        }

        return next;
      });
    },
    [analytics],
  );

  const isPinned = useCallback(
    (flagKey: string) => {
      return pinnedFlags.has(flagKey);
    },
    [pinnedFlags],
  );

  const clearAllPins = useCallback(() => {
    setPinnedFlags((prev) => {
      const count = prev.size;
      if (count > 0) {
        analytics.trackClearAllPins(count);
      }
      return new Set();
    });
  }, [analytics]);

  const cleanupDeletedFlags = useCallback(
    (currentFlagKeys: Set<string>) => {
      setPinnedFlags((prev) => {
        const deletedFlags: string[] = [];

        // Find pinned flags that no longer exist
        prev.forEach((flagKey) => {
          if (!currentFlagKeys.has(flagKey)) {
            deletedFlags.push(flagKey);
          }
        });

        // If no flags need cleanup, return the same set to avoid re-renders
        if (deletedFlags.length === 0) {
          return prev;
        }

        // Create new set without deleted flags
        const next = new Set<string>();
        prev.forEach((flagKey) => {
          if (currentFlagKeys.has(flagKey)) {
            next.add(flagKey);
          }
        });

        // Track cleanup event
        analytics.trackCleanupDeletedFlags(deletedFlags, deletedFlags.length);

        return next;
      });
    },
    [analytics],
  );

  const value: PinnedFlagsContextValue = {
    pinnedFlags,
    togglePin,
    isPinned,
    clearAllPins,
    cleanupDeletedFlags,
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
