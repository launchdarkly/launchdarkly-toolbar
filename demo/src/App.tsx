import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

import './App.css';
import { Home } from './pages/Home';
import { DevServerMode } from './pages/DevServerMode';
import { SDKMode } from './pages/SDKMode';
import { flagOverridePlugin } from '@launchdarkly/toolbar/plugins';

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
          plugins: [flagOverridePlugin],
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
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dev-server" element={<DevServerMode />} />
          <Route path="/sdk" element={<SDKMode />} />
        </Routes>
      </Router>
    </LDProvider>
  );
}

export default App;
