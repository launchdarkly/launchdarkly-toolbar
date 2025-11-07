import { createContext, useCallback, useContext } from 'react';
import { useAuthContext } from './AuthProvider';
import { IFRAME_API_MESSAGES, useIFrameContext } from './IFrameProvider';

interface ApiProviderContextValue {
  getFlag: (flagKey: string) => Promise<any>;
}

const ApiContext = createContext<ApiProviderContextValue | null>(null);

export interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuthContext();
  const { ref, iframeSrc } = useIFrameContext();

  const getFlag = useCallback(
    async (flagKey: string) => {
      if (!authenticated) {
        console.log('Authentication required');
        return 'authentication required';
      }

      if (!ref.current?.contentWindow) {
        throw new Error('IFrame not found');
      }

      ref.current.contentWindow.postMessage(
        {
          type: IFRAME_API_MESSAGES.GET_FLAG.request,
          flagKey,
        },
        iframeSrc,
      );

      return new Promise((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === IFRAME_API_MESSAGES.GET_FLAG.response) {
            window.removeEventListener('message', handleMessage);
            resolve(event.data.data);
          } else if (event.data.type === IFRAME_API_MESSAGES.GET_FLAG.error) {
            window.removeEventListener('message', handleMessage);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', handleMessage);
      });
    },
    [authenticated, ref],
  );

  return <ApiContext.Provider value={{ getFlag }}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
