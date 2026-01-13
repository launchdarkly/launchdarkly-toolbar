import { LDPluginEnvironmentMetadata, LDPluginMetadata } from '@launchdarkly/js-client-sdk';
import { LDClient } from './LDClient';
import type { Hook } from './Hook';

/**
 * Interface for LaunchDarkly plugins that are compatible with both javascript client versions (<=3.x and >=4.x).
 */
export interface LDPlugin {
  /**
   * Returns the metadata for the plugin.
   */
  getMetadata(): LDPluginMetadata;

  /**
   * Registers the plugin with the LaunchDarkly client.
   * @param client - The LaunchDarkly client.
   * @param environmentMetadata - The environment metadata.
   */
  register(client: LDClient, environmentMetadata?: LDPluginEnvironmentMetadata): void;

  /**
   * Returns the hooks for the plugin.
   * @param metadata - The environment metadata.
   * @returns The hooks for the plugin.
   */
  getHooks?(metadata: LDPluginEnvironmentMetadata): Hook[];
}
