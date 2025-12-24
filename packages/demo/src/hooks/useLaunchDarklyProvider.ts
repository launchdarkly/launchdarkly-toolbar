import { useState, useEffect, useRef } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import type { LDPlugin } from '@launchdarkly/toolbar';
import { DEMO_CONFIG, demoLog } from '../config/demo';
import { startMockWorker, stopMockWorker } from '../mocks';

export interface UseLaunchDarklyProviderReturn {
  LDProvider: React.FC<{ children: React.ReactNode }> | null;
  isUsingMocks: boolean;
  isLoading: boolean;
}

interface UseLaunchDarklyProviderProps {
  clientSideID: string;
  baseUrl: string;
  streamUrl: string;
  eventsUrl: string;
  plugins: LDPlugin[];
}

export function useLaunchDarklyProvider(props: UseLaunchDarklyProviderProps): UseLaunchDarklyProviderReturn {
  const { clientSideID, baseUrl, streamUrl, eventsUrl, plugins } = props;

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
          clientSideID,
          options: {
            baseUrl,
            streamUrl,
            eventsUrl,
            plugins,
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
