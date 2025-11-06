import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IFRAME_API_MESSAGES } from './IFrameProvider';

type AuthProviderType = {
  authenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthProviderType>({
  authenticated: false,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === IFRAME_API_MESSAGES.AUTHENTICATION.authenticated) {
      setAuthenticated(true);
      setLoading(false);
    } else if (event.data.type === IFRAME_API_MESSAGES.AUTHENTICATION.authenticationRequired) {
      setAuthenticated(false);
      setLoading(false);
    } else if (event.data.type === IFRAME_API_MESSAGES.AUTHENTICATION.error) {
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

  return <AuthContext.Provider value={{ authenticated, loading }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
