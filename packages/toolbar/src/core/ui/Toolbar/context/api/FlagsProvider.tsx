import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiProvider';
import { useAuthContext } from './AuthProvider';
import { ApiFlag, FlagsResponse } from '../../types/ldApi';
import { useActiveTabContext } from '../state';
import { useProjectContext } from './ProjectProvider';

type FlagsContextType = {
  flags: ApiFlag[];
  loading: boolean;
  getProjectFlags: (projectKey: string) => Promise<FlagsResponse>;
  resetFlags: () => void;
};

const FlagsContext = createContext<FlagsContextType>({
  flags: [],
  loading: true,
  getProjectFlags: async () => ({ items: [], totalCount: 0 }),
  resetFlags: () => {},
});

export const FlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectKey } = useProjectContext();
  const { authenticated } = useAuthContext();
  const { getFlags, apiReady } = useApi();
  const [flags, setFlags] = useState<ApiFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadedProjectKey, setLoadedProjectKey] = useState<string | null>(null);
  const { activeTab } = useActiveTabContext();

  const resetFlags = useCallback(() => {
    setFlags([]);
    setLoadedProjectKey(null);
  }, []);

  const getProjectFlags = useCallback(
    async (projectKey: string) => {
      if (!apiReady) {
        return { items: [] };
      }

      return await getFlags(projectKey);
    },
    [apiReady, getFlags],
  );

  useEffect(() => {
    // Only fetch flags when a flag tab is active'
    let isMounted = true;

    // Support both legacy tab IDs and new design tab ID
    const isFlagTabActive = activeTab === 'flag-sdk' || activeTab === 'flag-dev-server' || activeTab === 'flags';

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

    // Only fetch if we haven't loaded data for this project yet
    if (loadedProjectKey === projectKey) {
      return;
    }

    setLoading(true);
    setFlags([]);
    getProjectFlags(projectKey).then((flags) => {
      if (isMounted) {
        setFlags(flags.items);
        setLoadedProjectKey(projectKey);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [projectKey, authenticated, apiReady, getProjectFlags, activeTab, loadedProjectKey]);

  return (
    <FlagsContext.Provider value={{ flags, loading, getProjectFlags, resetFlags }}>{children}</FlagsContext.Provider>
  );
};

export const useFlagsContext = () => {
  const context = useContext(FlagsContext);
  if (!context) {
    throw new Error('useFlagsContext must be used within a FlagsProvider');
  }
  return context;
};
