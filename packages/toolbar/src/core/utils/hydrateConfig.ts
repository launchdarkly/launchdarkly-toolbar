import { FlagOverridePlugin, InitializationConfig, TOOLBAR_POSITIONS } from '../../types';

export default function hydrateProps(config: InitializationConfig): InitializationConfig {
  return {
    ...config,
    baseUrl: config.baseUrl ?? 'https://app.launchdarkly.com',
    devServerUrl: config.devServerUrl ?? undefined,
    projectKey: config.projectKey ?? undefined,
    flagOverridePlugin: config.flagOverridePlugin ?? new FlagOverridePlugin(),
    eventInterceptionPlugin: config.eventInterceptionPlugin ?? undefined,
    pollIntervalInMs: config.pollIntervalInMs ?? undefined,
    position: config.position ?? TOOLBAR_POSITIONS[3],
  };
}
