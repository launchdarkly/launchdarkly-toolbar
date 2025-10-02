'use client';

import { useState, lazy, Suspense } from 'react';
import { AppWrapper } from '../../components/AppWrapper';
import { useLaunchDarklyProvider } from '../../hooks/useLaunchDarklyProvider';
import { LoadingScreen } from '../../components/LoadingScreen';
import { MockModeIndicator } from '../../components/MockModeIndicator';
import { flagOverridePlugin } from '../../plugins';
import type { ToolbarPosition } from '@launchdarkly/toolbar';

const LaunchDarklyToolbar = lazy(() =>
  import('@launchdarkly/toolbar').then((module) => ({ default: module.LaunchDarklyToolbar })),
);

export default function SDKMode() {
  const [position, setPosition] = useState<ToolbarPosition>('bottom-right');

  const { LDProvider, isLoading, isUsingMocks } = useLaunchDarklyProvider();

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
          <p style={{ color: '#666', fontSize: '14px', fontStyle: 'italic' }}>
            Note: Event interception plugin is temporarily disabled for Next.js compatibility.
          </p>
          {process.env.NODE_ENV === 'production' && (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Toolbar is disabled in production mode.</p>
          )}
        </div>

        {LaunchDarklyToolbar && (
          <Suspense fallback={<div>Loading toolbar...</div>}>
            <LaunchDarklyToolbar
              baseUrl={process.env.NEXT_PUBLIC_LD_BASE_URL}
              position={position}
              flagOverridePlugin={flagOverridePlugin}
            />
          </Suspense>
        )}
      </AppWrapper>
    </LDProvider>
  );
}
