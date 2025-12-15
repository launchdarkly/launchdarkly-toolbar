import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiProvider';
import { useAuthContext } from './AuthProvider';
import { ApiFlag, FlagsResponse } from '../../types/ldApi';
import { useProjectContext } from './ProjectProvider';

interface FlagsContextType {
  flags: ApiFlag[];
  loading: boolean;
  getProjectFlags: (projectKey: string) => Promise<FlagsResponse>;
  resetFlags: () => void;
  refreshFlags: () => Promise<void>;
}

const FlagsContext = createContext<FlagsContextType | undefined>(undefined);

export const FlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectKey } = useProjectContext();
  const { authenticated } = useAuthContext();
  const { getFlags, apiReady } = useApi();
  const [flags, setFlags] = useState<ApiFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedProjectKey, setLoadedProjectKey] = useState<string | null>(null);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const resetFlags = useCallback(() => {
    setFlags([]);
    setLoadedProjectKey(null);
    setHasInitialLoad(false);
  }, []);

  const getProjectFlags = useCallback(
    async (projectKey: string) => {
      if (!apiReady || !authenticated) {
        return { items: [] };
      }

      return await getFlags(projectKey);
    },
    [apiReady, getFlags, authenticated],
  );

  const refreshFlags = useCallback(async () => {
    if (!projectKey || !authenticated || !apiReady) {
      return;
    }

    setLoading(true);
    try {
      const flagsResponse = await getProjectFlags(projectKey);
      setFlags(flagsResponse.items);
      setLoadedProjectKey(projectKey);
    } catch (error) {
      console.error('Error refreshing flags:', error);
    } finally {
      setLoading(false);
    }
  }, [projectKey, authenticated, apiReady, getProjectFlags]);

  // Only load flags initially or when a project changes
  // But still load when project changes
  useEffect(() => {
    if (!authenticated || !apiReady) {
      return;
    }

    if (!projectKey) {
      return;
    }

    // If we've already loaded this project, don't reload (unless project changed)
    if (loadedProjectKey === projectKey) {
      // Mark as initial load complete if not already
      if (!hasInitialLoad) {
        setHasInitialLoad(true);
      }
      return;
    }

    // If we've done an initial load but project changed, allow reload
    // If we haven't done initial load yet, allow it
    let isMounted = true;
    setLoading(true);
    setFlags([]);
    getProjectFlags(projectKey).then((flags) => {
      if (isMounted) {
        setFlags(flags.items);
        setLoadedProjectKey(projectKey);
        setHasInitialLoad(true);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [projectKey, authenticated, apiReady, getProjectFlags, hasInitialLoad, loadedProjectKey]);

  return (
    <FlagsContext.Provider value={{ flags, loading, getProjectFlags, resetFlags, refreshFlags }}>
      {children}
    </FlagsContext.Provider>
  );
};

export function useFlagsContext(): FlagsContextType {
  const context = useContext(FlagsContext);
  if (!context) {
    throw new Error('useFlagsContext must be used within a FlagsProvider');
  }
  return context;
}
