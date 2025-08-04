import React from 'react';
interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    size?: 'small' | 'medium' | 'large';
}
export declare function IconButton(props: IconButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
