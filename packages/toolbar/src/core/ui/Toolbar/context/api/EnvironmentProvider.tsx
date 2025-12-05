import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { useProjectContext } from './ProjectProvider';
import { TOOLBAR_STORAGE_KEYS } from '../../utils/localStorage';

const STORAGE_KEY = TOOLBAR_STORAGE_KEYS.ENVIRONMENT;

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
  const [environment, setEnvironmentState] = useState<string>('production');
  const { environments } = useProjectContext();

  // Wrapper function to update environment and save to localStorage
  const setEnvironment = useCallback((newEnvironment: string) => {
    setEnvironmentState(newEnvironment);
    localStorage.setItem(STORAGE_KEY, newEnvironment);
  }, []);

  useEffect(() => {
    // Check if there's a saved environment in localStorage
    const savedEnvironment = localStorage.getItem(STORAGE_KEY);

    if (savedEnvironment) {
      // Use saved value without triggering a save
      setEnvironmentState(savedEnvironment);
    } else if (environments.length > 0) {
      // If no saved environment, determine from environments and clientSideId
      const matchedEnvironment = environments.find((env) => env._id === clientSideId);
      if (matchedEnvironment) {
        setEnvironment(matchedEnvironment.key);
      } else {
        setEnvironment(environments[0]?.key ?? 'production');
      }
    } else {
      // Default fallback - don't save to localStorage yet, just set state
      setEnvironmentState('production');
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
