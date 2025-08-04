export interface DevServerProjectResponse {
    _lastSyncedFromSource: number;
    availableVariations: Record<string, Variation[]>;
    flagsState: Record<string, FlagState>;
    overrides: Record<string, Override>;
    sourceEnvironmentKey: string;
}
export interface Variation {
    _id: string;
    name: string;
    value: any;
}
export interface FlagState {
    value: any;
    version: number;
}
export interface Override {
    value: any;
    version: number;
}
export declare class DevServerClient {
    private baseUrl;
    private projectKey;
    constructor(baseUrl: string, projectKey?: string);
    setProjectKey(projectKey: string): void;
    getProjectKey(): string | null;
    getProjectData(): Promise<DevServerProjectResponse>;
    setOverride(flagKey: string, value: any): Promise<{
        override: boolean;
        value: any;
    }>;
    clearOverride(flagKey: string): Promise<void>;
    getAvailableProjects(): Promise<string[]>;
}
