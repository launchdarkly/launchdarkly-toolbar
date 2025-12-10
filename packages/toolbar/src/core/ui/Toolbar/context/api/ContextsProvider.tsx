import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ApiContext } from '../../types/ldApi';
import { useProjectContext } from './ProjectProvider';
import { useAuthContext } from './AuthProvider';
import { useApi } from './ApiProvider';
import { useEnvironmentContext } from './EnvironmentProvider';
import { useCurrentSdkContext, CurrentContextInfo, isCurrentContext } from '../state/useCurrentSdkContext';

const DEFAULT_PAGE_SIZE = 20;

interface ContextsContextType {
  contexts: ApiContext[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  totalCount: number | undefined;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  currentSdkContext: CurrentContextInfo | null;
  isActiveContext: (contextKind: string, contextKey: string) => boolean;
}

const ContextsContext = createContext<ContextsContextType | undefined>(undefined);

export const ContextsProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectKey } = useProjectContext();
  const { environment } = useEnvironmentContext();
  const { authenticated } = useAuthContext();
  const { getContexts: getApiContexts, apiReady } = useApi();
  const currentSdkContext = useCurrentSdkContext();

  const [apiContexts, setApiContexts] = useState<ApiContext[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [continuationToken, setContinuationToken] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);

  // Track the current project/environment to reset on change
  const currentKeyRef = useRef<string>('');

  // Helper function to check if a context is the active SDK context
  const isActiveContext = useCallback(
    (contextKind: string, contextKey: string) => {
      return isCurrentContext(currentSdkContext, contextKind, contextKey);
    },
    [currentSdkContext],
  );

  // Fetch initial page of contexts
  const fetchContexts = useCallback(
    async (reset: boolean = false) => {
      if (!apiReady || !authenticated) {
        return;
      }

      if (!projectKey || !environment) {
        console.warn('No project key or environment found. Cannot fetch contexts.');
        return;
      }

      const key = `${projectKey}-${environment}`;

      // Reset state if project/environment changed
      if (reset || key !== currentKeyRef.current) {
        currentKeyRef.current = key;
        setApiContexts([]);
        setContinuationToken(undefined);
        setHasMore(false);
        setTotalCount(undefined);
      }

      setLoading(true);

      try {
        const response = await getApiContexts(projectKey, environment, {
          limit: DEFAULT_PAGE_SIZE,
          sort: '-ts', // Sort by most recent first
        });

        if (!response || !response.items) {
          console.warn('No contexts found.');
          setApiContexts([]);
          setHasMore(false);
          setLoading(false);
          return;
        }

        const contexts = response.items.map((item) => item.context as ApiContext);
        setApiContexts(contexts);
        setContinuationToken(response.continuationToken);
        setTotalCount(response.totalCount);

        // Has more if there's a continuation token
        setHasMore(!!response.continuationToken);
      } catch (error) {
        console.error('Error fetching contexts:', error);
      } finally {
        setLoading(false);
      }
    },
    [apiReady, authenticated, getApiContexts, projectKey, environment],
  );

  // Load more contexts (pagination)
  const loadMore = useCallback(async () => {
    if (!apiReady || !authenticated || !hasMore || loadingMore || loading || !continuationToken) {
      return;
    }

    if (!projectKey || !environment) {
      return;
    }

    setLoadingMore(true);

    try {
      const response = await getApiContexts(projectKey, environment, {
        limit: DEFAULT_PAGE_SIZE,
        continuationToken,
        sort: '-ts',
      });

      if (!response || !response.items) {
        setHasMore(false);
        setContinuationToken(undefined);
        setLoadingMore(false);
        return;
      }

      const newContexts = response.items.map((item) => item.context as ApiContext);

      // Deduplicate contexts (in case of race conditions)
      setApiContexts((prev) => {
        const existingKeys = new Set(prev.map((c) => `${c.kind}:${c.key}`));
        const uniqueNew = newContexts.filter((c) => !existingKeys.has(`${c.kind}:${c.key}`));
        return [...prev, ...uniqueNew];
      });

      // Update continuation token and hasMore
      setContinuationToken(response.continuationToken);
      setHasMore(!!response.continuationToken);
    } catch (error) {
      console.error('Error loading more contexts:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [
    apiReady,
    authenticated,
    getApiContexts,
    projectKey,
    environment,
    continuationToken,
    hasMore,
    loadingMore,
    loading,
  ]);

  // Refresh contexts (reset and fetch first page)
  const refresh = useCallback(async () => {
    await fetchContexts(true);
  }, [fetchContexts]);

  // Initial fetch when dependencies change
  useEffect(() => {
    if (apiReady && authenticated && projectKey && environment) {
      fetchContexts(true);
    }
  }, [apiReady, authenticated, projectKey, environment, fetchContexts]);

  // Merge current SDK context into the contexts list if it doesn't exist
  // This ensures the current context, if anonymous, is available (since this won't get fetched from the API)
  const contexts = useMemo(() => {
    if (!currentSdkContext) {
      return apiContexts;
    }

    // Check if the current SDK context already exists in the API contexts
    const existsInApi = apiContexts.some(
      (ctx) => ctx.kind === currentSdkContext.kind && ctx.key === currentSdkContext.key,
    );

    if (existsInApi) {
      return apiContexts;
    }

    // Add the current SDK context to the beginning of the list
    const sdkContextAsApiContext: ApiContext = {
      kind: currentSdkContext.kind,
      key: currentSdkContext.key,
      name: currentSdkContext.name,
      anonymous: currentSdkContext.anonymous,
    };

    return [sdkContextAsApiContext, ...apiContexts];
  }, [apiContexts, currentSdkContext]);

  return (
    <ContextsContext.Provider
      value={{
        contexts,
        loading,
        loadingMore,
        hasMore,
        totalCount,
        loadMore,
        refresh,
        currentSdkContext,
        isActiveContext,
      }}
    >
      {children}
    </ContextsContext.Provider>
  );
};

export function useContextsContext(): ContextsContextType {
  const context = useContext(ContextsContext);
  if (!context) {
    throw new Error('useContextsContext must be used within a ContextsProvider');
  }
  return context;
}
