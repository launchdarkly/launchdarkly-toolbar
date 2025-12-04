import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthProvider';
import { getResponseTopic, getErrorTopic, IFRAME_COMMANDS, useIFrameContext, IFRAME_EVENTS } from './IFrameProvider';
import { FlagsPaginationParams, FlagsResponse, ApiFlag, ProjectsResponse } from '../../types/ldApi';
import { useAnalytics } from '../telemetry';

interface ApiProviderContextValue {
  apiReady: boolean;
  getFlag: (flagKey: string) => Promise<ApiFlag>;
  getProjects: () => Promise<ProjectsResponse>;
  getFlags: (projectKey: string, params?: FlagsPaginationParams) => Promise<FlagsResponse>;
}

const ApiContext = createContext<ApiProviderContextValue | null>(null);

export interface ApiProviderProps {
  children: React.ReactNode;
}

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const { authenticated } = useAuthContext();
  const { ref, iframeSrc } = useIFrameContext();
  const [apiReady, setApiReady] = useState(false);
  const analytics = useAnalytics();

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

  const sendMessage = useCallback(
    (command: string, data: any) => {
      if (!ref.current?.contentWindow) {
        throw new Error('IFrame not found');
      }

      // Generate unique request ID to match request with response
      const requestId = `${command}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      ref.current.contentWindow.postMessage({ type: command, requestId, ...data }, iframeSrc);

      return new Promise((resolve, reject) => {
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== iframeSrc) {
            return;
          }

          // Only handle messages that match this specific request ID
          if (event.data.requestId !== requestId) {
            return;
          }

          if (event.data.type === getResponseTopic(command)) {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timeoutId);
            resolve(event.data.data);
          } else if (event.data.type === getErrorTopic(command)) {
            window.removeEventListener('message', handleMessage);
            clearTimeout(timeoutId);
            analytics.trackApiError(new Error(event.data.error));
            reject(new Error(event.data.error));
          }
        };

        // Add timeout to prevent hanging promises
        const timeoutId = setTimeout(() => {
          window.removeEventListener('message', handleMessage);
          reject(new Error(`Request timeout: ${command}`));
        }, 30000); // 30 second timeout

        window.addEventListener('message', handleMessage);
      });
    },
    [ref, iframeSrc],
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  const getFlag = useCallback(
    async (flagKey: string) => {
      return sendMessage(IFRAME_COMMANDS.GET_FLAG, { flagKey }) as Promise<ApiFlag>;
    },
    [authenticated, ref],
  );

  const getProjects = useCallback(async () => {
    if (!authenticated) {
      console.log('Authentication required');
      return { items: [] };
    }

    return sendMessage(IFRAME_COMMANDS.GET_PROJECTS, {}) as Promise<ProjectsResponse>;
  }, [authenticated, ref]);

  const getFlags = useCallback(
    async (projectKey: string, params?: FlagsPaginationParams) => {
      if (!authenticated) {
        return { items: [], totalCount: 0 };
      }

      return sendMessage(IFRAME_COMMANDS.GET_FLAGS, {
        projectKey,
        limit: params?.limit,
        offset: params?.offset,
        query: params?.query,
      }) as Promise<FlagsResponse>;
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
