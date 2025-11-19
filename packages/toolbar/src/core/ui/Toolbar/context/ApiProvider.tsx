import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthProvider';
import { getResponseTopic, getErrorTopic, IFRAME_COMMANDS, useIFrameContext, IFRAME_EVENTS } from './IFrameProvider';
import { ApiProject, FlagsPaginationParams } from '../types/ldApi';

interface ApiProviderContextValue {
  apiReady: boolean;
  getFlag: (flagKey: string) => Promise<any>;
  getProjects: () => Promise<ApiProject[]>;
  getFlags: (projectKey: string, params?: FlagsPaginationParams) => Promise<any>;
}

const ApiContext = createContext<ApiProviderContextValue | null>(null);

export interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuthContext();
  const { ref, iframeSrc } = useIFrameContext();
  const [apiReady, setApiReady] = useState(false);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== iframeSrc) {
        return;
      }

      if (event.data.type === IFRAME_EVENTS.API_READY) {
        setApiReady(true);
      }
    },
    [iframeSrc],
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

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
          type: IFRAME_COMMANDS.GET_FLAG,
          flagKey,
        },
        iframeSrc,
      );

      return new Promise((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== iframeSrc) {
            return;
          }

          if (event.data.type === getResponseTopic(IFRAME_COMMANDS.GET_FLAG)) {
            window.removeEventListener('message', handleMessage);
            resolve(event.data.data);
          } else if (event.data.type === getErrorTopic(IFRAME_COMMANDS.GET_FLAG)) {
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
      return [];
    }

    if (!ref.current?.contentWindow) {
      throw new Error('IFrame not found');
    }

    ref.current.contentWindow.postMessage(
      {
        type: IFRAME_COMMANDS.GET_PROJECTS,
      },
      iframeSrc,
    );

    return new Promise<ApiProject[]>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== iframeSrc) {
          return;
        }

        if (event.data.type === getResponseTopic(IFRAME_COMMANDS.GET_PROJECTS)) {
          window.removeEventListener('message', handleMessage);
          resolve(event.data.data.items);
        } else if (event.data.type === getErrorTopic(IFRAME_COMMANDS.GET_PROJECTS)) {
          window.removeEventListener('message', handleMessage);
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', handleMessage);
    });
  }, [authenticated, ref]);

  const getFlags = useCallback(
    async (projectKey: string, params?: FlagsPaginationParams) => {
      if (!authenticated) {
        return { items: [], totalCount: 0 };
      }

      if (!ref.current?.contentWindow) {
        throw new Error('IFrame not found');
      }

      ref.current.contentWindow.postMessage(
        {
          type: IFRAME_COMMANDS.GET_FLAGS,
          projectKey,
          limit: params?.limit,
          offset: params?.offset,
          query: params?.query,
        },
        iframeSrc,
      );

      return new Promise<any>((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== iframeSrc) {
            return;
          }

          if (event.data.type === getResponseTopic(IFRAME_COMMANDS.GET_FLAGS)) {
            window.removeEventListener('message', handleMessage);
            resolve(event.data.data);
          } else if (event.data.type === getErrorTopic(IFRAME_COMMANDS.GET_FLAGS)) {
            window.removeEventListener('message', handleMessage);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', handleMessage);
      });
    },
    [authenticated, ref, iframeSrc],
  );

  return <ApiContext.Provider value={{ apiReady, getFlag, getProjects, getFlags }}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
