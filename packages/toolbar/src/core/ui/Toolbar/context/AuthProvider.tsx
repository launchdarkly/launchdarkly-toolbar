import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { IFRAME_EVENTS, useIFrameContext } from './IFrameProvider';
import { useAnalytics } from './AnalyticsProvider';

type AuthProviderType = {
  authenticated: boolean;
  authenticating: boolean;
  loading: boolean;
  setAuthenticating: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthProviderType>({
  authenticated: false,
  authenticating: false,
  setAuthenticating: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const { iframeSrc } = useIFrameContext();
  const analytics = useAnalytics();

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== iframeSrc) {
      return;
    }

    if (event.data.type === IFRAME_EVENTS.AUTHENTICATED) {
      analytics.trackLoginSuccess();
      setAuthenticated(true);
      setLoading(false);
    } else if (event.data.type === IFRAME_EVENTS.AUTH_REQUIRED) {
      setAuthenticated(false);
      setLoading(false);
    } else if (event.data.type === IFRAME_EVENTS.AUTH_ERROR) {
      setAuthenticated(false);
      setLoading(false);
      throw new Error(event.data.error);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return (
    <AuthContext.Provider value={{ authenticated, loading, authenticating, setAuthenticating }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
