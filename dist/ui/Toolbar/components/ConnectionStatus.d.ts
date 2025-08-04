interface ConnectionStatusProps {
    status: 'connected' | 'disconnected' | 'error';
    lastSyncTime: number;
}
export declare function ConnectionStatus(props: ConnectionStatusProps): import("react/jsx-runtime").JSX.Element;
export {};
