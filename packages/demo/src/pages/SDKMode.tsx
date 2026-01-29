import { useState } from 'react';
import { AppWrapper } from '../AppWrapper';
import { flagOverridePlugin, eventInterceptionPlugin } from '../plugins';
import type { ToolbarPosition } from '@launchdarkly/toolbar/types';
import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar/react';
import { useLaunchDarklyProvider } from '../hooks/useLaunchDarklyProvider';
import { LoadingScreen } from '../components/LoadingScreen';
import { MockModeIndicator } from '../components/MockModeIndicator';

export function SDKMode() {
  const [position, setPosition] = useState<ToolbarPosition>('bottom-right');
  const { LDProvider, isLoading, isUsingMocks } = useLaunchDarklyProvider({
    clientSideID: import.meta.env.VITE_LD_CLIENT_SIDE_ID,
    baseUrl: import.meta.env.VITE_LD_BASE_URL,
    streamUrl: import.meta.env.VITE_LD_STREAM_URL,
    eventsUrl: import.meta.env.VITE_LD_EVENTS_URL,
    plugins: [flagOverridePlugin, eventInterceptionPlugin],
  });

  useLaunchDarklyToolbar({
    toolbarBundleUrl: import.meta.env.DEV ? 'http://localhost:5764/toolbar.min.js' : undefined,
    baseUrl: import.meta.env.VITE_LD_BASE_URL,
    authUrl: import.meta.env.VITE_LD_AUTH_URL,
    enabled: true,
    flagOverridePlugin,
    eventInterceptionPlugin,
    position: 'bottom-right',
    clientSideId: import.meta.env.VITE_LD_CLIENT_SIDE_ID,
  });

  if (!LDProvider) {
    return <LoadingScreen isLoading={isLoading} />;
  }

  return (
    <LDProvider>
      {isUsingMocks && <MockModeIndicator />}
      <AppWrapper mode="sdk" position={position} onPositionChange={setPosition}>
        <div className="config-group">
          <p>
            <strong>SDK Mode:</strong> The toolbar uses the LaunchDarkly React SDK directly with flag override
            capabilities. No dev server configuration needed.
          </p>
          {!import.meta.env.DEV && (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Toolbar is disabled in production mode.</p>
          )}
        </div>
      </AppWrapper>
    </LDProvider>
  );
}
