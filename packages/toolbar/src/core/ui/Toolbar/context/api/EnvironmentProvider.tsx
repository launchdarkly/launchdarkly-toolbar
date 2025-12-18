import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useProjectContext } from './ProjectProvider';

interface EnvironmentContextType {
  environment: string;
  setEnvironment: (environment: string) => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

interface EnvironmentProviderProps {
  children: React.ReactNode;
  clientSideId?: string;
}

export const EnvironmentProvider: FC<EnvironmentProviderProps> = ({ children, clientSideId }) => {
  const [environment, setEnvironment] = useState<string>('production');
  const { environments } = useProjectContext();

  useEffect(() => {
    if (environments.length > 0) {
      // Determine environment from environments and clientSideId
      const matchedEnvironment = environments.find((env) => env._id === clientSideId);
      if (matchedEnvironment) {
        setEnvironment(matchedEnvironment.key);
      } else {
        setEnvironment(environments[0]?.key ?? 'production');
      }
    } else {
      // Default fallback
      setEnvironment('production');
    }
  }, [environments, clientSideId, setEnvironment]);

  return <EnvironmentContext.Provider value={{ environment, setEnvironment }}>{children}</EnvironmentContext.Provider>;
};

export function useEnvironmentContext(): EnvironmentContextType {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironmentContext must be used within an EnvironmentProvider');
  }
  return context;
}
