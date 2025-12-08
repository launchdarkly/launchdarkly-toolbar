import { createContext, RefObject, useContext, useMemo, useRef } from 'react';

export const IFRAME_COMMANDS = {
  LOGOUT: 'logout',
  GET_PROJECTS: 'get-projects',
  GET_FLAGS: 'get-flags',
  GET_FLAG: 'get-flag',
  GET_CONTEXTS: 'get-contexts',
};

export const getResponseTopic = (command: string) => `${command}-response`;
export const getErrorTopic = (command: string) => `${command}-error`;

export const IFRAME_EVENTS = {
  AUTHENTICATED: 'toolbar-authenticated',
  AUTH_REQUIRED: 'toolbar-authentication-required',
  AUTH_ERROR: 'toolbar-authentication-error',
  API_READY: 'api-ready',
};

interface IFrameProviderProps {
  children: React.ReactNode;
  authUrl: string;
}

type IFrameProviderType = {
  ref: RefObject<HTMLIFrameElement | null>;
  iframeSrc: string;
};

const IFrameContext = createContext<IFrameProviderType | null>(null);

export function IFrameProvider({ children, authUrl }: IFrameProviderProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const iframeSrc = useMemo(() => authUrl, [authUrl]);

  return <IFrameContext.Provider value={{ ref, iframeSrc }}>{children}</IFrameContext.Provider>;
}

export function useIFrameContext() {
  const context = useContext(IFrameContext);
  if (!context) {
    throw new Error('useIFrameContext must be used within an IFrameProvider');
  }
  return context;
}
