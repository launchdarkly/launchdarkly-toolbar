import { useState } from 'react';
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { AppWrapper } from '../AppWrapper';
import { flagOverridePlugin } from '../plugins';

export function SDKMode() {
  const [position, setPosition] = useState<'left' | 'right'>('left');

  return (
    <AppWrapper mode="sdk" position={position} onPositionChange={setPosition}>
      <div className="config-group">
        <p>
          <strong>SDK Mode:</strong> The toolbar uses the LaunchDarkly React SDK directly with flag override
          capabilities. No dev server configuration needed.
        </p>
      </div>

      <LaunchDarklyToolbar position={position} flagOverridePlugin={flagOverridePlugin} />
    </AppWrapper>
  );
}
