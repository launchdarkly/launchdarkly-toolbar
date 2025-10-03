import { useState } from 'react';
import { AppWrapper } from '../AppWrapper';
import type { ToolbarPosition } from '@launchdarkly/toolbar-types';
import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar';

export function DevServerMode() {
  const [position, setPosition] = useState<ToolbarPosition>('bottom-right');
  const [devServerUrl, setDevServerUrl] = useState('http://localhost:8765');
  const [projectKey, setProjectKey] = useState('test-project');

  useLaunchDarklyToolbar({ cdn: 'http://localhost:808/toolbar.min.js', enabled: true, initProps: {
  } });

  return (
    <AppWrapper mode="dev-server" position={position} onPositionChange={setPosition}>
      <div className="config-group">
        <label htmlFor="devServerUrl">Dev Server URL:</label>
        <input
          id="devServerUrl"
          type="text"
          value={devServerUrl}
          onChange={(e) => setDevServerUrl(e.target.value)}
          placeholder="http://localhost:8765"
        />
      </div>

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
  );
}
