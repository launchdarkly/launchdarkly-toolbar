import { useEffect, useState } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { ToolbarPlugin } from '../plugins/ToolbarPlugin';
import { AppWrapper } from './AppWrapper';

import './App.css';

export const toolbarPlugin = new ToolbarPlugin();

function App() {
  const [LDProvider, setLDProvider] = useState<any>(null);

  useEffect(() => {
    const initializeLD = async () => {
      const Provider = await asyncWithLDProvider({
        clientSideID: '67b94f6d17a8b408fa943d3c',
        options: {
          baseUrl: 'https://app.ld.catamorphic.com',
          streamUrl: 'https://stream.ld.catamorphic.com',
          eventsUrl: 'https://events.ld.catamorphic.com',
          plugins: [toolbarPlugin],
        },
      });
      setLDProvider(() => Provider);
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
