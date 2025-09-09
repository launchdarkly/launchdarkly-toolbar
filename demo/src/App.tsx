import { useEffect, useState } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { AppWrapper } from './AppWrapper';

import './App.css';
import { debugOverridePlugin } from './plugins';

function App() {
  const [LDProvider, setLDProvider] = useState<React.FC<{ children: React.ReactNode }> | null>(null);

  useEffect(() => {
    const initializeLD = async () => {
      const Provider = await asyncWithLDProvider({
        clientSideID: import.meta.env.VITE_LD_CLIENT_SIDE_ID,
        options: {
          baseUrl: import.meta.env.VITE_LD_BASE_URL,
          streamUrl: import.meta.env.VITE_LD_STREAM_URL,
          eventsUrl: import.meta.env.VITE_LD_EVENTS_URL,
          plugins: [debugOverridePlugin],
        },
      });
      setLDProvider(() => Provider as React.FC<{ children: React.ReactNode }>);
    };

    initializeLD();
  }, []);

  if (!LDProvider) {
    return <div>Loading LaunchDarkly...</div>;
  }

  return (
    <LDProvider>
      <AppWrapper />
    </LDProvider>
  );
}

export default App;
