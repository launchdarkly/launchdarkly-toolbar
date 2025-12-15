import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { loadContexts, saveContexts, loadActiveContext, saveActiveContext } from '../../utils/localStorage';
import { Context } from '../../types/ldApi';
import { usePlugins } from '../state/PluginsProvider';
import { extractContextInfo } from '../../utils/context';
import { useAnalytics } from '../telemetry/AnalyticsProvider';
import type { LDContext } from 'launchdarkly-js-client-sdk';

interface ContextsContextType {
  contexts: Context[];
  filter: string;
  setFilter: (filter: string) => void;
  addContext: (context: Context) => void;
  removeContext: (kind: string, key: string) => void;
  updateContext: (oldKind: string, oldKey: string, newContext: Context) => void;
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
        // Check if context already exists (by kind and key)
        const exists = prev.some((c) => c.kind === context.kind && c.key === context.key);
        if (exists) {
          return prev; // Don't add duplicates
        }
        const updated = [...prev, context];
        saveContexts(updated);

        // Track analytics
        const isMultiKind = context.kind === 'multi';
        const contextKey = isMultiKind ? context.name || 'multi-kind' : context.key || '';
        analytics.trackContextAdded(context.kind, contextKey, isMultiKind);

        return updated;
      });
    },
    [analytics],
  );

  // Remove a context from the list
  const removeContext = useCallback(
    (kind: string, key: string) => {
      // Prevent deletion of active context
      if (activeContext?.kind === kind && activeContext?.key === key) {
        console.warn('Cannot delete active context');
        return;
      }

      setStoredContexts((prev) => {
        const updated = prev.filter((c) => !(c.kind === kind && c.key === key));
        saveContexts(updated);

        // Track analytics
        analytics.trackContextRemoved(kind, key);

        return updated;
      });
    },
    [activeContext, analytics],
  );

  // Update a context in the list
  const updateContext = useCallback(
    (oldKind: string, oldKey: string, newContext: Context) => {
      setStoredContexts((prev) => {
        const updated = prev.map((c) => {
          if (c.kind === oldKind && c.key === oldKey) {
            return newContext;
          }
          return c;
        });
        saveContexts(updated);
        return updated;
      });

      // If the updated context is the active context, update it
      if (activeContext?.kind === oldKind && activeContext?.key === oldKey) {
        setActiveContext(newContext);
        saveActiveContext(newContext);
      }

      // Track analytics
      const newKey = newContext.key || newContext.name || '';
      analytics.trackContextUpdated(oldKind, oldKey, newContext.kind, newKey);
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
      const contextExists = storedContexts.some(
        (c) => c.kind === savedActiveContext.kind && c.key === savedActiveContext.key,
      );

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
          // Find matching context in stored contexts
          const matchingContext = storedContexts.find(
            (c) => c.kind === currentContext.kind && c.key === currentContext.key,
          );

          if (matchingContext) {
            // Update active context if it's different
            const isDifferent =
              !activeContext ||
              activeContext.kind !== matchingContext.kind ||
              activeContext.key !== matchingContext.key;

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
      const aIsActive =
        activeContext?.kind === a.kind && activeContext?.key === a.key && activeContext?.name === a.name;
      const bIsActive =
        activeContext?.kind === b.kind && activeContext?.key === b.key && activeContext?.name === b.name;
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
