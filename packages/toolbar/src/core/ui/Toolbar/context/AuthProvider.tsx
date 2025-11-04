import { createContext, useContext, useEffect, useState } from "react";

type AuthProviderType = {
  authenticated: boolean;
}

const AuthContext = createContext<AuthProviderType>({
  authenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      console.log(event);

      if (event.data.type === 'toolbar-authenticated') {
        setAuthenticated(true);
        console.log('authenticated');
      }
    });
  }, []);
  
  return <AuthContext.Provider value={{ authenticated }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}