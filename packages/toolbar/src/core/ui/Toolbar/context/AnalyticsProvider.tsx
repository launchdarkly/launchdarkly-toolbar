import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { ToolbarAnalytics } from '../../../utils/analytics';
import { useInternalClientInstance } from './InternalClientProvider';

interface AnalyticsContextValue {
  analytics: ToolbarAnalytics;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const internalClient = useInternalClientInstance();
  const analytics = useMemo(() => new ToolbarAnalytics(internalClient), [internalClient]);
  const hasInitialized = useRef(false);

  // Track initialization once (prevent duplicates during development)
  useEffect(() => {
    if (!hasInitialized.current) {
      analytics.trackInitialization();
      hasInitialized.current = true;
    }
  }, [analytics]);

  return <AnalyticsContext.Provider value={{ analytics }}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): ToolbarAnalytics {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context.analytics;
}
