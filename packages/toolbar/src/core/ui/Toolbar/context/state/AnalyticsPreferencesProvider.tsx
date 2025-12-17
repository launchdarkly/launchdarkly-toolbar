import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

import {
  saveIsOptedInToAnalytics,
  saveIsOptedInToEnhancedAnalytics,
  loadIsOptedInToEnhancedAnalytics,
  loadIsOptedInToAnalytics,
  loadIsOptedInToSessionReplay,
  saveIsOptedInToSessionReplay,
} from '../../utils/localStorage';

export interface AnalyticsPreferencesContextValue {
  // State values
  isOptedInToAnalytics: boolean;
  isOptedInToEnhancedAnalytics: boolean;
  isOptedInToSessionReplay: boolean;

  // Handlers
  handleToggleAnalyticsOptOut: (enabled: boolean) => void;
  handleToggleEnhancedAnalyticsOptOut: (enabled: boolean) => void;
  handleToggleSessionReplayOptOut: (enabled: boolean) => void;
}

const AnalyticsPreferencesContext = createContext<AnalyticsPreferencesContextValue | undefined>(undefined);

export interface AnalyticsPreferencesProviderProps {
  children: ReactNode;
}

export function AnalyticsPreferencesProvider({ children }: AnalyticsPreferencesProviderProps) {
  const [isOptedInToAnalytics, setIsOptedInToAnalytics] = useState(() => loadIsOptedInToAnalytics());
  const [isOptedInToEnhancedAnalytics, setIsOptedInToEnhancedAnalytics] = useState(() =>
    loadIsOptedInToEnhancedAnalytics(),
  );
  const [isOptedInToSessionReplay, setIsOptedInToSessionReplay] = useState(() => loadIsOptedInToSessionReplay());

  const handleToggleEnhancedAnalyticsOptOut = useCallback((enabled: boolean) => {
    saveIsOptedInToEnhancedAnalytics(enabled);
    setIsOptedInToEnhancedAnalytics(enabled);
  }, []);

  const handleToggleSessionReplayOptOut = useCallback((enabled: boolean) => {
    saveIsOptedInToSessionReplay(enabled);
    setIsOptedInToSessionReplay(enabled);
  }, []);

  const handleToggleAnalyticsOptOut = useCallback(
    (enabled: boolean) => {
      saveIsOptedInToAnalytics(enabled);
      setIsOptedInToAnalytics(enabled);

      // If disabling analytics, also disable enhanced analytics and session replay
      if (!enabled) {
        handleToggleEnhancedAnalyticsOptOut(false);
        handleToggleSessionReplayOptOut(false);
      }
    },
    [handleToggleEnhancedAnalyticsOptOut, handleToggleSessionReplayOptOut],
  );

  const value = useMemo<AnalyticsPreferencesContextValue>(
    () => ({
      isOptedInToAnalytics,
      isOptedInToEnhancedAnalytics,
      isOptedInToSessionReplay,
      handleToggleAnalyticsOptOut,
      handleToggleEnhancedAnalyticsOptOut,
      handleToggleSessionReplayOptOut,
    }),
    [
      isOptedInToAnalytics,
      isOptedInToEnhancedAnalytics,
      isOptedInToSessionReplay,
      handleToggleAnalyticsOptOut,
      handleToggleEnhancedAnalyticsOptOut,
      handleToggleSessionReplayOptOut,
    ],
  );

  return <AnalyticsPreferencesContext.Provider value={value}>{children}</AnalyticsPreferencesContext.Provider>;
}

export function useAnalyticsPreferences(): AnalyticsPreferencesContextValue {
  const context = useContext(AnalyticsPreferencesContext);
  if (context === undefined) {
    throw new Error('useAnalyticsPreferences must be used within an AnalyticsPreferencesProvider');
  }
  return context;
}

