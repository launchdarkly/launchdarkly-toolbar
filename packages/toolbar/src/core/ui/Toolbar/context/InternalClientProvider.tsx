import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { LDClient, LDContext } from 'launchdarkly-js-client-sdk';
import { setToolbarFlagClient } from '../../../../flags/createToolbarFlagFunction';

export interface AuthState {
  authenticated: boolean;
  userId?: string;
  email?: string;
  [key: string]: unknown;
}

export interface InternalClientContextValue {
  /**
   * The internal LaunchDarkly client for toolbar features and analytics.
   * null if not yet initialized.
   */
  client: LDClient | null;
  /**
   * Whether the internal client is currently initializing.
   */
  loading: boolean;
  /**
   * Error during initialization, if any.
   */
  error: Error | null;
}

const InternalClientContext = createContext<InternalClientContextValue | null>(null);

export interface InternalClientProviderProps {
  children: ReactNode;
  /**
   * Client-side ID for the internal toolbar client.
   * This should be LaunchDarkly's internal toolbar client-side ID.
   */
  clientSideID: string;
  /**
   * Initial context for the internal client.
   * If not provided, an anonymous context will be used.
   */
  initialContext?: LDContext;
  /**
   * Base URL for the LaunchDarkly instance.
   * Defaults to standard LaunchDarkly production environment.
   * Set this if using a custom LaunchDarkly instance.
   */
  baseUrl?: string;
}

/**
 * InternalClientProvider manages the toolbar's internal LaunchDarkly client.
 *
 * This provider handles:
 * - Initializing the internal client for toolbar features and analytics
 * - Updating context when user authenticates
 * - Sending analytics to LaunchDarkly's internal project
 *
 * The external client (user's app client) is accessed separately via plugins.
 */
export function InternalClientProvider({
  children,
  clientSideID,
  initialContext,
  baseUrl,
}: InternalClientProviderProps) {
  const [client, setClient] = useState<LDClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize internal client
  useEffect(() => {
    let mounted = true;
    let clientToCleanup: LDClient | null = null;

    const initializeClient = async () => {
      try {
        setLoading(true);
        setError(null);

        const { initialize } = await import('launchdarkly-js-client-sdk');

        const context = initialContext || {
          kind: 'user',
          key: 'toolbar-anonymous',
          anonymous: true,
        };

        // Configure SDK options for custom base URL if provided
        const options = baseUrl
          ? {
              baseUrl: baseUrl,
              streamUrl: baseUrl.replace(/\/\/app\./, '//clientstream.'),
              eventsUrl: baseUrl.replace(/\/\/app\./, '//events.'),
            }
          : undefined;

        const ldClient = initialize(clientSideID, context, options);
        clientToCleanup = ldClient;

        await ldClient.waitForInitialization();

        if (mounted) {
          setClient(ldClient);
          setToolbarFlagClient(ldClient); // Make client available to flag functions
          setLoading(false);
          console.log('[InternalClientProvider] Internal client initialized');
        }
      } catch (err) {
        console.error('[InternalClientProvider] Failed to initialize internal client:', err);

        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize client'));
          setLoading(false);
        }
      }
    };

    initializeClient();

    // Cleanup on unmount
    return () => {
      mounted = false;

      if (clientToCleanup) {
        setToolbarFlagClient(null); // Clear singleton reference
        clientToCleanup.close();
      }
    };
  }, [clientSideID, initialContext, baseUrl]); // Re-initialize if client-side ID, initial context, or base URL changes

  const value: InternalClientContextValue = {
    client,
    loading,
    error,
  };

  return <InternalClientContext.Provider value={value}>{children}</InternalClientContext.Provider>;
}

/**
 * Hook to access the internal LaunchDarkly client.
 */
export function useInternalClient(): InternalClientContextValue {
  const context = useContext(InternalClientContext);

  if (!context) {
    throw new Error('useInternalClient must be used within InternalClientProvider');
  }

  return context;
}

/**
 * Hook to get just the client instance (or null if not ready).
 *
 * This is a convenience hook for cases where you don't need loading/error state.
 */
export function useInternalClientInstance(): LDClient | null {
  const { client } = useInternalClient();
  return client;
}

/**
 * Hook to update the internal client context with auth information.
 *
 * Call this when the user authenticates to update the client's context.
 */
export function useUpdateInternalClientContext() {
  const { client } = useInternalClient();

  return async (authState: AuthState) => {
    if (!client || !authState.authenticated) return;

    const userContext: LDContext = {
      kind: 'user',
      key: authState.userId || 'unknown',
      email: authState.email,
      authenticated: true,
    };

    try {
      await client.identify(userContext);
      console.log('[InternalClientProvider] Context updated with auth');
    } catch (err) {
      console.error('[InternalClientProvider] Failed to update context:', err);
      throw err;
    }
  };
}
