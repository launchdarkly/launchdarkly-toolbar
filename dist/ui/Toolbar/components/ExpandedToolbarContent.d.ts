import { Dispatch, SetStateAction } from 'react';
import { ActiveTabId } from '../types';
interface ExpandedToolbarContentProps {
    isExpanded: boolean;
    activeTab: ActiveTabId;
    slideDirection: number;
    searchTerm: string;
    searchIsExpanded: boolean;
    onSearch: (searchTerm: string) => void;
    onClose: () => void;
    onTabChange: (tabId: string) => void;
    setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}
export declare function ExpandedToolbarContent(props: ExpandedToolbarContentProps): import("react/jsx-runtime").JSX.Element;
export {};
