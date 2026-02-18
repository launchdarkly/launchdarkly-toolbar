import { LDFlagSet, LDPluginEnvironmentMetadata } from 'launchdarkly-js-client-sdk';
import { LDIdentifyResult, Hook } from '@launchdarkly/js-client-sdk';

/**
 * LDClient based on the LDClient type in the SDK package with
 * a narrower structure to ensure that they can be used by
 * our plugins.
 */
export interface LDClient {
  track(key: string, data?: any, metricValue?: number): void;
  identify(ctx: any): Promise<LDIdentifyResult> | Promise<LDFlagSet> | Promise<void>;
  addHook(hook: Hook): void;
  getHooks?(metadata: LDPluginEnvironmentMetadata): Hook[];
  allFlags(): LDFlagSet;
  getContext(): any;
  on(key: string, callback: (...args: any[]) => void): void;
  off(key: string, callback: (...args: any[]) => void): void;
  flush(): void;
}
