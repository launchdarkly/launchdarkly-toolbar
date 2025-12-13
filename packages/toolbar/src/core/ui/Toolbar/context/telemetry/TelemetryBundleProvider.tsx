import { ToolbarMode } from '../../types';
import { AnalyticsProvider } from './AnalyticsProvider';
import { InternalClientProvider } from './InternalClientProvider';

interface TelemetryBundleProviderProps {
  mode: ToolbarMode;
  baseUrl?: string;
  clientSideId?: string;
  streamUrl?: string;
  eventsUrl?: string;
  backendUrl?: string;
  children: React.ReactNode;
}

export function TelemetryBundleProvider(props: TelemetryBundleProviderProps) {
  const { mode, baseUrl, clientSideId, streamUrl, eventsUrl, backendUrl, children } = props;

  return (
    <InternalClientProvider
      clientSideId={clientSideId}
      baseUrl={baseUrl}
      streamUrl={streamUrl}
      eventsUrl={eventsUrl}
      backendUrl={backendUrl}
    >
      <AnalyticsProvider mode={mode}>{children}</AnalyticsProvider>
    </InternalClientProvider>
  );
}
