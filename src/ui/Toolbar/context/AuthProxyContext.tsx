import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AuthProxy, type ProxyState } from '../../../services/AuthProxy';

interface AuthProxyContextValue {
  proxy: AuthProxy | null;
  state: ProxyState;
  login: () => void;
  logout: () => void;
}

const AuthProxyContext = createContext<AuthProxyContextValue | null>(null);

interface AuthProxyProviderProps {
  children: React.ReactNode;
  origin?: string;
  projectKey?: string;
}

export function AuthProxyProvider({
  children,
  origin = 'http://localhost:5173',
  projectKey: _projectKey = 'default',
}: AuthProxyProviderProps) {
  const [proxy] = useState(() => new AuthProxy({ origin }));
  const [state, setState] = useState<ProxyState>('logged-out');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Use local mock iframe for POC
  const frameSrc = `${origin}/mock-iframe.html`;

  useEffect(() => {
    const unsubscribe = proxy.onStateChange(setState);
    return unsubscribe;
  }, [proxy]);

  useEffect(() => {
    if (iframeLoaded && iframeRef.current) {
      console.log('Setting iframe reference:', frameSrc);
      proxy.setIframe(iframeRef.current);

      // Add load event listener for debugging
      const iframe = iframeRef.current;
      const handleLoad = () => console.log('Iframe loaded successfully');
      const handleError = (e: any) => console.error('Iframe failed to load:', e);

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, [proxy, frameSrc, iframeLoaded]);

  const login = () => {
    // Load iframe on first login attempt
    if (!iframeLoaded) {
      console.log('Loading iframe for authentication...');
      setIframeLoaded(true);
      // Give iframe more time to fully load and initialize before trying to use it
      setTimeout(() => {
        console.log('Iframe should be ready now, attempting login...');
        proxy.login();
      }, 1500);
    } else {
      proxy.login();
    }
  };

  const logout = () => proxy.logout();

  return (
    <AuthProxyContext.Provider value={{ proxy, state, login, logout }}>
      {iframeLoaded && (
        <iframe
          ref={iframeRef}
          src={frameSrc}
          title="LaunchDarkly Authentication Proxy"
          style={{ display: 'none' }}
          width="0"
          height="0"
        />
      )}
      {children}
    </AuthProxyContext.Provider>
  );
}

export function useAuthProxy() {
  const context = useContext(AuthProxyContext);
  if (!context) {
    throw new Error('useAuthProxy must be used within an AuthProxyProvider');
  }
  return context;
}
