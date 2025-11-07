import { createContext, RefObject, useContext, useMemo, useRef } from 'react';

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

interface IFrameProviderProps {
  children: React.ReactNode;
  baseUrl: string;
}

type IFrameProviderType = {
  ref: RefObject<HTMLIFrameElement | null>;
  iframeSrc: string;
};

const IFrameContext = createContext<IFrameProviderType | null>(null);

export function IFrameProvider({ children, baseUrl }: IFrameProviderProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const iframeSrc = useMemo(() => {
    switch (baseUrl.toLowerCase()) {
      case 'https://app.launchdarkly.com':
        return 'https://integrations.launchdarkly.com';
      case 'https://ld-stg.launchdarkly.com':
        return 'https://integrations-stg.launchdarkly.com';
      case 'https://app.ld.catamorphic.com':
        return 'https://integrations.ld.catamorphic.com';
      default:
        return 'https://integrations.launchdarkly.com';
    }
  }, [baseUrl]);

  return <IFrameContext.Provider value={{ ref, iframeSrc }}>{children}</IFrameContext.Provider>;
}

export function useIFrameContext() {
  const context = useContext(IFrameContext);
  if (!context) {
    throw new Error('useIFrameContext must be used within an IFrameProvider');
  }
  return context;
}
