import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../types/ldApi';
import { useProjectContext } from './ProjectProvider';
import { useAuthContext } from './AuthProvider';
import { useApi } from './ApiProvider';
import { useEnvironmentContext } from './EnvironmentProvider';

interface ContextsContextType {
  contexts: ApiContext[];
  loading: boolean;
  getContexts: () => Promise<ApiContext[]>;
}

const ContextsContext = createContext<ContextsContextType | undefined>(undefined);

export const ContextsProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectKey } = useProjectContext();
  const { environment } = useEnvironmentContext();
  const { authenticated } = useAuthContext();
  const { getContexts: getApiContexts, apiReady } = useApi();

  const [contexts, setContexts] = useState<ApiContext[]>([]);
  const [loading, setLoading] = useState(false);

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
          setContexts(contexts);
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [apiReady, authenticated, projectKey, environment, getContexts]);

  return <ContextsContext.Provider value={{ contexts, loading, getContexts }}>{children}</ContextsContext.Provider>;
};

export function useContextsContext(): ContextsContextType {
  const context = useContext(ContextsContext);
  if (!context) {
    throw new Error('useContextsContext must be used within a ContextsProvider');
  }
  return context;
}
