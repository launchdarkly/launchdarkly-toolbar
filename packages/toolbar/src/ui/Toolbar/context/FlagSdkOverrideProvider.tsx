import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { IFlagOverridePlugin } from '../../../types/plugin';

interface LocalFlag {
  key: string;
  name: string;
  currentValue: any;
  isOverridden: boolean;
  type: 'boolean' | 'string' | 'number' | 'object';
}

interface FlagSdkOverrideContextType {
  flags: Record<string, LocalFlag>;
  isLoading: boolean;
}

const FlagSdkOverrideContext = createContext<FlagSdkOverrideContextType | null>(null);

interface FlagSdkOverrideProviderProps {
  children: React.ReactNode;
  flagOverridePlugin: IFlagOverridePlugin;
}

export function FlagSdkOverrideProvider({ children, flagOverridePlugin }: FlagSdkOverrideProviderProps) {
  const [flags, setFlags] = useState<Record<string, LocalFlag>>({});
  const [isLoading, setIsLoading] = useState(true);

  const ldClient = flagOverridePlugin.getClient();

  // Helper functions - memoized to prevent unnecessary re-renders
  const formatFlagName = useCallback((flagKey: string): string => {
    return flagKey
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, []);

  const inferFlagType = useCallback((value: any): 'boolean' | 'string' | 'number' | 'object' => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    return 'object';
  }, []);

  // Build flags from raw values and overrides
  const buildFlags = useCallback(
    (allFlags: Record<string, any>): Record<string, LocalFlag> => {
      const overrides = flagOverridePlugin.getAllOverrides();
      const result: Record<string, LocalFlag> = {};

      Object.keys(allFlags)
        .sort()
        .forEach((flagKey) => {
          const currentValue = allFlags[flagKey];
          result[flagKey] = {
            key: flagKey,
            name: formatFlagName(flagKey),
            currentValue,
            isOverridden: flagKey in overrides,
            type: inferFlagType(currentValue),
          };
        });

      return result;
    },
    [flagOverridePlugin, formatFlagName, inferFlagType],
  );

  useEffect(() => {
    if (!ldClient) {
      setFlags({});
      setIsLoading(false);
      return;
    }

    // Get initial flags
    const initialFlags = ldClient.allFlags();
    const initialFlagState = buildFlags(initialFlags);
    setFlags(initialFlagState);
    setIsLoading(false);

    // Subscribe to changes with incremental updates
    const handleChange = (changes: Record<string, { current: any }>) => {
      setFlags((prevFlags) => {
        const updatedRawFlags = ldClient.allFlags();
        const newFlags = buildFlags(updatedRawFlags);

        // Only update the flags that actually changed for better performance
        const updatedFlags = { ...prevFlags };
        let hasChanges = false;

        Object.keys(changes).forEach((flagKey) => {
          if (newFlags[flagKey]) {
            updatedFlags[flagKey] = newFlags[flagKey];
            hasChanges = true;
          }
        });

        // Also check for new flags that might have been added
        Object.keys(newFlags).forEach((flagKey) => {
          if (!prevFlags[flagKey]) {
            updatedFlags[flagKey] = newFlags[flagKey];
            hasChanges = true;
          }
        });

        return hasChanges ? updatedFlags : prevFlags;
      });
    };

    ldClient.on('change', handleChange);

    return () => {
      ldClient.off('change', handleChange);
    };
  }, [ldClient, buildFlags]);

  return <FlagSdkOverrideContext.Provider value={{ flags, isLoading }}>{children}</FlagSdkOverrideContext.Provider>;
}

// Hook to access the local overrides flag context
export function useFlagSdkOverrideContext() {
  const context = useContext(FlagSdkOverrideContext);
  if (!context) {
    throw new Error('useFlagSdkOverrideContext must be used within a FlagSdkOverrideProvider');
  }
  return context;
}

// Export types for external use
export type { LocalFlag, FlagSdkOverrideContextType };
