import { createContext, useCallback, useContext } from 'react';
import { useAuthContext } from './AuthProvider';
import { IFRAME_API_MESSAGES, useIFrameContext } from './IFrameProvider';

interface ApiProviderContextValue {
  getFlag: (flagKey: string) => Promise<any>;
  getProjects: () => Promise<any>;
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
        return null;
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
          if (event.origin !== iframeSrc) {
            return;
          }

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

  const getProjects = useCallback(async () => {
    if (!authenticated) {
      console.log('Authentication required');
      return null;
    }

    if (!ref.current?.contentWindow) {
      throw new Error('IFrame not found');
    }

    ref.current.contentWindow.postMessage(
      {
        type: IFRAME_API_MESSAGES.GET_PROJECTS.request,
      },
      iframeSrc,
    );

    return new Promise<any>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== iframeSrc) {
          return;
        }

        if (event.data.type === IFRAME_API_MESSAGES.GET_PROJECTS.response) {
          window.removeEventListener('message', handleMessage);
          resolve(event.data.data.items);
        } else if (event.data.type === IFRAME_API_MESSAGES.GET_PROJECTS.error) {
          window.removeEventListener('message', handleMessage);
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', handleMessage);
    });
  }, [authenticated, ref]);

  return <ApiContext.Provider value={{ getFlag, getProjects }}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
