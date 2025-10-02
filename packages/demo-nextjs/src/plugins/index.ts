import { EventInterceptionPlugin, FlagOverridePlugin } from '@launchdarkly/toolbar/plugins';

export const flagOverridePlugin = new FlagOverridePlugin();

// Note: EventInterceptionPlugin may have compatibility issues with Next.js
// For now, we'll create a placeholder that can be replaced when the issue is resolved
export const eventInterceptionPlugin = new EventInterceptionPlugin();
