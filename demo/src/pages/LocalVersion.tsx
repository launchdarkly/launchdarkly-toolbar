// Import the toolbar directly from the source (local workspace)
import { LaunchDarklyToolbar } from '@toolbar-workspace/index';
import { AppWrapper } from '../components/AppWrapper';

export function LocalVersion() {
  return (
    <AppWrapper version="Local">
      {(config) => (
        <LaunchDarklyToolbar
          position={config.position}
          devServerUrl={config.devServerUrl}
          projectKey={config.projectKey}
        />
      )}
    </AppWrapper>
  );
}
