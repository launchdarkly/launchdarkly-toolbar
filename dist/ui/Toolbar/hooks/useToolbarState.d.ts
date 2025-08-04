import { Dispatch, SetStateAction } from 'react';
import { ActiveTabId } from '../types';
export interface UseToolbarStateReturn {
    isExpanded: boolean;
    isHovered: boolean;
    activeTab: ActiveTabId;
    previousTab: ActiveTabId;
    isAnimating: boolean;
    searchIsExpanded: boolean;
    showFullToolbar: boolean;
    slideDirection: number;
    hasBeenExpanded: boolean;
    toolbarRef: React.RefObject<HTMLDivElement | null>;
    handleTabChange: (tabId: string) => void;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
    handleClose: () => void;
    handleSearch: (newSearchTerm: string) => void;
    setIsAnimating: Dispatch<SetStateAction<boolean>>;
    setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}
export declare function useToolbarState(): UseToolbarStateReturn;
