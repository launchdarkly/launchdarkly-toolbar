export interface LdToolbarProps {
    position?: 'left' | 'right';
}
export declare function LdToolbar(props: LdToolbarProps): import("react/jsx-runtime").JSX.Element;
export interface LaunchDarklyToolbarProps extends LdToolbarProps {
    devServerUrl?: string;
    projectKey?: string;
}
export declare function LaunchDarklyToolbar(props: LaunchDarklyToolbarProps): import("react/jsx-runtime").JSX.Element;
