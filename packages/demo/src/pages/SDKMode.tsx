import { useState, lazy, Suspense } from 'react';
import { AppWrapper } from '../AppWrapper';
import { flagOverridePlugin, eventInterceptionPlugin } from '../plugins';

const LaunchDarklyToolbar = lazy(() =>
  import('@launchdarkly/toolbar').then((module) => ({ default: module.LaunchDarklyToolbar })),
);

export function SDKMode() {
  const [position, setPosition] = useState<'left' | 'right'>('left');

  return (
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

      {LaunchDarklyToolbar && (
        <Suspense fallback={<div>Loading toolbar...</div>}>
          <LaunchDarklyToolbar
            baseLDUrl={import.meta.env.VITE_LD_BASE_URL || 'https://app.launchdarkly.com'}
            position={position}
            flagOverridePlugin={flagOverridePlugin}
            eventInterceptionPlugin={eventInterceptionPlugin}
          />
        </Suspense>
      )}
    </AppWrapper>
  );
}
