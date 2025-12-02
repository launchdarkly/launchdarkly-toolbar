import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { getErrorTopic, getResponseTopic, IFRAME_COMMANDS, IFRAME_EVENTS, useIFrameContext } from './IFrameProvider';
import { useAnalytics } from '../telemetry';

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
      analytics.trackAuthError(new Error(event.data.error));
      throw new Error(event.data.error);
    } else if (event.data.type === getResponseTopic(IFRAME_COMMANDS.LOGOUT)) {
      setAuthenticated(false);
      setLoading(false);
    } else if (event.data.type === getErrorTopic(IFRAME_COMMANDS.LOGOUT)) {
      setAuthenticated(false);
      setLoading(false);
      throw new Error(event.data.error);
    }
  }, []);

  const logout = useCallback(() => {
    const iframe = ref.current;
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ type: IFRAME_COMMANDS.LOGOUT }, iframeSrc);
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
