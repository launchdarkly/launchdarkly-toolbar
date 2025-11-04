import { createContext, useCallback, useContext } from "react";
import { useAuthContext } from "./AuthProvider";
import { useIFrameContext } from "./IFrameProvider";

interface ApiProviderContextValue {
  getFlag: (flagKey: string) => Promise<any>;
}

const ApiContext = createContext<ApiProviderContextValue | null>(null);

export interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuthContext();
  const { ref } = useIFrameContext();

  const getFlag = useCallback(async (flagKey: string) => {
    if (!authenticated) {
      throw new Error('Not authenticated');
    }

    ref.current?.contentWindow?.postMessage({
      type: 'get-flag',
      flagKey,
    }, '*');

    return new Promise((resolve) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === 'get-flag-response') {
          resolve(event.data.value);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    });
  }, [authenticated, ref]);

  return <ApiContext.Provider value={{ getFlag }}>{children}</ApiContext.Provider>;
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}