import React, { Dispatch, type SetStateAction } from 'react';
type SearchContextType = {
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
};
export declare function SearchProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useSearchContext(): SearchContextType;
export {};
