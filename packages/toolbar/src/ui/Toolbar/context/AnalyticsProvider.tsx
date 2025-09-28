import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import type { IFlagOverridePlugin } from '../../../types/plugin';
import { ToolbarAnalytics } from '../../../utils/analytics';

interface AnalyticsContextValue {
  analytics: ToolbarAnalytics;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  flagOverridePlugin?: IFlagOverridePlugin;
}

export function AnalyticsProvider({ children, flagOverridePlugin }: AnalyticsProviderProps) {
  const analytics = useMemo(() => new ToolbarAnalytics(flagOverridePlugin), [flagOverridePlugin]);
  const hasInitialized = useRef(false);

  // Track initialization once (prevent duplicates during development)
  useEffect(() => {
    if (!hasInitialized.current) {
      analytics.trackInitialization();
      hasInitialized.current = true;
    }
  }, [analytics]);

  const value = useMemo(() => ({ analytics }), [analytics]);

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): ToolbarAnalytics {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context.analytics;
}
