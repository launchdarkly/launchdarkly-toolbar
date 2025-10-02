import { useState, Suspense, useEffect } from 'react';
import { AppWrapper } from '../AppWrapper';
import { flagOverridePlugin, eventInterceptionPlugin } from '../plugins';
import type { LaunchDarklyToolbarProps, ToolbarPosition } from '@launchdarkly/toolbar';
import mountToolbar from '@launchdarkly/toolbar-iframe';

function toolbarIframe(options: LaunchDarklyToolbarProps) {
  
  return (
    mountToolbar(options)
  )
}

export function SDKMode() {
  const [position, setPosition] = useState<ToolbarPosition>('bottom-right');

  const options: LaunchDarklyToolbarProps = {
    baseUrl: import.meta.env.VITE_LD_BASE_URL,
    position: position,
    flagOverridePlugin: flagOverridePlugin,
    eventInterceptionPlugin: eventInterceptionPlugin
  };

  useEffect(() => {
    const iframe = mountToolbar(options);
    document.body.appendChild(iframe);
  }, [])

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

      <Suspense fallback={<div>Loading toolbar...</div>}>
      </Suspense>
    </AppWrapper> 
  );
}
