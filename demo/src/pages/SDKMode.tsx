import { useState } from 'react';
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { AppWrapper } from '../AppWrapper';
import { flagOverridePlugin } from '../plugins';

interface SDKModeProps {
  version: 'CI' | 'Local';
}

export function SDKMode({ version }: SDKModeProps) {
  const [position, setPosition] = useState<'left' | 'right'>('left');

  return (
    <AppWrapper version={version} mode="sdk" position={position} onPositionChange={setPosition}>
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
