import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadContexts, saveContexts, loadActiveContext, saveActiveContext } from '../../utils/localStorage';
import { Context } from '../../types/ldApi';
import { usePlugins } from '../state/PluginsProvider';
import { extractContextInfo, generateContextId } from '../../utils/context';
import { useAnalytics } from '../telemetry/AnalyticsProvider';
import type { LDContext } from 'launchdarkly-js-client-sdk';

interface ContextsContextType {
  contexts: Context[];
  filter: string;
  setFilter: (filter: string) => void;
  addContext: (context: Context) => void;
  removeContext: (id: string) => void;
  updateContext: (id: string, newContext: Context) => void;
  setContext: (context: Context) => Promise<void>;
  activeContext: Context | null;
  isAddFormOpen: boolean;
  setIsAddFormOpen: (isOpen: boolean) => void;
}

const ContextsContext = createContext<ContextsContextType | undefined>(undefined);

export const ContextsProvider = ({ children }: { children: React.ReactNode }) => {
  const { flagOverridePlugin, eventInterceptionPlugin } = usePlugins();
  const analytics = useAnalytics();
  const [storedContexts, setStoredContexts] = useState<Context[]>(loadContexts);
  const [activeContext, setActiveContext] = useState<Context | null>(loadActiveContext());
  const [filter, setFilter] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const lastAddedContextRef = useRef<string | null>(null);
  const hasRestoredContextRef = useRef(false);

  // Get the LD client from plugins
  const ldClient = flagOverridePlugin?.getClient() ?? eventInterceptionPlugin?.getClient() ?? null;

  // Add a new context to the list
  const addContext = useCallback(
    (context: Context) => {
      setStoredContexts((prev) => {
        // Ensure context has an id
        const contextWithId = context.id ? context : { ...context, id: generateContextId() };

        // Check if context already exists (by id)
        const exists = prev.some((c) => c.id === contextWithId.id);
        if (exists) {
          return prev; // Don't add duplicates
        }
        const updated = [...prev, contextWithId];
        saveContexts(updated);

        // Track analytics
        const isMultiKind = contextWithId.kind === 'multi';
        const contextKey = isMultiKind ? contextWithId.name || 'multi-kind' : contextWithId.key || '';
        analytics.trackContextAdded(contextWithId.kind, contextKey, isMultiKind);

        return updated;
      });
    },
    [analytics],
  );

  // Remove a context from the list
  const removeContext = useCallback(
    (id: string) => {
      // Prevent deletion of active context
      if (activeContext?.id === id) {
        console.warn('Cannot delete active context');
        return;
      }

      setStoredContexts((prev) => {
        const contextToRemove = prev.find((c) => c.id === id);
        const updated = prev.filter((c) => c.id !== id);
        saveContexts(updated);

        // Track analytics
        if (contextToRemove) {
          analytics.trackContextRemoved(contextToRemove.kind, contextToRemove.key ?? '');
        }

        return updated;
      });
    },
    [activeContext, analytics],
  );

  // Update a context in the list
  const updateContext = useCallback(
    (id: string, newContext: Context) => {
      setStoredContexts((prev) => {
        const oldContext = prev.find((c) => c.id === id);
        const updated = prev.map((c) => {
          if (c.id === id) {
            // Preserve the id when updating
            return { ...newContext, id };
          }
          return c;
        });
        saveContexts(updated);

        // If the updated context is the active context, update it
        if (activeContext?.id === id) {
          const updatedActiveContext = { ...newContext, id };
          setActiveContext(updatedActiveContext);
          saveActiveContext(updatedActiveContext);
        }

        // Track analytics
        if (oldContext) {
          const oldKey = oldContext.key || oldContext.name || '';
          const newKey = newContext.key || newContext.name || '';
          analytics.trackContextUpdated(oldContext.kind, oldKey, newContext.kind, newKey);
        }

        return updated;
      });
    },
    [activeContext, analytics],
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

        setActiveContext(context);
        saveActiveContext(context);
        await ldClient.identify(ldContext);

        // Track analytics
        const contextKey = context.kind === 'multi' ? context.name || 'multi-kind' : context.key || '';
        analytics.trackContextSelected(context.kind, contextKey);
      } catch (error) {
        console.error('Failed to identify context:', error);
        throw error;
      }
    },
    [ldClient, analytics],
  );

  // Restore saved active context on mount when LD client is available
  useEffect(() => {
    if (!ldClient || hasRestoredContextRef.current) {
      return;
    }

    const savedActiveContext = loadActiveContext();
    if (savedActiveContext) {
      // Verify the saved context still exists in the stored contexts
      const contextExists = storedContexts.some((c) => c.id === savedActiveContext.id);

      if (contextExists) {
        // Set the context asynchronously to avoid blocking render
        setContext(savedActiveContext).catch((error) => {
          console.error('Failed to restore saved active context:', error);
          // Clear invalid saved context
          setActiveContext(null);
          saveActiveContext(null);
        });
        hasRestoredContextRef.current = true;
      } else {
        // Saved context no longer exists, clear it
        setActiveContext(null);
        saveActiveContext(null);
        hasRestoredContextRef.current = true;
      }
    } else {
      hasRestoredContextRef.current = true;
    }
  }, [ldClient, storedContexts, setContext]);

  // Listen to LD client context changes and sync active context
  useEffect(() => {
    if (!ldClient) {
      return;
    }

    const handleContextChange = () => {
      try {
        const currentLdContext = ldClient.getContext();
        const currentContext = extractContextInfo(currentLdContext);

        if (currentContext) {
          // Find matching context in stored contexts by kind and key
          // (since currentContext from SDK doesn't have our id)
          const matchingContext = storedContexts.find(
            (c) => c.kind === currentContext.kind && c.key === currentContext.key,
          );

          if (matchingContext) {
            // Update active context if it's different
            const isDifferent = !activeContext || activeContext.id !== matchingContext.id;

            if (isDifferent) {
              setActiveContext(matchingContext);
              saveActiveContext(matchingContext);
            }
          } else {
            // Context changed to something not in our list, clear active context
            if (activeContext) {
              setActiveContext(null);
              saveActiveContext(null);
            }
          }
        }
      } catch (error) {
        console.error('Error syncing active context from LD client:', error);
      }
    };

    // Listen to changes (context changes happen on identify)
    ldClient.on('change', handleContextChange);

    // Also check initial context
    handleContextChange();

    return () => {
      ldClient.off('change', handleContextChange);
    };
  }, [ldClient, storedContexts, activeContext]);

  // Automatically add the current SDK context to the list if it's not already there
  useEffect(() => {
    if (!ldClient) {
      lastAddedContextRef.current = null;
      return;
    }

    const context = ldClient.getContext();

    const currentSdkContext = extractContextInfo(context);

    if (!currentSdkContext) {
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
        id: generateContextId(),
        kind: currentSdkContext.kind,
        key: currentSdkContext.key,
        name: currentSdkContext.name,
        anonymous: currentSdkContext.anonymous,
      };

      const updated = [...prev, apiContext];
      saveContexts(updated);
      // Track that we've added this context
      lastAddedContextRef.current = contextId;
      return updated;
    });
  }, [ldClient]);

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
      const aIsActive = activeContext?.id === a.id;
      const bIsActive = activeContext?.id === b.id;
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      return 0;
    });
  }, [storedContexts, filter, activeContext]);

  return (
    <ContextsContext.Provider
      value={{
        contexts,
        filter,
        setFilter,
        addContext,
        removeContext,
        updateContext,
        setContext,
        activeContext,
        isAddFormOpen,
        setIsAddFormOpen,
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
