export type TabId = 'flags' | 'settings';
export type ActiveTabId = TabId | undefined;
export declare const TAB_ORDER: readonly TabId[];
export interface FeatureFlag {
    id: string;
    name: string;
    enabled: boolean;
    custom: boolean;
    description?: string;
    lastModified?: Date;
    environment?: string;
}
