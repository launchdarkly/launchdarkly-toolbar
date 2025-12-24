import { LDFlagSet, LDIdentifyResult } from "@launchdarkly/js-client-sdk";
import type { Hook } from "./Hook"

/**
 * Interface for the LaunchDarkly client that is compatible with both javascript client versions (<=3.x and >=4.x).
 */
export interface LDClient {
	track(key: string, data?: any, metricValue?: number): void
	identify(ctx: any): Promise<LDIdentifyResult> | Promise<LDFlagSet> | Promise<void>
	addHook(hook: Hook): void
  allFlags(): LDFlagSet;
  getContext(): any;
  on(key: string, callback: (...args: any[]) => void): void;
  off(key: string, callback: (...args: any[]) => void): void;
}
