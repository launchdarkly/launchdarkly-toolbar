import { Hook } from 'launchdarkly-js-client-sdk';
import { LDClient } from 'launchdarkly-js-client-sdk';
import { LDDebugOverride } from 'launchdarkly-js-client-sdk';
import { LDFlagSet } from 'launchdarkly-js-client-sdk';
import { LDFlagValue } from 'launchdarkly-js-client-sdk';
import { LDPlugin } from 'launchdarkly-js-client-sdk';
import { LDPluginEnvironmentMetadata } from 'launchdarkly-js-client-sdk';
import { LDPluginMetadata } from 'launchdarkly-js-client-sdk';

export declare const ANALYTICS_EVENT_PREFIX = "ld.toolbar";

export declare type Cleanup = () => void;

/**
 * Event categories for UI organization
 */
export declare type EventCategory = (typeof VALID_EVENT_CATEGORIES)[number];

/**
 * Event filter configuration
 */
export declare interface EventFilter {
    readonly kinds?: ReadonlyArray<EventKind>;
    readonly categories?: ReadonlyArray<EventCategory>;
    readonly flagKeys?: ReadonlyArray<string>;
    readonly timeRange?: {
        readonly start: number;
        readonly end: number;
    };
}

/**
 * Plugin dedicated to intercepting and processing LaunchDarkly events
 */
export declare class EventInterceptionPlugin implements IEventInterceptionPlugin {
    private afterTrackHook;
    private afterIdentifyHook;
    private afterEvaluationHook;
    private eventStore;
    private config;
    private ldClient;
    constructor(config?: EventInterceptionPluginConfig);
    isToolbarEvent(event: ProcessedEvent): boolean;
    getMetadata(): LDPluginMetadata;
    getHooks(_metadata: LDPluginEnvironmentMetadata): Hook[];
    register(ldClient: LDClient): void;
    getClient(): LDClient | null;
    getEvents(): ProcessedEvent[];
    subscribe(listener: () => void): () => void;
    clearEvents(): void;
    destroy(): void;
}

/**
 * Configuration options for the EventInterceptionPlugin
 */
export declare interface EventInterceptionPluginConfig {
    /** Configuration for event filtering */
    filter?: EventFilter;
    /** Enable console logging for debugging */
    enableLogging?: boolean;
    /** Maximum number of events to store. The default value is 100. */
    eventCapacity?: number;
}

/**
 * Strict typing for event kinds based on LaunchDarkly's event system
 */
export declare type EventKind = (typeof VALID_EVENT_KINDS)[number];

export declare class FlagOverridePlugin implements IFlagOverridePlugin {
    private debugOverride?;
    private config;
    private ldClient;
    constructor(config?: FlagOverridePluginConfig);
    /**
     * Returns plugin metadata
     */
    getMetadata(): LDPluginMetadata;
    /**
     * Returns the hooks for the plugin
     */
    getHooks(_metadata: LDPluginEnvironmentMetadata): Hook[];
    /**
     * Called when the plugin is registered with the LaunchDarkly client
     */
    register(ldClient: LDClient): void;
    /**
     * Called when the debug interface is available
     * Loads any existing overrides from localStorage
     */
    registerDebug(debugOverride: LDDebugOverride): void;
    private loadExistingOverrides;
    /**
     * Sets an override value for a feature flag and persists it to localStorage
     * @param flagKey - The key of the flag to override
     * @param value - The value to set for the flag
     */
    setOverride(flagKey: string, value: unknown): void;
    /**
     * Removes an override for a specific feature flag
     * @param flagKey - The key of the flag to remove the override for
     */
    removeOverride(flagKey: string): void;
    /**
     * Clears all feature flag overrides from both memory and localStorage
     */
    clearAllOverrides(): void;
    /**
     * Returns all currently active feature flag overrides
     * @returns Record of flag keys to their override values
     */
    getAllOverrides(): LDFlagSet;
    /**
     * Returns the LaunchDarkly client instance
     * @returns The LaunchDarkly client
     */
    getClient(): LDClient | null;
    private getStorage;
    private persistOverride;
    private removePersistedOverride;
    private clearPersistedOverrides;
}

/**
 * Configuration options for the FlagOverridePlugin
 */
export declare type FlagOverridePluginConfig = {
    /** Namespace for localStorage keys. Defaults to 'ld-flag-override' */
    storageNamespace?: string;
};

/**
 * Interface for event interception plugins that can be used with the LaunchDarkly Toolbar
 */
export declare interface IEventInterceptionPlugin extends LDPlugin {
    /**
     * Gets all intercepted events from the event store
     * @returns Array of processed events
     */
    getEvents(): ProcessedEvent[];
    /**
     * Subscribes to event store changes
     * @param listener - Callback function to be called when events change
     * @returns Unsubscribe function
     */
    subscribe(listener: () => void): () => void;
    /**
     * Clears all events from the event store
     */
    clearEvents(): void;
    /**
     * Returns the LaunchDarkly client instance
     * @returns The LaunchDarkly client with allFlags method
     */
    getClient(): LDClient | null;
}

