import { FlagOverridePlugin } from "../plugins";
import InitConfig from "../types/initConfig";
import { LaunchDarklyToolbarProps } from "../ui/Toolbar/LaunchDarklyToolbar";

export default function hydrateConfig({mountPoint, ...initConfig}: InitConfig): LaunchDarklyToolbarProps {
  return {
    ...initConfig,
    baseUrl: initConfig.baseUrl ?? 'https://app.launchdarkly/com',
    devServerUrl: initConfig.devServerUrl ?? undefined,
    projectKey: initConfig.projectKey ?? undefined,
    flagOverridePlugin: initConfig.flagOverridePlugin ?? new FlagOverridePlugin(),
    eventInterceptionPlugin: initConfig.eventInterceptionPlugin ?? undefined,
    pollIntervalInMs: initConfig.pollIntervalInMs ?? 5000,
    position: initConfig.position ?? undefined
  }
}