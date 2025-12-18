import { createContext, FC, useContext, useEffect, useRef } from 'react';
import { useProjectContext } from './ProjectProvider';
import { TOOLBAR_STORAGE_KEYS } from '../../utils/localStorage';
import { useLocalStorage } from '../../hooks/useLocalStorage';

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
  const [environment, setEnvironment] = useLocalStorage(STORAGE_KEY, 'production', {
    serialize: (v) => v,
    deserialize: (v) => v,
  });
  const { environments } = useProjectContext();
  // Track if we've done initial selection (not just loaded from storage)
  const hasSelectedRef = useRef(false);

  useEffect(() => {
    const hasSavedEnvironment = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) !== null;

    // If there's a saved environment, we're done - user's preference takes precedence
    if (hasSavedEnvironment) {
      hasSelectedRef.current = true;
      return;
    }

    // Only auto-select if we haven't already and environments are available
    if (!hasSelectedRef.current && environments.length > 0) {
      hasSelectedRef.current = true;
      // Try to match clientSideId, otherwise use first environment
      const matchedEnvironment = environments.find((env) => env._id === clientSideId);
      if (matchedEnvironment) {
        setEnvironment(matchedEnvironment.key);
      } else {
        setEnvironment(environments[0]?.key ?? 'production');
      }
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
