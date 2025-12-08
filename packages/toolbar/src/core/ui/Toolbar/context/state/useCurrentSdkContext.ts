import { useCallback, useEffect, useRef, useState } from 'react';
import type { LDContext } from 'launchdarkly-js-client-sdk';
import { usePlugins } from './PluginsProvider';

/**
 * Normalized context info extracted from LDContext
 */
export interface CurrentContextInfo {
  /** The context kind (e.g., "user", "organization", "device") */
  kind: string;
  /** The unique identifier for the context */
  key: string;
  /** Optional display name */
  name?: string;
  /** Whether the context is anonymous */
  anonymous?: boolean;
  /** The raw LDContext object */
  raw: LDContext;
}

/**
 * Extracts normalized context info from an LDContext
 * Handles both single-kind and multi-kind contexts
 */
function extractContextInfo(ldContext: LDContext | undefined): CurrentContextInfo | null {
  if (!ldContext) return null;

  // Handle multi-kind context
  if ('kind' in ldContext && ldContext.kind === 'multi') {
    // For multi-kind, we'll return the first context (usually user)
    // In the future, we could return an array of all contexts
    const multiContext = ldContext as Record<string, any>;
    const kinds = Object.keys(multiContext).filter((k) => k !== 'kind');

    const firstKind = kinds[0];
    if (firstKind) {
      const contextData = multiContext[firstKind];
      if (contextData) {
        return {
          kind: firstKind,
          key: contextData.key || '',
          name: contextData.name,
          anonymous: contextData.anonymous,
          raw: ldContext,
        };
      }
    }
    return null;
  }

  // Handle single-kind context
  if ('kind' in ldContext && typeof ldContext.kind === 'string') {
    return {
      kind: ldContext.kind,
      key: (ldContext as any).key || '',
      name: (ldContext as any).name,
      anonymous: (ldContext as any).anonymous,
      raw: ldContext,
    };
  }

  // Handle legacy user context (no kind specified means "user")
  if ('key' in ldContext) {
    return {
      kind: 'user',
      key: (ldContext as any).key || '',
      name: (ldContext as any).name,
      anonymous: (ldContext as any).anonymous,
      raw: ldContext,
    };
  }

  return null;
}

function areContextsEqual(a: CurrentContextInfo | null, b: CurrentContextInfo | null): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  return a.kind === b.kind && a.key === b.key;
}

/**
 * Hook to get the current SDK context from the LaunchDarkly client
 * This represents the context currently being used for flag evaluations
 *
 * @returns CurrentContextInfo or null if no client/context is available
 */
export function useCurrentSdkContext(): CurrentContextInfo | null {
  const { flagOverridePlugin, eventInterceptionPlugin } = usePlugins();
  const [contextInfo, setContextInfo] = useState<CurrentContextInfo | null>(null);
  const lastContextRef = useRef<CurrentContextInfo | null>(null);

  // Get the client from either plugin
  const ldClient = flagOverridePlugin?.getClient() ?? eventInterceptionPlugin?.getClient() ?? null;

  // Function to update context if it has changed
  const updateContext = useCallback(() => {
    if (!ldClient) {
      if (lastContextRef.current !== null) {
        lastContextRef.current = null;
        setContextInfo(null);
      }
      return;
    }

    try {
      const rawContext = ldClient.getContext();
      const newContextInfo = extractContextInfo(rawContext);

      // Only update state if the context actually changed
      if (!areContextsEqual(newContextInfo, lastContextRef.current)) {
        lastContextRef.current = newContextInfo;
        setContextInfo(newContextInfo);
      }
    } catch {
      if (lastContextRef.current !== null) {
        lastContextRef.current = null;
        setContextInfo(null);
      }
    }
  }, [ldClient]);

  // Get initial context and subscribe to changes
  useEffect(() => {
    // Get initial context
    updateContext();

    if (!ldClient) return;

    // Subscribe to changes (context changes happen on identify)
    const handleChange = () => {
      updateContext();
    };

    ldClient.on('change', handleChange);

    return () => {
      ldClient.off('change', handleChange);
    };
  }, [ldClient, updateContext]);

  return contextInfo;
}

/**
 * Helper function to check if a given context matches the current SDK context
 */
export function isCurrentContext(
  currentContext: CurrentContextInfo | null,
  contextKind: string,
  contextKey: string,
): boolean {
  if (!currentContext) return false;
  return currentContext.kind === contextKind && currentContext.key === contextKey;
}
