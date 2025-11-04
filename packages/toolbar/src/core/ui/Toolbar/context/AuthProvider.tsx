import { createContext, useContext, useEffect, useState } from "react";

type AuthProviderType = {
  authenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthProviderType>({
  authenticated: false,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      console.log(event);

      if (event.data.type === 'toolbar-authenticated') {
        setAuthenticated(true);
        console.log('authenticated');
        setLoading(false);
      } else if (event.data.type === 'toolbar-authentication-required') { 
        setAuthenticated(false);
        setLoading(false);
      }
    });
  }, []);
  
  return <AuthContext.Provider value={{ authenticated, loading }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}