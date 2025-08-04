import React from 'react';
import { LdToolbarConfig, ToolbarState } from '../../../types/devServer';
interface LaunchDarklyToolbarContextValue {
    state: ToolbarState & {
        availableProjects: string[];
        currentProjectKey: string | null;
    };
    setOverride: (flagKey: string, value: any) => Promise<void>;
    clearOverride: (flagKey: string) => Promise<void>;
    clearAllOverrides: () => Promise<void>;
    refresh: () => Promise<void>;
    switchProject: (projectKey: string) => Promise<void>;
}
export declare const useToolbarContext: () => LaunchDarklyToolbarContextValue;
export interface LaunchDarklyToolbarProviderProps {
    children: React.ReactNode;
    config: LdToolbarConfig;
}
export declare const LaunchDarklyToolbarProvider: React.FC<LaunchDarklyToolbarProviderProps>;
export {};
