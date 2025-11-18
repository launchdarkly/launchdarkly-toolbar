import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { IFRAME_API_MESSAGES, useIFrameContext } from './IFrameProvider';
import { useAnalytics } from './AnalyticsProvider';

type AuthProviderType = {
  authenticated: boolean;
  authenticating: boolean;
  loading: boolean;
  setAuthenticating: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
};

const AuthContext = createContext<AuthProviderType>({
  authenticated: false,
  authenticating: false,
  setAuthenticating: () => {},
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const { iframeSrc, ref } = useIFrameContext();
  const analytics = useAnalytics();

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.origin !== iframeSrc) {
      return;
    }

    if (event.data.type === IFRAME_API_MESSAGES.AUTHENTICATION.authenticated) {
      analytics.trackLoginSuccess();
      setAuthenticated(true);
      setLoading(false);
    } else if (event.data.type === IFRAME_API_MESSAGES.AUTHENTICATION.authenticationRequired) {
      setAuthenticated(false);
      setLoading(false);
    } else if (event.data.type === IFRAME_API_MESSAGES.AUTHENTICATION.error) {
      setAuthenticated(false);
      setLoading(false);
      throw new Error(event.data.error);
    } else if (event.data.type === IFRAME_API_MESSAGES.LOGOUT.response) {
      setAuthenticated(false);
      setLoading(false);
    } else if (event.data.type === IFRAME_API_MESSAGES.LOGOUT.error) {
      setAuthenticated(false);
      setLoading(false);
      throw new Error(event.data.error);
    }
  }, []);

  const logout = useCallback(() => {
    const iframe = ref.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: IFRAME_API_MESSAGES.LOGOUT.request }, iframeSrc);
    }
  }, [ref, iframeSrc]);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return (
    <AuthContext.Provider value={{ authenticated, loading, authenticating, setAuthenticating, logout }}>
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
