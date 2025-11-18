import { IFlagOverridePlugin } from '../../../../types';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useFlagsContext } from './FlagsProvider';
import { ApiFlag } from '../types/ldApi';

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
  const { flags: apiFlags, loading: loadingApiFlags } = useFlagsContext();
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
    (allFlags: Record<string, any>, apiFlags: ApiFlag[]): Record<string, LocalFlag> => {
      const overrides = flagOverridePlugin.getAllOverrides();
      const result: Record<string, LocalFlag> = {};

      // First, add all flags from the API (these have proper names)
      apiFlags.forEach((apiFlag) => {
        const currentValue = allFlags[apiFlag.key];
        result[apiFlag.key] = {
          key: apiFlag.key,
          name: apiFlag.name,
          currentValue,
          isOverridden: apiFlag.key in overrides,
          type: inferFlagType(currentValue),
        };
      });

      // Then, add any flags from the LD client that aren't in apiFlags
      // This ensures flags are displayed even if the API hasn't loaded yet
      Object.keys(allFlags).forEach((flagKey) => {
        if (!result[flagKey]) {
          result[flagKey] = {
            key: flagKey,
            name: formatFlagName(flagKey),
            currentValue: allFlags[flagKey],
            isOverridden: flagKey in overrides,
            type: inferFlagType(allFlags[flagKey]),
          };
        }
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

    if (loadingApiFlags) {
      setIsLoading(true);
      return;
    }

    // Get initial flags
    const initialFlags = ldClient.allFlags();
    const initialFlagState = buildFlags(initialFlags, apiFlags);
    setFlags(initialFlagState);
    setIsLoading(false);

    // Subscribe to changes with incremental updates
    const handleChange = (changes: Record<string, { current: any }>) => {
      setFlags((prevFlags) => {
        const updatedRawFlags = ldClient.allFlags();
        const newFlags = buildFlags(updatedRawFlags, apiFlags);

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
          const newFlag = newFlags[flagKey];
          if (!prevFlags[flagKey] && newFlag) {
            updatedFlags[flagKey] = newFlag;
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
  }, [ldClient, buildFlags, apiFlags, loadingApiFlags]);

  return (
    <FlagSdkOverrideContext.Provider
      value={{
        flags,
        isLoading,
      }}
    >
      {children}
    </FlagSdkOverrideContext.Provider>
  );
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
