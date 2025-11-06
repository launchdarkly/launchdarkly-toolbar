import { createContext, RefObject, useContext, useRef } from 'react';

export const IFRAME_API_MESSAGES = {
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

type IFrameProviderType = {
  ref: RefObject<HTMLIFrameElement | null>;
};

const IFrameContext = createContext<IFrameProviderType | null>(null);

export function IFrameProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLIFrameElement | null>(null);

  return <IFrameContext.Provider value={{ ref }}>{children}</IFrameContext.Provider>;
}

export function useIFrameContext() {
  const context = useContext(IFrameContext);
  if (!context) {
    throw new Error('useIFrameContext must be used within an IFrameProvider');
  }
  return context;
}
