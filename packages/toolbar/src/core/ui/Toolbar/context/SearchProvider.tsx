import React, { createContext, Dispatch, type SetStateAction, useContext, useEffect, useState } from 'react';

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  debouncedSearchTerm: string;
};

const SearchContext = createContext<SearchContextType>({
  searchTerm: '',
  setSearchTerm: () => {},
  debouncedSearchTerm: '',
});

const DEBOUNCE_DELAY = 300; // milliseconds

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, debouncedSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }

  return context;
}
