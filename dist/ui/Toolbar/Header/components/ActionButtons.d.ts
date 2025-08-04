import { Dispatch, SetStateAction } from 'react';
interface ActionButtonsProps {
    searchIsExpanded: boolean;
    setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
    onClose: () => void;
    onRefresh: () => void;
    showSearchButton: boolean;
}
export declare function ActionButtons(props: ActionButtonsProps): import("react/jsx-runtime").JSX.Element;
export {};
