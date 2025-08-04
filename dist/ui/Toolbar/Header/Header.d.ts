import { Dispatch, SetStateAction } from 'react';
export interface HeaderProps {
    searchTerm: string;
    onSearch: (searchTerm: string) => void;
    onClose: () => void;
    searchIsExpanded: boolean;
    setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
    label: string;
}
export declare function Header(props: HeaderProps): import("react/jsx-runtime").JSX.Element;