export declare interface IFlagOverridePlugin extends LDPlugin, LDDebugOverride {
    /**
     * Sets an override value for a feature flag
     * @param flagKey - The key of the flag to override
     * @param value - The value to set for the flag
     */
    setOverride(flagKey: string, value: LDFlagValue): void;
    /**
     * Removes an override for a specific feature flag
     * @param flagKey - The key of the flag to remove the override for
     */
    removeOverride(flagKey: string): void;
    /**
     * Clears all feature flag overrides
     */
    clearAllOverrides(): void;
    /**
     * Returns all currently active feature flag overrides
     * @returns Record of flag keys to their override values
     */
    getAllOverrides(): LDFlagSet;
    /**
     * Returns the LaunchDarkly client instance
     * @returns The LaunchDarkly client with allFlags method
     */
    getClient(): LDClient | null;
}

declare type InitFn = (initProps: InitializationConfig) => Cleanup;

export declare interface InitializationConfig extends ToolbarConfig {
}

export declare function isValidEventCategory(category: string): category is EventCategory;

/**
 * Type guards for event validation
 */
export declare function isValidEventKind(kind: string): kind is EventKind;

export declare interface LaunchDarklyToolbar {
    init: InitFn;
}

export declare interface LDEvaluationReason {
    readonly kind?: string;
    readonly errorKind?: string;
}

/**
 * Enhanced processed event
 */
export declare interface ProcessedEvent {
    readonly id: string;
    readonly kind: EventKind;
    readonly key?: string;
    readonly timestamp: number;
    readonly context: SyntheticEventContext;
    readonly displayName: string;
    readonly category: EventCategory;
    readonly metadata?: Readonly<Record<string, unknown>>;
}

export declare interface SyntheticEventContext {
    readonly kind: EventKind;
    readonly key?: string;
    readonly context?: object;
    readonly creationDate: number;
    readonly data?: unknown;
    readonly metricValue?: number;
    readonly url?: string;
    readonly value?: any;
    readonly variation?: number | null;
    readonly default?: any;
    readonly reason?: LDEvaluationReason;
    readonly version?: number;
    readonly trackEvents?: boolean;
    readonly debugEventsUntilDate?: number;
    readonly contextKind?: string;
}

export declare const TOOLBAR_POSITIONS: readonly ["top-left", "top-right", "bottom-left", "bottom-right"];

export declare interface ToolbarConfig {
    /**
     * The base LaunchDarkly URL the toolbar should use when creating deep links.
     *
     * Default `https://app.launchdarkly.com`
     */
    baseUrl?: string;
    /**
     * The Dev Server URL (if you have a local instance of LaunchDarkly running). If
     * provided, will set the toolbar to run in Dev Server mode.
     *
     * Default `undefined`
     */
    devServerUrl?: string;
    /**
     * Dev Server Mode: The project key that the toolbar should use. If left blank, will
     * auto-detect the first available project.
     *
     * Default `undefined`
     */
    projectKey?: string;
    /**
     * Implementation of the {@link IFlagOverridePlugin} interface. Allows the toolbar + local app to override flag
     * values without changing the flag value/targeting in LaunchDarkly. If not provided, will default to our base
     * default implementation/configuration.
     *
     * Default `undefined`
     */
    flagOverridePlugin?: IFlagOverridePlugin;
    /**
     * Implementation of the {@link IEventInterceptionPlugin} interface. Allows the toolbar to track events. Useful
     * for being able to see when flags are evaluated, what they evaluate to, detect missing feature flags, and
     * seeing any custom events your app is tracking.
     *
     * Default `undefined`
     */
    eventInterceptionPlugin?: IEventInterceptionPlugin;
    /**
     * Dev Server Mode: the interval (in milliseconds) determining how frequently the toolbar should poll the Dev Server.
     *
     * Default `undefined`
     */
    pollIntervalInMs?: number;
    /**
     * Toolbar position on screen.
     *
     * Default `'bottom-right'`
     */
    position?: ToolbarPosition;
}

export declare type ToolbarPosition = (typeof TOOLBAR_POSITIONS)[number];

export declare function useLaunchDarklyToolbar(args: UseLaunchDarklyToolbarConfig): void;

declare interface UseLaunchDarklyToolbarConfig extends InitializationConfig {
    /**
     * URL to load the toolbar bundle from.
     * Use this when developing the toolbar itself locally.
     *
     * Example: `'http://localhost:8080/toolbar.min.js'`
     *
     * Default: CDN URL based on package version
     */
    toolbarBundleUrl?: string;
    /**
     * Whether the toolbar should be loaded and displayed.
     *
     * Default: `true`
     */
    enabled?: boolean;
}

/**
 * Valid event categories used for organizing events
 */
declare const VALID_EVENT_CATEGORIES: readonly ["flag", "custom", "identify", "debug"];

/**
 * Valid event kinds that can be emitted by the LaunchDarkly SDK
 */
declare const VALID_EVENT_KINDS: readonly ["identify", "feature", "custom", "debug", "summary", "diagnostic"];

export { }
