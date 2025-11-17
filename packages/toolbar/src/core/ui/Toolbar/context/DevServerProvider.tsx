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
  const { getProjectFlags, flags: apiFlags } = useFlagsContext();
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setToolbarState((prev) => ({
          ...prev,
          connectionStatus: 'error',
          error: errorMessage,
          isLoading: false,
        }));
      }
    };

    setupProjectConnection();
  }, [config.devServerUrl, projectKey]);

  // Load project data after project is set
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectKey || toolbarState.connectionStatus !== 'connected' || !devServerClient || !flagStateManager) {
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true }));
        const projectData = await devServerClient.getProjectData();
        const apiFlags = await getProjectFlags(projectKey);
        const flags = await flagStateManager.getEnhancedFlags(apiFlags);

        setToolbarState((prev) => ({
          ...prev,
          flags,
          sourceEnvironmentKey: projectData.sourceEnvironmentKey,
          lastSyncTime: Date.now(),
          error: null,
          isLoading: false,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setToolbarState((prev) => ({
          ...prev,
          connectionStatus: 'error',
          error: errorMessage,
          isLoading: false,
        }));
      }
    };

    loadProjectData();
  }, [toolbarState.connectionStatus, devServerClient, flagStateManager, projectKey]);

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
        let initialApiFlags = apiFlags;
        // If no project key is set (initial connection failed), attempt recovery
        if (!projectKey) {
          await initializeProjectSelection();
          await getProjectFlags(projectKey);
          initialApiFlags = apiFlags;
        }

        const projectData = await devServerClient.getProjectData();
        const flags = await flagStateManager.getEnhancedFlags(initialApiFlags);
        setToolbarState((prev) => ({
          ...prev,
          connectionStatus: 'connected',
          flags,
          sourceEnvironmentKey: projectData.sourceEnvironmentKey,
          lastSyncTime: Date.now(),
          error: null,
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setToolbarState((prev) => ({
          ...prev,
          connectionStatus: 'error',
          error: errorMessage,
        }));
      }
    };

    const interval = setInterval(checkConnectionAndRecover, pollInterval);
    return () => clearInterval(interval);
  }, [devServerClient, flagStateManager, config.pollIntervalInMs, initializeProjectSelection, config.devServerUrl, projectKey]);

  const setOverride = useCallback(
    async (flagKey: string, value: any) => {
      if (!flagStateManager) {
        const errorMessage = 'Flag state manager not available - not in dev-server mode';
        config.onError?.(errorMessage);
        setToolbarState((prev) => ({ ...prev, error: errorMessage }));
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true }));
        await flagStateManager.setOverride(flagKey, value);
        config.onDebugOverride?.(flagKey, value, true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        config.onError?.(errorMessage);
        setToolbarState((prev) => ({ ...prev, error: errorMessage }));
      } finally {
        setToolbarState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [flagStateManager, config],
  );

  const clearOverride = useCallback(
    async (flagKey: string) => {
      if (!flagStateManager) {
        const errorMessage = 'Flag state manager not available - not in dev-server mode';
        config.onError?.(errorMessage);
        setToolbarState((prev) => ({ ...prev, error: errorMessage }));
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true }));
        await flagStateManager.clearOverride(flagKey);
        config.onDebugOverride?.(flagKey, null, false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        config.onError?.(errorMessage);
        setToolbarState((prev) => ({ ...prev, error: errorMessage }));
      } finally {
        setToolbarState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [flagStateManager, config],
  );

  const clearAllOverrides = useCallback(async () => {
    if (!flagStateManager) {
      const errorMessage = 'Flag state manager not available - not in dev-server mode';
      config.onError?.(errorMessage);
      setToolbarState((prev) => ({ ...prev, error: errorMessage }));
      return;
    }

    try {
      setToolbarState((prev) => ({ ...prev, isLoading: true }));

      const overriddenFlags = Object.entries(toolbarState.flags).filter(([_, flag]) => flag.isOverridden);

      await Promise.all(overriddenFlags.map(([flagKey]) => flagStateManager.clearOverride(flagKey)));

      overriddenFlags.forEach(([flagKey]) => {
        config.onDebugOverride?.(flagKey, null, false);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      config.onError?.(errorMessage);
      setToolbarState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setToolbarState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [flagStateManager, config, toolbarState.flags]);

  const refresh = useCallback(async () => {
    try {
      // If no project is selected, or the connection is not established, do not refresh
      // This helps prevent unhelpful errors from being shown to the user
      if (!projectKey || toolbarState.connectionStatus !== 'connected' || !devServerClient || !flagStateManager) {
        return;
      }
      setToolbarState((prev) => ({ ...prev, isLoading: true }));
      const projectData = await devServerClient.getProjectData();
      const apiFlags = await getProjectFlags(projectKey);
      const flags = await flagStateManager.getEnhancedFlags(apiFlags);
      setToolbarState((prev) => ({
        ...prev,
        connectionStatus: 'connected',
        flags,
        sourceEnvironmentKey: projectData.sourceEnvironmentKey,
        lastSyncTime: Date.now(),
        error: null,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setToolbarState((prev) => ({
        ...prev,
        connectionStatus: 'error',
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [flagStateManager, devServerClient, projectKey, toolbarState.connectionStatus]);

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
