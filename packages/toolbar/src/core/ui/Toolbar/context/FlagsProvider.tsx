import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useProjectContext } from './ProjectProvider';
import { useApi } from './ApiProvider';
import { useAuthContext } from './AuthProvider';
import { ApiFlag } from '../types/ldApi';

type FlagsContextType = {
  flags: ApiFlag[];
  loading: boolean;
  getProjectFlags: (projectKey: string) => Promise<ApiFlag[]>;
};

const FlagsContext = createContext<FlagsContextType | null>({
  flags: [],
  loading: true,
  getProjectFlags: async () => [],
});

export const FlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectKey } = useProjectContext();
  const { authenticated } = useAuthContext();
  const { getFlags, apiReady } = useApi();
  const [flags, setFlags] = useState<ApiFlag[]>([]);
  const [loading, setLoading] = useState(false);

  const getProjectFlags = useCallback(
    async (projectKey: string) => {
      if (!authenticated) {
        return [];
      }

      return await getFlags(projectKey);
    },
    [authenticated, getFlags],
  );

  useEffect(() => {
    if (!authenticated || !apiReady) {
      return;
    }

    if (!projectKey) {
      setLoading(true);
      return;
    }

    setLoading(true);
    getProjectFlags(projectKey).then((flags) => {
      setFlags(flags);
      setLoading(false);
    });
  }, [projectKey, getProjectFlags, authenticated, apiReady]);

  return <FlagsContext.Provider value={{ flags, loading, getProjectFlags }}>{children}</FlagsContext.Provider>;
};

export const useFlagsContext = () => {
  const context = useContext(FlagsContext);
  if (!context) {
    throw new Error('useFlagsContext must be used within a FlagsProvider');
  }
  return context;
};
