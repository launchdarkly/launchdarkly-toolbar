import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useProjectContext } from './ProjectProvider';
import { useApi } from './ApiProvider';
import { useAuthContext } from './AuthProvider';
import { ApiFlag, PaginatedFlagsResponse } from '../types/ldApi';
import { useSearchContext } from './SearchProvider';
import { useActiveTabContext } from './ActiveTabProvider';

const PAGE_SIZE = 20;

type FlagsContextType = {
  flags: ApiFlag[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  totalCount: number;
  getProjectFlags: (projectKey: string) => Promise<ApiFlag[]>;
  loadMoreFlags: () => Promise<void>;
  resetFlags: () => void;
};

const FlagsContext = createContext<FlagsContextType | null>({
  flags: [],
  loading: true,
  loadingMore: false,
  hasMore: false,
  totalCount: 0,
  getProjectFlags: async () => [],
  loadMoreFlags: async () => {},
  resetFlags: () => {},
});

export const FlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectKey } = useProjectContext();
  const { authenticated } = useAuthContext();
  const { getFlags, apiReady } = useApi();
  const [flags, setFlags] = useState<ApiFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { debouncedSearchTerm } = useSearchContext();
  const { activeTab } = useActiveTabContext();

  const resetFlags = useCallback(() => {
    setFlags([]);
    setOffset(0);
    setHasMore(true);
    setTotalCount(0);
  }, []);

  const getProjectFlags = useCallback(
    async (projectKey: string) => {
      if (!apiReady) {
        return [];
      }

      try {
        const response: PaginatedFlagsResponse | null = await getFlags(projectKey, {
          limit: PAGE_SIZE,
          offset: 0,
          query: debouncedSearchTerm,
        });
        if (!response) {
          setFlags([]);
          setLoading(false);
          return [];
        }

        setFlags(response.items);
        setOffset(response.items.length);
        setHasMore(!!response._links?.next);
        setTotalCount(response.totalCount || response.items.length);
        setLoading(false);
        return response.items;
      } catch (error) {
        console.error('Error loading flags:', error);
        setLoading(false);
        return [];
      }
    },
    [apiReady, getFlags, debouncedSearchTerm],
  );

  const loadMoreFlags = useCallback(async () => {
    if (!projectKey || !apiReady || loadingMore || !hasMore) {
      return;
    }

    try {
      setLoadingMore(true);
      const response: PaginatedFlagsResponse | null = await getFlags(projectKey, {
        limit: PAGE_SIZE,
        offset,
        query: debouncedSearchTerm,
      });

      if (!response) {
        setLoadingMore(false);
        return;
      }

      setFlags((prev) => [...prev, ...response.items]);
      setOffset((prev) => prev + response.items.length);
      setHasMore(!!response._links?.next);
      setTotalCount(response.totalCount || offset + response.items.length);
      setLoadingMore(false);
    } catch (error) {
      console.error('Error loading more flags:', error);
      setLoadingMore(false);
    }
  }, [projectKey, apiReady, getFlags, loadingMore, hasMore, offset, debouncedSearchTerm]);

  useEffect(() => {
    // Only fetch flags when a flag tab is active
    const isFlagTabActive = activeTab === 'flag-sdk' || activeTab === 'flag-dev-server';

    if (!isFlagTabActive) {
      return;
    }

    if (!authenticated || !apiReady) {
      return;
    }

    if (!projectKey) {
      setLoading(true);
      return;
    }

    setLoading(true);
    resetFlags();
    getProjectFlags(projectKey);
  }, [projectKey, authenticated, apiReady, getProjectFlags, resetFlags, activeTab]);

  return (
    <FlagsContext.Provider
      value={{ flags, loading, loadingMore, hasMore, totalCount, getProjectFlags, loadMoreFlags, resetFlags }}
    >
      {children}
    </FlagsContext.Provider>
  );
};

export const useFlagsContext = () => {
  const context = useContext(FlagsContext);
  if (!context) {
    throw new Error('useFlagsContext must be used within a FlagsProvider');
  }
  return context;
};
