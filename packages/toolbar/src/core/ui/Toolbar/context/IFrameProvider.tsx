import { createContext, RefObject, useContext, useMemo, useRef } from 'react';

export const IFRAME_API_MESSAGES = {
  GET_PROJECTS: {
    request: 'get-projects',
    response: 'get-projects-response',
    error: 'get-projects-error',
  },
  AUTHENTICATION: {
    authenticated: 'toolbar-authenticated',
    authenticationRequired: 'toolbar-authentication-required',
    error: 'toolbar-authentication-error',
  },
  GET_FLAG: {
    request: 'get-flag',
    response: 'get-flag-response',
    error: 'get-flag-error',
  },
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
