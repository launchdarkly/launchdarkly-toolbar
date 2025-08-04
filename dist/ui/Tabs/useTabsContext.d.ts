interface TabsContextType {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}
export declare const TabsContext: import("react").Context<TabsContextType | undefined>;
export declare const useTabsContext: () => TabsContextType;
export {};
