import { Dispatch, SetStateAction } from 'react';
interface SearchSectionProps {
    searchTerm: string;
    onSearch: (searchTerm: string) => void;
    setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}
export declare function SearchSection(props: SearchSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
