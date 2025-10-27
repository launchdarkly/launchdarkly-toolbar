import { useState } from 'react';
import { AppWrapper } from '../AppWrapper';
import type { ToolbarPosition } from '@launchdarkly/toolbar';
import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { eventInterceptionPlugin, flagOverridePlugin } from '../plugins';
import { useLaunchDarklyProvider } from '../hooks/useLaunchDarklyProvider';
import { LoadingScreen } from '../components/LoadingScreen';
import { MockModeIndicator } from '../components/MockModeIndicator';

export function DevServerMode() {
  const [position, setPosition] = useState<ToolbarPosition>('bottom-right');
  const [projectKey, setProjectKey] = useState('test-project');

  const { LDProvider, isLoading, isUsingMocks } = useLaunchDarklyProvider({
    clientSideID: import.meta.env.VITE_LD_DEV_SERVER_URL_PROJECT_KEY, // Use project key as client side ID for dev-server mode
    baseUrl: import.meta.env.VITE_LD_DEV_SERVER_URL,
    streamUrl: import.meta.env.VITE_LD_DEV_SERVER_URL,
    eventsUrl: import.meta.env.VITE_LD_DEV_SERVER_URL,
    plugins: [eventInterceptionPlugin],
  });

  useLaunchDarklyToolbar({
    toolbarBundleUrl: import.meta.env.DEV ? 'http://localhost:8080/toolbar.min.js' : undefined,
    enabled: true,
    devServerUrl: import.meta.env.VITE_LD_DEV_SERVER_URL,
    flagOverridePlugin,
    eventInterceptionPlugin,
    position: 'bottom-right',
  });

  if (!LDProvider) {
    return <LoadingScreen isLoading={isLoading} />;
  }

  return (
    <LDProvider>
      {isUsingMocks && <MockModeIndicator />}
      <AppWrapper mode="dev-server" position={position} onPositionChange={setPosition}>
        <div className="config-group">
          <label htmlFor="projectKey">Project Key (optional):</label>
          <input
            id="projectKey"
            type="text"
            value={projectKey}
            onChange={(e) => setProjectKey(e.target.value)}
            placeholder="Leave empty for auto-detection"
          />
        </div>

        {!import.meta.env.DEV && (
          <div className="config-group">
            <p style={{ color: '#666', fontStyle: 'italic' }}>Toolbar is disabled in production mode.</p>
          </div>
        )}
      </AppWrapper>
    </LDProvider>
  );
}
