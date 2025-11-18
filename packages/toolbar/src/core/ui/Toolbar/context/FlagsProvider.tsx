import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useProjectContext } from './ProjectProvider';
import { useApi } from './ApiProvider';
import { useAuthContext } from './AuthProvider';
import { ApiFlag, FlagsResponse } from '../types/ldApi';
import { useActiveTabContext } from './ActiveTabProvider';

type FlagsContextType = {
  flags: ApiFlag[];
  loading: boolean;
  getProjectFlags: (projectKey: string) => Promise<ApiFlag[]>;
  resetFlags: () => void;
};

const FlagsContext = createContext<FlagsContextType | null>({
  flags: [],
  loading: true,
  getProjectFlags: async () => [],
  resetFlags: () => {},
});

export const FlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectKey } = useProjectContext();
  const { authenticated } = useAuthContext();
  const { getFlags, apiReady } = useApi();
  const [flags, setFlags] = useState<ApiFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const { activeTab } = useActiveTabContext();

  const resetFlags = useCallback(() => {
    setFlags([]);
  }, []);

  const getProjectFlags = useCallback(
    async (projectKey: string) => {
      if (!apiReady) {
        return [];
      }

      try {
        let allFlags: ApiFlag[] = [];

        const response: FlagsResponse | null = await getFlags(projectKey);

        setFlags(response?.items || []);
        setLoading(false);
        return allFlags;
      } catch (error) {
        console.error('Error loading flags:', error);
        setFlags([]);
        setLoading(false);
        return [];
      }
    },
    [apiReady, getFlags],
  );

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
