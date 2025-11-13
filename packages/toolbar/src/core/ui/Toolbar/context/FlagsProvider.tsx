import { createContext, useContext, useEffect, useState } from 'react';
import { useProjectContext } from './ProjectProvider';
import { useApi } from './ApiProvider';
import { useAuthContext } from './AuthProvider';

type FlagsContextType = {
  flags: Record<string, any>[];
  loading: boolean;
};

const FlagsContext = createContext<FlagsContextType | null>({
  flags: [],
  loading: true,
});

export const FlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const { projectKey } = useProjectContext();
  const { authenticated } = useAuthContext();
  const { getFlags } = useApi();
  const [flags, setFlags] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      return;
    }

    if (!projectKey) {
      setLoading(true);
      return;
    }

    setLoading(true);
    getFlags(projectKey).then((flags) => {
      setFlags(flags);
      setLoading(false);
    });
  }, [projectKey, getFlags, authenticated]);

  return <FlagsContext.Provider value={{ flags, loading }}>{children}</FlagsContext.Provider>;
};

export const useFlagsContext = () => {
  const context = useContext(FlagsContext);
  if (!context) {
    throw new Error('useFlagsContext must be used within a FlagsProvider');
  }
  return context;
};
