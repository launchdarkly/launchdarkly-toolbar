import { useState, useEffect, useRef } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { DEMO_CONFIG, demoLog } from '../config/demo';
import { startMockWorker, stopMockWorker } from '../mocks';
import { flagOverridePlugin } from '../plugins';

export interface UseLaunchDarklyProviderReturn {
  LDProvider: React.FC<{ children: React.ReactNode }> | null;
  isUsingMocks: boolean;
  isLoading: boolean;
}

export function useLaunchDarklyProvider(): UseLaunchDarklyProviderReturn {
  const [LDProvider, setLDProvider] = useState<React.FC<{ children: React.ReactNode }> | null>(null);
  const [isUsingMocks, setIsUsingMocks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isUsingMocksRef = useRef(false);

  useEffect(() => {
    const initializeLD = async () => {
      try {
        // Start mocks if explicitly requested
        if (DEMO_CONFIG.useMocks) {
          demoLog('Using explicit mock mode');
          await startMockWorker();
          setIsUsingMocks(true);
          isUsingMocksRef.current = true;
        }

        // Initialize LaunchDarkly provider
        const Provider = await asyncWithLDProvider({
          clientSideID: process.env.NEXT_PUBLIC_LD_CLIENT_SIDE_ID || 'test-client-side-id',
          options: {
            baseUrl: process.env.NEXT_PUBLIC_LD_BASE_URL,
            streamUrl: process.env.NEXT_PUBLIC_LD_STREAM_URL,
            eventsUrl: process.env.NEXT_PUBLIC_LD_EVENTS_URL,
            plugins: [flagOverridePlugin],
          },
        });

        demoLog('LaunchDarkly initialized successfully', { useMocks: isUsingMocksRef.current });
        setLDProvider(() => Provider as React.FC<{ children: React.ReactNode }>);
        setIsLoading(false);
      } catch (error) {
        demoLog('LaunchDarkly initialization failed', error);
        setIsLoading(false);
      }
    };

    initializeLD();

    // Cleanup
    return () => {
      if (isUsingMocksRef.current) {
        stopMockWorker();
      }
    };
  }, []);

  return {
    LDProvider,
    isUsingMocks,
    isLoading,
  };
}
