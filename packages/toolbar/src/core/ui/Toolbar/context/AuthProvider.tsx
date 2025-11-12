import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';
import { IFRAME_API_MESSAGES, useIFrameContext } from './IFrameProvider';

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

  const handleMessage = useCallback((event: MessageEvent) => {
    console.log('event', event);
    console.log('iframeSrc', iframeSrc);
    if (event.origin !== iframeSrc) {
      return;
    }

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
