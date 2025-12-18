import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { LDContext } from 'launchdarkly-js-client-sdk';
import { loadContexts, saveContexts, loadActiveContext, saveActiveContext } from '../../utils/localStorage';
import { usePlugins } from '../state/PluginsProvider';
import {
  areContextsEqual,
  generateContextId,
  getContextDisplayName,
  getContextKey,
  getContextKind,
} from '../../utils/context';
import { useAnalytics } from '../telemetry/AnalyticsProvider';

interface ContextsContextType {
  contexts: LDContext[];
  filter: string;
  setFilter: (filter: string) => void;
  addContext: (context: LDContext) => void;
  removeContext: (contextId: string) => void;
  updateContext: (contextId: string, newContext: LDContext) => void;
  setContext: (context: LDContext) => Promise<void>;
  activeContext: LDContext | null;
  isAddFormOpen: boolean;
  setIsAddFormOpen: (isOpen: boolean) => void;
  clearContexts: () => void;
}

const ContextsContext = createContext<ContextsContextType | undefined>(undefined);

export const ContextsProvider = ({ children }: { children: React.ReactNode }) => {
  const { flagOverridePlugin, eventInterceptionPlugin } = usePlugins();
  const analytics = useAnalytics();
  const [storedContexts, setStoredContexts] = useState<LDContext[]>(loadContexts);
  const [activeContext, setActiveContext] = useState<LDContext | null>(loadActiveContext());
  const [filter, setFilter] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const lastAddedContextRef = useRef<string | null>(null);
  const hasRestoredContextRef = useRef(false);
  // Track when we're setting context ourselves to avoid the change handler overriding our selection
  const isSettingContextRef = useRef(false);

  // Get the LD client from plugins
  const ldClient = flagOverridePlugin?.getClient() ?? eventInterceptionPlugin?.getClient() ?? null;

  // Add a new context to the list
  const addContext = useCallback(
    (context: LDContext) => {
      setStoredContexts((prev) => {
        const contextId = generateContextId(context);

        // Check if context already exists using hash comparison
        const exists = prev.some((c) => generateContextId(c) === contextId);
        if (exists) {
          return prev; // Don't add duplicates
        }
        const updated = [...prev, context];
        saveContexts(updated);

        // Track analytics
        const kind = getContextKind(context);
        const isMultiKind = kind === 'multi';
        const contextKey = getContextKey(context) || getContextDisplayName(context);
        analytics.trackContextAdded(kind, contextKey, isMultiKind);

        return updated;
      });
    },
    [analytics],
  );

  // Remove a context from the list (contextId is the hash from generateContextId)
  const removeContext = useCallback(
    (contextId: string) => {
      // Prevent deletion of active context
      const activeContextId = generateContextId(activeContext);
      if (activeContext && activeContextId === contextId) {
        console.warn('Cannot delete active context');
        return;
      }

      setStoredContexts((prev) => {
        const contextToRemove = prev.find((c) => generateContextId(c) === contextId);
        const updated = prev.filter((c) => generateContextId(c) !== contextId);
        saveContexts(updated);

        // Track analytics
        if (contextToRemove) {
          const kind = getContextKind(contextToRemove);
          const key = getContextKey(contextToRemove);
          analytics.trackContextRemoved(kind, key);
        }

        return updated;
      });
    },
    [activeContext, analytics],
  );

  // Update a context in the list (contextId is the hash from generateContextId)
  const updateContext = useCallback(
    (contextId: string, newContext: LDContext) => {
      setStoredContexts((prev) => {
        const oldContext = prev.find((c) => generateContextId(c) === contextId);
        const updated = prev.map((c) => {
          if (generateContextId(c) === contextId) {
            return newContext;
          }
          return c;
        });
        saveContexts(updated);

        // If the updated context is the active context, update it
        const activeContextId = generateContextId(activeContext);
        if (activeContext && activeContextId === contextId) {
          setActiveContext(newContext);
          saveActiveContext(newContext);
        }

        // Track analytics
        if (oldContext) {
          const oldKind = getContextKind(oldContext);
          const newKind = getContextKind(newContext);
          const oldKey = getContextKey(oldContext) || getContextDisplayName(oldContext);
          const newKey = getContextKey(newContext) || getContextDisplayName(newContext);
          analytics.trackContextUpdated(oldKind, oldKey, newKind, newKey);
        }

        return updated;
      });
    },
    [activeContext, analytics],
  );

  // Set the current context and update the host application's LD Client via identify
  const setContext = useCallback(
    async (context: LDContext) => {
      if (!ldClient) {
        console.warn('LD Client not available. Cannot set context.');
        return;
      }

      try {
        // Mark that we're setting context ourselves so the change handler doesn't interfere
        isSettingContextRef.current = true;

        // Skip if the context is already active (using hash comparison)
        if (areContextsEqual(activeContext, context)) {
          isSettingContextRef.current = false;
          return;
        }

        await ldClient.identify(context);

        setActiveContext(context);
        saveActiveContext(context);

        // Track analytics
        const kind = getContextKind(context);
        const contextKey = getContextKey(context) || getContextDisplayName(context);
        analytics.trackContextSelected(kind, contextKey);
      } catch (error) {
        console.error('Failed to identify context:', error);
        throw error;
      } finally {
        // Clear the flag after a short delay to let the change event settle
        setTimeout(() => {
          isSettingContextRef.current = false;
        }, 100);
      }
    },
    [ldClient, analytics, activeContext],
  );

  // Restore saved active context on mount when LD client is available
  useEffect(() => {
    if (!ldClient || hasRestoredContextRef.current) {
      return;
    }

    hasRestoredContextRef.current = true;

    const savedActiveContext = loadActiveContext();
    if (savedActiveContext) {
      // Verify the saved context still exists in the stored contexts using hash comparison
      const savedContextId = generateContextId(savedActiveContext);
      const contextExists = storedContexts.some((c) => generateContextId(c) === savedContextId);

      if (contextExists) {
        // Restore the context by directly calling identify
        // We bypass setContext because the state is already initialized from localStorage
        // and setContext would skip the identify call due to equality check
        isSettingContextRef.current = true;
        ldClient
          .identify(savedActiveContext)
          .then(() => {
            // Ensure state is in sync (it should already be from useState initialization)
            setActiveContext(savedActiveContext);
          })
          .catch((error) => {
            console.error('Failed to restore saved active context:', error);
            // Clear invalid saved context
            setActiveContext(null);
            saveActiveContext(null);
          })
          .finally(() => {
            setTimeout(() => {
              isSettingContextRef.current = false;
            }, 100);
          });
      } else {
        // Saved context no longer exists, clear it
        setActiveContext(null);
        saveActiveContext(null);
      }
    }
  }, [ldClient, storedContexts]);

  // Listen to LD client context changes and sync active context
  // This handles external context changes (e.g., from the host application)
  useEffect(() => {
    if (!ldClient) {
      return;
    }

    const handleContextChange = () => {
      // Skip if we're in the middle of setting context ourselves
      // This prevents the change handler from overriding our selection
      if (isSettingContextRef.current) {
        return;
      }

      try {
        const currentLdContext = ldClient.getContext();

        if (currentLdContext) {
          const currentContextId = generateContextId(currentLdContext);

          // Find matching context in stored contexts using hash comparison
          const matchingContext = storedContexts.find((c) => generateContextId(c) === currentContextId);

          if (matchingContext) {
            // Update active context if it's different
            const activeContextId = generateContextId(activeContext);
            const isDifferent = !activeContext || activeContextId !== currentContextId;

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

    if (!context) {
      return;
    }

    // Create a unique identifier for this context
    const contextId = generateContextId(context);

    // Skip if we've already processed this context
    if (lastAddedContextRef.current === contextId) {
      return;
    }

    // Use functional update to check current state and add if needed
    setStoredContexts((prev) => {
      // Check if context already exists in stored contexts using hash comparison
      const exists = prev.some((c) => generateContextId(c) === contextId);

      if (exists) {
        // Track that we've seen this context (even if it already existed)
        lastAddedContextRef.current = contextId;
        return prev;
      }

      // Add the LDContext directly
      const updated = [...prev, context];
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
        const key = getContextKey(ctx);
        const kind = getContextKind(ctx);
        const displayName = getContextDisplayName(ctx);
        const matchesKey = key.toLowerCase().includes(filterLower);
        const matchesKind = kind.toLowerCase().includes(filterLower);
        const matchesName = displayName.toLowerCase().includes(filterLower);
        return matchesKey || matchesKind || matchesName;
      });
    }

    // Sort to put active context first
    const activeContextId = generateContextId(activeContext);
    return filtered.sort((a, b) => {
      const aIsActive = activeContext && generateContextId(a) === activeContextId;
      const bIsActive = activeContext && generateContextId(b) === activeContextId;
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      return 0;
    });
  }, [storedContexts, filter, activeContext]);

  const clearContexts = useCallback(() => {
    if (!activeContext) {
      return;
    }

    setStoredContexts([activeContext]);
    saveContexts([activeContext]);
  }, []);

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
        clearContexts,
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
