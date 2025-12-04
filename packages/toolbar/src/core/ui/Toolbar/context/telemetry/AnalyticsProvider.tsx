import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { ToolbarAnalytics } from '../../../../utils/analytics';
import { useInternalClient } from './InternalClientProvider';
import { ToolbarMode } from '../../types';

interface AnalyticsContextValue {
  analytics: ToolbarAnalytics;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  mode?: ToolbarMode;
}

export function AnalyticsProvider({ children, mode }: AnalyticsProviderProps) {
  const { client: internalClient, loading } = useInternalClient();
  const analytics = useMemo(() => new ToolbarAnalytics(internalClient, mode), [internalClient, mode]);
  const prevClientRef = useRef<typeof internalClient>(null);

  // Track initialization once when the client transitions from null to initialized
  useEffect(() => {
    const internalClientIsReady = !prevClientRef.current && internalClient && !loading;

    if (internalClientIsReady) {
      analytics.trackInitialization();
    }

    prevClientRef.current = internalClient;
  }, [analytics, loading, internalClient]);

  return <AnalyticsContext.Provider value={{ analytics }}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): ToolbarAnalytics {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context.analytics;
}
