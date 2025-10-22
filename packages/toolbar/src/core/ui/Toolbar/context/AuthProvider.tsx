import { createContext, useContext, useEffect, useState } from "react";
import { loadAuthenticated } from "../utils/localStorage";

interface AuthContextValue {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(loadAuthenticated());
  const [authenticating, setAuthenticating] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const maxAttempts = 100;

  const awaitDeviceAuthorizationToken = async (deviceCode: string) => {
    if (currentAttempt >= maxAttempts) {
      setAuthenticating(false);
      return;
    }
    setTimeout(async () => {
      const data = await fetch(`http://localhost:3000/internal/device-authorization/token`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceCode: deviceCode }) })
        .then(response => response.json())
        .then(data => {
          return data;
        });
      if (data) {
        setIsAuthenticated(true);
        setAuthenticating(false);
      }
      awaitDeviceAuthorizationToken(deviceCode);
    }, 2000);
    setCurrentAttempt(currentAttempt + 1);
  };

  useEffect(() => {
    if (isAuthenticated || authenticating) {
      return;
    }

    fetch(`http://localhost:3000/internal/device-authorization`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: 'e6506150369268abae3ed46152687201', deviceName: 'developer-toolbar' }) })
      .then(response => response.json())
      .then(data => {
        console.log('Device authorization data:', data);
        const verificationUri = data.verificationUri;
        console.log('Verification URI:', verificationUri);
        console.log('Opening verification URI in new window');
        const newWindow = window.open(`http://localhost:3002${verificationUri}`, '_blank');
        if (newWindow) {
          newWindow.focus();
        } else {
          console.error('Failed to open verification URI in new window');
        }
        awaitDeviceAuthorizationToken(data.deviceCode);
        setAuthenticating(true);
      })
      .catch(error => {
        console.error('Error fetching device authorization data:', error);
        setAuthenticating(false);
      });
  }, [isAuthenticated, authenticating]);

  return <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};