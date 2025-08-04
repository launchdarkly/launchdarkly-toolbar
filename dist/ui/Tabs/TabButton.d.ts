import React, { ElementType } from 'react';
export interface TabButtonProps {
    id: string;
    label: string;
    icon?: ElementType;
    disabled?: boolean;
}
export declare const TabButton: React.ForwardRefExoticComponent<TabButtonProps & React.RefAttributes<HTMLButtonElement>>;
