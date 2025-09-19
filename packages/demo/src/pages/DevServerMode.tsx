import { useState, lazy, Suspense } from 'react';
import { AppWrapper } from '../AppWrapper';

const LaunchDarklyToolbar = lazy(() =>
  import('@launchdarkly/toolbar').then((module) => ({ default: module.LaunchDarklyToolbar })),
);

export function DevServerMode() {
  const [position, setPosition] = useState<'left' | 'right'>('left');
  const [devServerUrl, setDevServerUrl] = useState('http://localhost:8765');
  const [projectKey, setProjectKey] = useState('test-project');

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

      {LaunchDarklyToolbar && (
        <Suspense fallback={<div>Loading toolbar...</div>}>
          <LaunchDarklyToolbar
            baseLDUrl={devServerUrl}
            position={position}
            devServerUrl={devServerUrl}
            projectKey={projectKey || undefined}
          />
        </Suspense>
      )}
    </AppWrapper>
  );
}
