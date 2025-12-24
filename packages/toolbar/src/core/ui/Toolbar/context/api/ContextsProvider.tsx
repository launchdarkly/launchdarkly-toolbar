import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { LDContext } from '@launchdarkly/js-client-sdk';
import { loadContexts, saveContexts, loadActiveContext, saveActiveContext } from '../../utils/localStorage';
import { usePlugins } from '../state/PluginsProvider';
import { getContextDisplayName, getContextKey, getContextKind, getStableContextId } from '../../utils/context';
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
  const [activeContextId, setActiveContextId] = useState<string | null>(() => {
    const saved = loadActiveContext();
    return saved ? getStableContextId(saved) : null;
  });
  const [filter, setFilter] = useState('');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const lastAddedContextRef = useRef<string | null>(null);
  const hasRestoredContextRef = useRef(false);
  // Track when we're setting context ourselves to avoid the change handler overriding our selection
  const isSettingContextRef = useRef(false);

  // Derive activeContext from storedContexts and activeContextId (using stable ID)
  const activeContext = useMemo(() => {
    if (!activeContextId) return null;
    return storedContexts.find((c) => getStableContextId(c) === activeContextId) ?? null;
  }, [storedContexts, activeContextId]);

  // Get the LD client from plugins
  const ldClient = flagOverridePlugin?.getClient() ?? eventInterceptionPlugin?.getClient() ?? null;

  // Helper: Add or update context in stored contexts (compared by kind+key)
  const addOrUpdateContext = useCallback(
    (context: LDContext) => {
      setStoredContexts((prev) => {
        const stableId = getStableContextId(context);

        // Find existing context by stable ID (kind+key)
        const existingIndex = prev.findIndex((c) => getStableContextId(c) === stableId);

        if (existingIndex >= 0) {
          // Update existing context
          const updated = [...prev];
          updated[existingIndex] = context;
          saveContexts(updated);
          return updated;
        }

        // Add new context
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

  // Add a new context to the list
  const addContext = useCallback(
    (context: LDContext) => {
      const stableId = getStableContextId(context);

      // Check if context already exists using stable ID comparison
      const exists = storedContexts.some((c) => getStableContextId(c) === stableId);
      if (exists) {
        // Don't add duplicates, but update if needed
        addOrUpdateContext(context);
        return;
      }

      addOrUpdateContext(context);
    },
    [storedContexts, addOrUpdateContext],
  );

  // Remove a context from the list (contextId is the stable ID based on kind+key)
  const removeContext = useCallback(
    (contextId: string) => {
      // Prevent deletion of active context
      if (activeContextId === contextId) {
        console.warn('Cannot delete active context');
        return;
      }

      setStoredContexts((prev) => {
        const contextToRemove = prev.find((c) => getStableContextId(c) === contextId);
        const updated = prev.filter((c) => getStableContextId(c) !== contextId);
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
    [activeContextId, analytics],
  );

  // Update a context in the list (contextId is the stable ID based on kind+key)
  const updateContext = useCallback(
    (contextId: string, newContext: LDContext) => {
      // Check if we're updating the active context
      const isUpdatingActiveContext = activeContextId === contextId;

      setStoredContexts((prev) => {
        const oldContext = prev.find((c) => getStableContextId(c) === contextId);
        const updated = prev.map((c) => {
          if (getStableContextId(c) === contextId) {
            return newContext;
          }
          return c;
        });
        saveContexts(updated);

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

      // If updating active context, update the LD client via identify
      // This ensures the SDK is in sync with our edited version
      if (isUpdatingActiveContext && ldClient) {
        isSettingContextRef.current = true;
        ldClient
          .identify(newContext)
          .then(() => {
            saveActiveContext(newContext);
          })
          .catch((error) => {
            console.error('Failed to update active context in LD client:', error);
          })
          .finally(() => {
            setTimeout(() => {
              isSettingContextRef.current = false;
            }, 100);
          });
      } else if (isUpdatingActiveContext) {
        // No LD client available, just save to localStorage
        saveActiveContext(newContext);
      }
    },
    [activeContextId, analytics, ldClient],
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

        const stableId = getStableContextId(context);

        // Skip if the context is already active (using stable ID comparison)
        if (activeContextId === stableId) {
          isSettingContextRef.current = false;
          return;
        }

        await ldClient.identify(context);

        setActiveContextId(stableId);
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
    [ldClient, analytics, activeContextId],
  );

  // Restore saved active context on mount when LD client is available
  useEffect(() => {
    if (!ldClient || hasRestoredContextRef.current) {
      return;
    }

    hasRestoredContextRef.current = true;

    const savedActiveContext = loadActiveContext();
    if (savedActiveContext) {
      // Verify the saved context still exists in the stored contexts using stable ID comparison
      const savedStableId = getStableContextId(savedActiveContext);
      const contextExists = storedContexts.some((c) => getStableContextId(c) === savedStableId);

      if (contextExists) {
        // Restore the context by directly calling identify
        // We bypass setContext because the state is already initialized from localStorage
        // and setContext would skip the identify call due to equality check
        isSettingContextRef.current = true;
        ldClient
          .identify(savedActiveContext)!
          .then(() => {
            // Ensure state is in sync (it should already be from useState initialization)
            setActiveContextId(savedStableId);
          })
          .catch((error) => {
            console.error('Failed to restore saved active context:', error);
            // Clear invalid saved context
            setActiveContextId(null);
            saveActiveContext(null);
          })
          .finally(() => {
            setTimeout(() => {
              isSettingContextRef.current = false;
            }, 100);
          });
      } else {
        // Saved context no longer exists, clear it
        setActiveContextId(null);
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
          const currentStableId = getStableContextId(currentLdContext);

          // Find matching context in stored contexts using stable ID comparison
          const matchingContext = storedContexts.find((c) => getStableContextId(c) === currentStableId);

          if (matchingContext) {
            // Update active context if it's different
            const isDifferent = !activeContextId || activeContextId !== currentStableId;

            if (isDifferent) {
              setActiveContextId(currentStableId);
              saveActiveContext(matchingContext);
            }
          } else {
            // Context changed to something not in our list, add it and make it active
            addOrUpdateContext(currentLdContext);
            setActiveContextId(currentStableId);
            saveActiveContext(currentLdContext);
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
  }, [ldClient, storedContexts, activeContextId, addOrUpdateContext]);

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

    // Create a stable identifier for this context (based on kind+key)
    const stableId = getStableContextId(context);

    // Skip if we've already processed this context
    if (lastAddedContextRef.current === stableId) {
      return;
    }

    // Only ADD if it doesn't exist - don't overwrite existing contexts
    // This preserves user edits to contexts
    const contextExists = storedContexts.some((c) => getStableContextId(c) === stableId);
    if (!contextExists) {
      addOrUpdateContext(context);
    }

    lastAddedContextRef.current = stableId;
  }, [ldClient, addOrUpdateContext, storedContexts]);

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

    // Sort to put active context first (using stable ID)
    return filtered.sort((a, b) => {
      const aIsActive = activeContext && getStableContextId(a) === activeContextId;
      const bIsActive = activeContext && getStableContextId(b) === activeContextId;
      if (aIsActive && !bIsActive) return -1;
      if (!aIsActive && bIsActive) return 1;
      return 0;
    });
  }, [storedContexts, filter, activeContext, activeContextId]);

  const clearContexts = useCallback(() => {
    if (!activeContext) {
      return;
    }

    setStoredContexts([activeContext]);
    saveContexts([activeContext]);
  }, [activeContext]);

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
