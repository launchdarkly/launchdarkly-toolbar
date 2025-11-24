import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { DevServerClient } from '../../../services/DevServerClient';
import { FlagStateManager } from '../../../services/FlagStateManager';
import { LdToolbarConfig, ToolbarState } from '../../../types/devServer';
import { useFlagsContext } from './FlagsProvider';
import { useProjectContext } from './ProjectProvider';

interface DevServerContextValue {
  state: ToolbarState;
  setOverride: (flagKey: string, value: any) => Promise<void>;
  clearOverride: (flagKey: string) => Promise<void>;
  clearAllOverrides: () => Promise<void>;
  refresh: () => Promise<void>;
}

const DevServerContext = createContext<DevServerContextValue | null>(null);

export const useDevServerContext = () => {
  const context = useContext(DevServerContext);
  if (!context) {
    throw new Error('useDevServerContext must be used within DevServerProvider');
  }
  return context;
};

export interface DevServerProviderProps {
  children: ReactNode;
  config: LdToolbarConfig;
}

export const DevServerProvider: FC<DevServerProviderProps> = ({ children, config }) => {
  const { getProjectFlags } = useFlagsContext();
  const { projectKey, getProjects } = useProjectContext();

  const [toolbarState, setToolbarState] = useState<ToolbarState>(() => {
    return {
      flags: {},
      connectionStatus: 'disconnected',
      lastSyncTime: 0,
      isLoading: true,
      error: null,
      sourceEnvironmentKey: null,
    };
  });

  // Track the last sync timestamp from dev server to detect changes
  const [lastDevServerSync, setLastDevServerSync] = useState<number>(0);

  const devServerClient = useMemo(() => {
    // Only create devServerClient if devServerUrl is provided (dev-server mode)
    if (config.devServerUrl) {
      return new DevServerClient(config.devServerUrl, projectKey);
    }
    return null;
  }, [config.devServerUrl, projectKey]);

  const flagStateManager = useMemo(() => {
    // Only create flagStateManager if we have a devServerClient
    if (devServerClient) {
      return new FlagStateManager(devServerClient);
    }
    return null;
  }, [devServerClient]);

  // Helper: Extract error message from unknown error
  const getErrorMessage = useCallback((error: unknown): string => {
    return error instanceof Error ? error.message : 'Unknown error';
  }, []);

  // Helper: Handle errors by updating state and calling config callback
  const handleError = useCallback(
    (error: unknown, updateConnectionStatus = true) => {
      const errorMessage = getErrorMessage(error);
      config.onError?.(errorMessage);
      setToolbarState((prev) => ({
        ...prev,
        ...(updateConnectionStatus && { connectionStatus: 'error' as const }),
        error: errorMessage,
        isLoading: false,
      }));
    },
    [config, getErrorMessage],
  );

  // Helper: Check if flagStateManager is available, handle error if not
  const ensureFlagStateManager = useCallback((): boolean => {
    if (!flagStateManager) {
      handleError(new Error('Flag state manager not available - not in dev-server mode'), false);
      return false;
    }
    return true;
  }, [flagStateManager, handleError]);

  // Helper: Load and sync flags from dev server and API
  // Only fetches from API if dev server data has changed (based on _lastSyncedFromSource timestamp)
  // Set forceApiRefresh=true to always fetch from API (useful for manual refresh)
  const syncFlags = useCallback(
    async (forceApiRefresh = false) => {
      if (!devServerClient || !flagStateManager || !projectKey) {
        throw new Error('Dev server client, flag state manager, or project key not available');
      }

      // Always fetch dev server data (lightweight, local)
      const projectData = await devServerClient.getProjectData();

      // Check if dev server data has changed since last sync
      const devServerDataChanged = projectData._lastSyncedFromSource !== lastDevServerSync;

      // Only fetch API flags if:
      // 1. This is the first sync (lastDevServerSync === 0), OR
      // 2. Dev server data has changed (_lastSyncedFromSource timestamp changed), OR
      // 3. Force refresh is requested (manual refresh)
      if (forceApiRefresh || lastDevServerSync === 0 || devServerDataChanged) {
        const apiFlags = await getProjectFlags(projectKey);
        flagStateManager.setApiFlags(apiFlags.items);
        setLastDevServerSync(projectData._lastSyncedFromSource);
      }

      // Always update flags from dev server (includes overrides)
      const flags = await flagStateManager.getEnhancedFlags();

      setToolbarState((prev) => ({
        ...prev,
        connectionStatus: 'connected',
        flags,
        sourceEnvironmentKey: projectData.sourceEnvironmentKey,
        lastSyncTime: Date.now(),
        error: null,
        isLoading: false,
      }));
    },
    [devServerClient, flagStateManager, projectKey, getProjectFlags, lastDevServerSync],
  );

  const initializeProjectSelection = useCallback(async () => {
    // Only initialize project selection in dev-server mode
    if (!devServerClient) {
      throw new Error('DevServerClient not available - not in dev-server mode');
    }

    // Get available projects
    await getProjects();
  }, [devServerClient, projectKey, getProjects]);

  useEffect(() => {
    const setupProjectConnection = async () => {
      // Skip setup if not in dev-server mode
      if (!config.devServerUrl) {
        setToolbarState((prev) => ({
          ...prev,
          connectionStatus: 'disconnected',
          isLoading: false,
          error: null,
        }));
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true, error: null }));
        await initializeProjectSelection();
        setToolbarState((prev) => ({
          ...prev,
          connectionStatus: 'connected',
        }));
      } catch (error) {
        handleError(error);
      }
    };

    setupProjectConnection();
  }, [config.devServerUrl, projectKey, initializeProjectSelection, handleError]);

  // Load project data after project is set
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectKey || toolbarState.connectionStatus !== 'connected' || !devServerClient || !flagStateManager) {
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true }));
        await syncFlags();
      } catch (error) {
        handleError(error);
      }
    };

    loadProjectData();
  }, [toolbarState.connectionStatus, devServerClient, flagStateManager, projectKey, syncFlags, handleError]);

  // Setup real-time updates
  useEffect(() => {
    if (toolbarState.connectionStatus !== 'connected' || !flagStateManager) {
      return;
    }

    const unsubscribe = flagStateManager.subscribe((flags) => {
      setToolbarState((prev) => ({
        ...prev,
        flags,
        lastSyncTime: Date.now(),
      }));
    });

    return unsubscribe;
  }, [flagStateManager, toolbarState.connectionStatus]);

  // Setup polling - includes automatic recovery from connection failures
  useEffect(() => {
    // Skip polling if not in dev-server mode
    if (!config.devServerUrl || !devServerClient || !flagStateManager) {
      return;
    }

    const pollInterval = config.pollIntervalInMs;

    const checkConnectionAndRecover = async () => {
      try {
        // If no project key is set (initial connection failed), attempt recovery
        if (!projectKey) {
          await initializeProjectSelection();
        }

        // syncFlags will handle fetching API flags only if dev server data changed
        await syncFlags();
      } catch (error) {
        handleError(error);
      }
    };

    const interval = setInterval(checkConnectionAndRecover, pollInterval);
    return () => clearInterval(interval);
  }, [
    devServerClient,
    flagStateManager,
    config.pollIntervalInMs,
    config.devServerUrl,
    projectKey,
    initializeProjectSelection,
    getProjectFlags,
    syncFlags,
    handleError,
  ]);

  const setOverride = useCallback(
    async (flagKey: string, value: any) => {
      if (!ensureFlagStateManager()) {
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true }));
        await flagStateManager!.setOverride(flagKey, value);
        config.onDebugOverride?.(flagKey, value, true);
      } catch (error) {
        handleError(error, false);
      } finally {
        setToolbarState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [flagStateManager, config, ensureFlagStateManager, handleError],
  );

  const clearOverride = useCallback(
    async (flagKey: string) => {
      if (!ensureFlagStateManager()) {
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true }));
        await flagStateManager!.clearOverride(flagKey);
        config.onDebugOverride?.(flagKey, null, false);
      } catch (error) {
        handleError(error, false);
      } finally {
        setToolbarState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [flagStateManager, config, ensureFlagStateManager, handleError],
  );

  const clearAllOverrides = useCallback(async () => {
    if (!ensureFlagStateManager()) {
      return;
    }

    try {
      setToolbarState((prev) => ({ ...prev, isLoading: true }));

      const overriddenFlags = Object.entries(toolbarState.flags).filter(([_, flag]) => flag.isOverridden);

      await Promise.all(overriddenFlags.map(([flagKey]) => flagStateManager!.clearOverride(flagKey)));

      overriddenFlags.forEach(([flagKey]) => {
        config.onDebugOverride?.(flagKey, null, false);
      });
    } catch (error) {
      handleError(error, false);
    } finally {
      setToolbarState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [flagStateManager, config, toolbarState.flags, ensureFlagStateManager, handleError]);

  const refresh = useCallback(async () => {
    // If no project is selected, or the connection is not established, do not refresh
    // This helps prevent unhelpful errors from being shown to the user
    if (!projectKey || toolbarState.connectionStatus !== 'connected' || !devServerClient || !flagStateManager) {
      return;
    }

    try {
      setToolbarState((prev) => ({ ...prev, isLoading: true }));
      // Force API refresh on manual refresh
      await syncFlags(true);
    } catch (error) {
      handleError(error);
    }
  }, [projectKey, toolbarState.connectionStatus, devServerClient, flagStateManager, syncFlags, handleError]);

  const value = useMemo(
    () => ({
      state: toolbarState,
      setOverride,
      clearOverride,
      clearAllOverrides,
      refresh,
    }),
    [toolbarState, setOverride, clearOverride, clearAllOverrides, refresh],
  );

  return <DevServerContext.Provider value={value}>{children}</DevServerContext.Provider>;
};
