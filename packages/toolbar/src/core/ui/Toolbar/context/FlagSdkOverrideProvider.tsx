import { IFlagOverridePlugin } from '../../../../types';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useFlagsContext } from './api/FlagsProvider';
import { ApiFlag, ApiVariation } from '../types/ldApi';

interface LocalFlag {
  key: string;
  name: string;
  currentValue: any;
  isOverridden: boolean;
  type: 'boolean' | 'multivariate' | 'string' | 'number' | 'object';
  availableVariations: ApiVariation[];
}

interface FlagSdkOverrideContextType {
  flags: Record<string, LocalFlag>;
  isLoading: boolean;
  setOverride: (flagKey: string, value: any) => void;
  removeOverride: (flagKey: string) => void;
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

  const determineFlagType = useCallback(
    (variations: ApiVariation[] = [], value: any): 'boolean' | 'multivariate' | 'string' | 'number' | 'object' => {
      if (variations.length === 2 && variations.every((v) => typeof v.value === 'boolean')) {
        return 'boolean';
      }

      if (variations.length >= 2 && !variations.some((v) => typeof v.value === 'object')) {
        return 'multivariate';
      }

      if (typeof value === 'string') return 'string';
      if (typeof value === 'number') return 'number';
      if (typeof value === 'object') return 'object';
      return 'boolean';
    },
    [],
  );

  // Build flags from raw values and overrides
  const buildFlags = useCallback(
    (allFlags: Record<string, any>, apiFlags: ApiFlag[]): Record<string, LocalFlag> => {
      const overrides = flagOverridePlugin.getAllOverrides();

      // Create a map of API flags for quick lookup
      const apiFlagsMap = new Map<string, ApiFlag>();
      apiFlags.forEach((apiFlag) => {
        apiFlagsMap.set(apiFlag.key, apiFlag);
      });

      // Build result using SDK client order (allFlags) to preserve initial ordering
      // Then sort by key for consistent ordering
      const result: Record<string, LocalFlag> = {};
      const flagKeys = Object.keys(allFlags).sort((a, b) => a.localeCompare(b));

      flagKeys.forEach((flagKey) => {
        const currentValue = allFlags[flagKey];
        const apiFlag = apiFlagsMap.get(flagKey);

        result[flagKey] = {
          key: flagKey,
          name: apiFlag?.name || formatFlagName(flagKey),
          currentValue,
          isOverridden: flagKey in overrides,
          type: determineFlagType(apiFlag?.variations || [], currentValue),
          availableVariations: apiFlag?.variations || [],
        };
      });

      return result;
    },
    [flagOverridePlugin, formatFlagName, determineFlagType],
  );

  useEffect(() => {
    if (!ldClient) {
      setFlags({});
      setIsLoading(false);
      return;
    }

    // Get initial flags
    const initialFlags = ldClient.allFlags();
    const initialFlagState = buildFlags(initialFlags, apiFlags);
    setFlags(initialFlagState);
    setIsLoading(false);

    // Subscribe to changes with incremental updates
    // NOTE: we are overloading this function so that it can handle both the old and new browser SDKs
    const handleChange = (changes: Record<string, { current: any }>, keys: string[]) => {
      setFlags((prevFlags) => {
        const updatedRawFlags = ldClient.allFlags();
        const newFlags = buildFlags(updatedRawFlags, apiFlags);

        let changedKeys = keys;
        if (changedKeys === undefined) {
          changedKeys = Object.keys(changes);
        }

        // Only update the flags that actually changed for better performance
        const updatedFlags = { ...prevFlags };
        let hasChanges = false;

        changedKeys.forEach((flagKey) => {
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

  const setOverride = useCallback(
    (flagKey: string, value: any) => {
      flagOverridePlugin.setOverride(flagKey, value);

      // Optimistically update local state immediately
      // The SDK's 'change' event may not fire for debug overrides
      setFlags((prevFlags) => {
        const existingFlag = prevFlags[flagKey];
        if (!existingFlag) return prevFlags;

        return {
          ...prevFlags,
          [flagKey]: {
            ...existingFlag,
            currentValue: value,
            isOverridden: true,
          },
        };
      });
    },
    [flagOverridePlugin],
  );

  const removeOverride = useCallback(
    (flagKey: string) => {
      flagOverridePlugin.removeOverride(flagKey);

      // Optimistically update local state
      // Need to get the original value from SDK after override is removed
      const ldClient = flagOverridePlugin.getClient();
      if (!ldClient) return;

      // Use setTimeout to ensure SDK has processed the removal
      setTimeout(() => {
        const allFlags = ldClient.allFlags();
        const originalValue = allFlags[flagKey];

        setFlags((prevFlags) => {
          const existingFlag = prevFlags[flagKey];
          if (!existingFlag) return prevFlags;

          return {
            ...prevFlags,
            [flagKey]: {
              ...existingFlag,
              currentValue: originalValue,
              isOverridden: false,
            },
          };
        });
      }, 0);
    },
    [flagOverridePlugin],
  );

  return (
    <FlagSdkOverrideContext.Provider
      value={{
        flags,
        isLoading,
        setOverride,
        removeOverride,
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
