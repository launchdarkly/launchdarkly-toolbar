import { useState } from 'react';
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { AppWrapper } from '../AppWrapper';

interface DevServerModeProps {
  version: 'CI' | 'Local';
}

export function DevServerMode({ version }: DevServerModeProps) {
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [devServerUrl, setDevServerUrl] = useState('http://localhost:8765');
  const [projectKey, setProjectKey] = useState('test-project');

  return (
    <AppWrapper version={version} mode="dev-server" position={position} onPositionChange={setPosition}>
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

      <LaunchDarklyToolbar position={position} devServerUrl={devServerUrl} projectKey={projectKey || undefined} />
    </AppWrapper>
  );
}
