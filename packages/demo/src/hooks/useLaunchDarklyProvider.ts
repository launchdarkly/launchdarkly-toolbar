import { useState, useEffect, useRef } from 'react';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { DEMO_CONFIG, demoLog } from '../config/demo';
import { startMockWorker, stopMockWorker } from '../mocks';
import { flagOverridePlugin, eventInterceptionPlugin } from '../plugins';

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
        await initializeLaunchDarkly();
      } catch (error) {
        await handleInitializationError(error);
      }
    };

    const initializeLaunchDarkly = async () => {
      // Start mocks if forced
      if (DEMO_CONFIG.useMocks) {
        await enableMockMode();
      }

      // Create LD provider with timeout
      const ldPromise = asyncWithLDProvider({
        clientSideID: import.meta.env.VITE_LD_CLIENT_SIDE_ID,
        options: {
          baseUrl: import.meta.env.VITE_LD_BASE_URL,
          streamUrl: import.meta.env.VITE_LD_STREAM_URL,
          eventsUrl: import.meta.env.VITE_LD_EVENTS_URL,
          plugins: [flagOverridePlugin, eventInterceptionPlugin],
        },
      });

      const timeoutPromise = createTimeoutPromise();
      const Provider = await Promise.race([ldPromise, timeoutPromise]);

      demoLog('LaunchDarkly initialized successfully', { useMocks: isUsingMocksRef.current });
      setLDProvider(() => Provider as React.FC<{ children: React.ReactNode }>);
      setIsLoading(false);
    };

    const handleInitializationError = async (error: unknown) => {
      demoLog('LaunchDarkly initialization failed', error);

      if (DEMO_CONFIG.fallbackToMocks && !isUsingMocksRef.current) {
        await fallbackToMocks();
      } else {
        setIsLoading(false);
      }
    };

    const fallbackToMocks = async () => {
      demoLog('Falling back to mock mode');

      try {
        await enableMockMode();

        const Provider = await asyncWithLDProvider({
          clientSideID: import.meta.env.VITE_LD_CLIENT_SIDE_ID,
          options: {
            baseUrl: import.meta.env.VITE_LD_BASE_URL,
            streamUrl: import.meta.env.VITE_LD_STREAM_URL,
            eventsUrl: import.meta.env.VITE_LD_EVENTS_URL,
            plugins: [flagOverridePlugin, eventInterceptionPlugin],
          },
        });

        demoLog('LaunchDarkly initialized with mock fallback');
        setLDProvider(() => Provider as React.FC<{ children: React.ReactNode }>);
        setIsLoading(false);
      } catch (fallbackError) {
        demoLog('Mock fallback also failed', fallbackError);
        setIsLoading(false);
      }
    };

    const enableMockMode = async () => {
      demoLog('Enabling mock mode');
      await startMockWorker();
      setIsUsingMocks(true);
      isUsingMocksRef.current = true;
    };

    const createTimeoutPromise = () => {
      return new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('LaunchDarkly initialization timeout'));
        }, DEMO_CONFIG.initTimeout);
      });
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
