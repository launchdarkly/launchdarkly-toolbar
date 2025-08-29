// Import the toolbar from the built package
// In local dev, this represents the "local development environment"
// vs CI which represents "production-like environment"
import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
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
