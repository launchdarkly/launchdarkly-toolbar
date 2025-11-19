import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useProjectContext } from './ProjectProvider';

type EnvironmentContextType = {
  environment: string;
  setEnvironment: (environment: string) => void;
};

const EnvironmentContext = createContext<EnvironmentContextType>({
  environment: '',
  setEnvironment: () => {},
});

interface EnvironmentProviderProps {
  children: React.ReactNode;
  clientSideId?: string;
}

export const EnvironmentProvider: FC<EnvironmentProviderProps> = ({ children, clientSideId }) => {
  const [environment, setEnvironment] = useState<string>('production');
  const { environments } = useProjectContext();

  useEffect(() => {
    if (environments.length > 0) {
      const environment = environments.find((environment) => environment._id === clientSideId);
      if (environment) {
        setEnvironment(environment.key);
      } else {
        setEnvironment(environments[0]?.key ?? 'production');
      }
    } else {
      setEnvironment('production');
    }
  }, [environments, clientSideId]);

  return <EnvironmentContext.Provider value={{ environment, setEnvironment }}>{children}</EnvironmentContext.Provider>;
};

export function useEnvironmentContext() {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironmentContext must be used within a EnvironmentProvider');
  }
  return context;
}
