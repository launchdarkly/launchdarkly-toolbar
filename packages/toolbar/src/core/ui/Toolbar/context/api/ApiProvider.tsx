import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './AuthProvider';
import { getResponseTopic, getErrorTopic, IFRAME_COMMANDS, useIFrameContext, IFRAME_EVENTS } from './IFrameProvider';
import { FlagsPaginationParams, FlagsResponse, ProjectsResponse, SearchContextsResponse } from '../../types/ldApi';
import { useAnalytics } from '../telemetry';

interface ApiProviderContextValue {
  apiReady: boolean;
  getProjects: () => Promise<ProjectsResponse>;
  getFlags: (projectKey: string, params?: FlagsPaginationParams) => Promise<FlagsResponse>;
  getContexts: (projectKey: string, environmentKey: string) => Promise<SearchContextsResponse>;
}

const ApiContext = createContext<ApiProviderContextValue | null>(null);

export interface ApiProviderProps {
  children: React.ReactNode;
}

interface PendingRequest {
  command: string;
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

const pendingRequests = new Map<string, PendingRequest>();

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
        return;
      }

      const { requestId } = event.data;
      const pending = pendingRequests.get(requestId);

      if (!pending) {
        // Not a response we're waiting for (could be for a different request or already handled)
        return;
      }

      const { command, resolve, reject, timeoutId } = pending;

      if (event.data.type === getResponseTopic(command)) {
        clearTimeout(timeoutId);
        pendingRequests.delete(requestId);
        resolve(event.data.data);
      } else if (event.data.type === getErrorTopic(command)) {
        clearTimeout(timeoutId);
        pendingRequests.delete(requestId);
        analytics.trackApiError(new Error(event.data.error));
        reject(new Error(event.data.error));
      }
    },
    [iframeSrc, analytics],
  );

  const sendMessage = useCallback(
    (command: string, data: any) => {
      return new Promise((resolve, reject) => {
        if (!ref.current?.contentWindow) {
          reject(new Error('IFrame not found'));
          return;
        }

        const requestId = `${command}-${crypto.randomUUID()}`;
        const timeoutId = setTimeout(() => {
          pendingRequests.delete(requestId);
          reject(new Error(`Request timeout: ${command}`));
        }, 30000);

        pendingRequests.set(requestId, {
          command,
          resolve,
          reject,
          timeoutId,
        });

        ref.current.contentWindow.postMessage({ type: command, requestId, ...data }, iframeSrc);
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

  const getProjects = useCallback(async () => {
    if (!authenticated) {
      return { items: [] };
    }

    return sendMessage(IFRAME_COMMANDS.GET_PROJECTS, {}) as Promise<ProjectsResponse>;
  }, [authenticated, sendMessage]);

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
    [authenticated, sendMessage],
  );

  const getContexts = useCallback(
    async (projectKey: string, environmentKey: string) => {
      if (!authenticated) {
        return { items: [] };
      }

      return sendMessage(IFRAME_COMMANDS.GET_CONTEXTS, {
        projectKey,
        environmentKey,
      }) as Promise<SearchContextsResponse>;
    },
    [authenticated, sendMessage],
  );

  return <ApiContext.Provider value={{ apiReady, getProjects, getFlags, getContexts }}>{children}</ApiContext.Provider>;
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
