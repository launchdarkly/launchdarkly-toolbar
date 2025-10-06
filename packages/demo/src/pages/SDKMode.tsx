import {  useState} from 'react';
import { AppWrapper } from '../AppWrapper';
import { flagOverridePlugin, eventInterceptionPlugin } from '../plugins';
import type { ToolbarPosition } from '@launchdarkly/toolbar-types';
import { useLaunchDarklyToolbar } from '@launchdarkly/toolbar';

export function SDKMode() {
  const [position, setPosition] = useState<ToolbarPosition>('bottom-right');

  useLaunchDarklyToolbar({ cdn: 'http://localhost:8080/toolbar.min.js', enabled: true, initProps: {
    flagOverridePlugin,
    eventInterceptionPlugin,
    mountPoint: document.body,
    position: 'bottom-right'
  } });
  
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
    </AppWrapper>
  );
}
