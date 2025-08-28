import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { AppWrapper } from '../components/AppWrapper';

export function CIVersion() {
  return (
    <AppWrapper version="CI">
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
