import { createContext, FC, useCallback, useContext, useEffect, useState } from 'react';
import { useProjectContext } from './ProjectProvider';
import { useDevServerContext } from './DevServerProvider';
import { TOOLBAR_STORAGE_KEYS } from '../utils/localStorage';

const STORAGE_KEY = TOOLBAR_STORAGE_KEYS.ENVIRONMENT;

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
  const [environment, setEnvironmentState] = useState<string>('production');
  const { environments } = useProjectContext();
  const { state: devServerState } = useDevServerContext();

  // In dev-server mode, the environment is controlled by the dev server
  const isDevServerMode = devServerState.sourceEnvironmentKey !== null;
  const devServerEnvironment = devServerState.sourceEnvironmentKey;

  // Wrapper function to update environment and save to localStorage
  const setEnvironment = useCallback(
    (newEnvironment: string) => {
      setEnvironmentState(newEnvironment);
      // Only save to localStorage if not in dev-server mode
      if (!isDevServerMode) {
        localStorage.setItem(STORAGE_KEY, newEnvironment);
      }
    },
    [isDevServerMode],
  );

  // Sync with dev server environment when in dev-server mode
  useEffect(() => {
    if (isDevServerMode && devServerEnvironment) {
      setEnvironmentState(devServerEnvironment);
      return;
    }
  }, [isDevServerMode, devServerEnvironment]);

  // SDK mode: manage environment from localStorage and clientSideId
  useEffect(() => {
    // Skip this logic if in dev-server mode
    if (isDevServerMode) {
      return;
    }

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
  }, [environments, clientSideId, setEnvironment, isDevServerMode]);

  return <EnvironmentContext.Provider value={{ environment, setEnvironment }}>{children}</EnvironmentContext.Provider>;
};

export function useEnvironmentContext() {
  const context = useContext(EnvironmentContext);
  if (!context) {
    throw new Error('useEnvironmentContext must be used within a EnvironmentProvider');
  }
  return context;
}
