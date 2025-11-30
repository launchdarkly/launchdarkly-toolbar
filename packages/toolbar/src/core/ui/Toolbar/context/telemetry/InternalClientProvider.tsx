import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { LDClient, LDContext } from 'launchdarkly-js-client-sdk';
import { setToolbarFlagClient } from '../../../../../flags';
import { enableSessionReplay } from '../../../../../flags/toolbarFlags';

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

  /**
   * Update the client context with new member/account information.
   */
  updateContext: (accountId: string, memberId: string) => Promise<void>;
}

const InternalClientContext = createContext<InternalClientContextValue | null>(null);

export interface InternalClientProviderProps {
  children: ReactNode;
  /**
   * Client-side id for the internal toolbar client.
   * This should be LaunchDarkly's internal toolbar client-side id.
   * If not provided, the internal client will not be initialized.
   */
  clientSideId?: string;
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
  /**
   * Stream URL for the LaunchDarkly instance.
   * Defaults to standard LaunchDarkly production environment.
   * Set this if using a custom LaunchDarkly instance.
   */
  streamUrl?: string;
  /**
   * Events URL for the LaunchDarkly instance.
   * Defaults to standard LaunchDarkly production environment.
   * Set this if using a custom LaunchDarkly instance.
   */
  eventsUrl?: string;
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
  clientSideId,
  initialContext,
  baseUrl,
  streamUrl,
  eventsUrl,
}: InternalClientProviderProps) {
  const [client, setClient] = useState<LDClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize internal client
  useEffect(() => {
    // Skip initialization if no clientSideId provided
    if (!clientSideId) {
      return;
    }

    let mounted = true;
    let clientToCleanup: LDClient | null = null;

    const initializeClient = async () => {
      try {
        setLoading(true);
        setError(null);

        const [{ initialize }, SessionReplay] = await Promise.all([
          import('launchdarkly-js-client-sdk'),
          import('@launchdarkly/session-replay').then((m) => m.default),
        ]);

        const context = initialContext || {
          kind: 'user',
          key: 'toolbar-anonymous',
          anonymous: true,
        };

        // Configure SDK options for custom URLs if provided
        const hasCustomUrls = baseUrl || streamUrl || eventsUrl;
        const options = hasCustomUrls
          ? {
              ...(baseUrl && { baseUrl }),
              ...(streamUrl && { streamUrl }),
              ...(eventsUrl && { eventsUrl }),
              // Add Session Replay plugin with manual start
              observabilityPlugins: [
                new SessionReplay({
                  manualStart: true,
                  privacySetting: 'default',
                }),
              ],
            }
          : {
              // Add Session Replay plugin with manual start
              observabilityPlugins: [
                new SessionReplay({
                  manualStart: true,
                  privacySetting: 'default',
                }),
              ],
            };

        const ldClient = initialize(clientSideId, context, options);
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
  }, [clientSideId, initialContext, baseUrl, streamUrl, eventsUrl]); // Re-initialize if any config changes

  const updateContext = useCallback(
    async (accountId: string, memberId: string) => {
      if (!client) {
        return;
      }

      try {
        await client.identify({
          kind: 'multi',
          account: {
            key: accountId,
          },
          user: {
            key: memberId,
          },
        });
      } catch (err) {
        console.error('[InternalClientProvider] Failed to update context:', err);
      }
    },
    [client],
  );
  // Monitor Session Replay flag and start/stop recording accordingly
  useEffect(() => {
    if (!client) {
      return;
    }

    const checkAndUpdateSessionReplay = async () => {
      try {
        const shouldEnableReplay = enableSessionReplay();

        if (shouldEnableReplay) {
          const { LDRecord } = await import('@launchdarkly/session-replay');
          LDRecord.start({ forceNew: false, silent: false });
          console.log('[InternalClientProvider] Session Replay started');
        } else {
          const { LDRecord } = await import('@launchdarkly/session-replay');
          LDRecord.stop();
          console.log('[InternalClientProvider] Session Replay stopped');
        }
      } catch (err) {
        console.error('[InternalClientProvider] Failed to control Session Replay:', err);
      }
    };

    // Check initial state
    checkAndUpdateSessionReplay();

    // Listen for flag changes
    const flagKey = 'toolbar-enable-session-replay';
    const handleFlagChange = () => {
      checkAndUpdateSessionReplay();
    };

    client.on(`change:${flagKey}`, handleFlagChange);

    return () => {
      client.off(`change:${flagKey}`, handleFlagChange);
    };
  }, [client]);

  const value: InternalClientContextValue = {
    client,
    loading,
    error,
    updateContext,
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
