import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useCurrentSdkContext, CurrentContextInfo, isCurrentContext } from '../state/useCurrentSdkContext';
import { loadContexts, saveContexts } from '../../utils/localStorage';
import { Context } from '../../types/ldApi';
import { usePlugins } from '../state/PluginsProvider';
import type { LDContext } from 'launchdarkly-js-client-sdk';

interface ContextsContextType {
  contexts: Context[];
  filter: string;
  setFilter: (filter: string) => void;
  addContext: (context: Context) => void;
  removeContext: (kind: string, key: string) => void;
  setContext: (context: Context) => Promise<void>;
  currentSdkContext: CurrentContextInfo | null;
  isActiveContext: (contextKind: string, contextKey: string) => boolean;
}

const ContextsContext = createContext<ContextsContextType | undefined>(undefined);

export const ContextsProvider = ({ children }: { children: React.ReactNode }) => {
  const currentSdkContext = useCurrentSdkContext();
  const { flagOverridePlugin, eventInterceptionPlugin } = usePlugins();
  const [storedContexts, setStoredContexts] = useState<Context[]>(loadContexts);
  const [filter, setFilter] = useState('');
  const lastAddedContextRef = useRef<string | null>(null);

  // Get the LD client from plugins
  const ldClient = flagOverridePlugin?.getClient() ?? eventInterceptionPlugin?.getClient() ?? null;

  // Helper function to check if a context is the active SDK context
  const isActiveContext = useCallback(
    (contextKind: string, contextKey: string) => {
      return isCurrentContext(currentSdkContext, contextKind, contextKey);
    },
    [currentSdkContext],
  );

  // Add a new context to the list
  const addContext = useCallback((context: Context) => {
    setStoredContexts((prev) => {
      // Check if context already exists (by kind and key)
      const exists = prev.some((c) => c.kind === context.kind && c.key === context.key);
      if (exists) {
        return prev; // Don't add duplicates
      }
      const updated = [...prev, context];
      saveContexts(updated);
      return updated;
    });
  }, []);

  // Remove a context from the list
  const removeContext = useCallback(
    (kind: string, key: string) => {
      // Prevent deletion of active context
      if (isActiveContext(kind, key)) {
        console.warn('Cannot delete active context');
        return;
      }
      setStoredContexts((prev) => {
        const updated = prev.filter((c) => !(c.kind === kind && c.key === key));
        saveContexts(updated);
        return updated;
      });
    },
    [isActiveContext],
  );

  // Set the current context and update the host application's LD Client via identify
  const setContext = useCallback(
    async (context: Context) => {
      if (!ldClient) {
        console.warn('LD Client not available. Cannot set context.');
        return;
      }

      try {
        // Convert Context to LDContext format for identify
        // If it's already a multi-kind context, use it as-is
        // Otherwise, construct a single-kind context
        const ldContext: LDContext =
          context.kind === 'multi'
            ? (context as any) // Multi-kind contexts are already in the correct format
            : {
                kind: context.kind,
                key: context.key || context.name,
                ...(context.name && context.name !== (context.key || context.name) && { name: context.name }),
                ...(context.anonymous !== undefined && { anonymous: context.anonymous }),
              };

        await ldClient.identify(ldContext);
      } catch (error) {
        console.error('Failed to identify context:', error);
        throw error;
      }
    },
    [ldClient],
  );

  // Automatically add the current SDK context to the list if it's not already there
  useEffect(() => {
    if (!currentSdkContext) {
      lastAddedContextRef.current = null;
      return;
    }

    // Create a unique identifier for this context
    const contextId = `${currentSdkContext.kind}:${currentSdkContext.key}`;

    // Skip if we've already processed this context
    if (lastAddedContextRef.current === contextId) {
      return;
    }

    // Use functional update to check current state and add if needed
    setStoredContexts((prev) => {
      // Check if context already exists in stored contexts
      const exists = prev.some((c) => c.kind === currentSdkContext.kind && c.key === currentSdkContext.key);

      if (exists) {
        // Track that we've seen this context (even if it already existed)
        lastAddedContextRef.current = contextId;
        return prev;
      }

      // Convert CurrentContextInfo to ApiContext format
      // Use key for name if name is not present
      const apiContext: Context = {
        kind: currentSdkContext.kind,
        key: currentSdkContext.key,
        name: currentSdkContext.name || currentSdkContext.key,
        anonymous: currentSdkContext.anonymous,
      };

      const updated = [...prev, apiContext];
      saveContexts(updated);
      // Track that we've added this context
      lastAddedContextRef.current = contextId;
      return updated;
    });
  }, [currentSdkContext]);

  // Filter contexts client-side
  const contexts = useMemo(() => {
    let filtered = storedContexts;

    if (filter.trim()) {
      const filterLower = filter.toLowerCase();
      filtered = storedContexts.filter((ctx) => {
        const matchesKey = ctx.key?.toLowerCase().includes(filterLower);
        const matchesKind = ctx.kind.toLowerCase().includes(filterLower);
        const matchesName = ctx.name?.toLowerCase().includes(filterLower);
        return matchesKey || matchesKind || matchesName;
      });
    }

    // Sort to put active context first
    return filtered.sort((a, b) => {
      const aIsActive = isActiveContext(a.kind, a.name || '');
      const bIsActive = isActiveContext(b.kind, b.name || '');
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      return 0;
    });
  }, [storedContexts, filter, isActiveContext]);

  return (
    <ContextsContext.Provider
      value={{
        contexts,
        filter,
        setFilter,
        addContext,
        removeContext,
        setContext,
        currentSdkContext,
        isActiveContext,
      }}
    >
      {children}
    </ContextsContext.Provider>
  );
};

export function useContextsContext(): ContextsContextType {
  const context = useContext(ContextsContext);
  if (!context) {
    throw new Error('useContextsContext must be used within a ContextsProvider');
  }
  return context;
}
