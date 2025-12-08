import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ApiContext } from '../../types/ldApi';
import { useProjectContext } from './ProjectProvider';
import { useAuthContext } from './AuthProvider';
import { useApi } from './ApiProvider';
import { useEnvironmentContext } from './EnvironmentProvider';
import { useCurrentSdkContext, CurrentContextInfo, isCurrentContext } from '../state/useCurrentSdkContext';

interface ContextsContextType {
  contexts: ApiContext[];
  loading: boolean;
  getContexts: () => Promise<ApiContext[]>;
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

  // Helper function to check if a context is the active SDK context
  const isActiveContext = useCallback(
    (contextKind: string, contextKey: string) => {
      return isCurrentContext(currentSdkContext, contextKind, contextKey);
    },
    [currentSdkContext],
  );

  const getContexts = useCallback(async () => {
    if (!apiReady || !authenticated) {
      return [];
    }

    if (!projectKey || !environment) {
      console.warn('No project key or environment found. Cannot fetch contexts.');
      return [];
    }

    const contextsResponse = await getApiContexts(projectKey, environment);
    if (!contextsResponse || !contextsResponse.items) {
      console.warn('No contexts found. Cannot fetch contexts.');
      return [];
    }

    const contexts = contextsResponse.items.map((item) => item.context as ApiContext);

    return contexts;
  }, [apiReady, authenticated, getApiContexts, projectKey, environment]);

  useEffect(() => {
    let isMounted = true;

    if (apiReady && authenticated && projectKey && environment) {
      setLoading(true);
      getContexts().then((contexts) => {
        if (isMounted) {
          setApiContexts(contexts);
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [apiReady, authenticated, projectKey, environment, getContexts]);

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
    <ContextsContext.Provider value={{ contexts, loading, getContexts, currentSdkContext, isActiveContext }}>
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
