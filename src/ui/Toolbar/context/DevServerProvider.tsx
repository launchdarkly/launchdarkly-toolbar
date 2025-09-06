import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { DevServerClient } from '../../../services/DevServerClient';
import { FlagStateManager } from '../../../services/FlagStateManager';
import { LdToolbarConfig, ToolbarState } from '../../../types/devServer';
import { TOOLBAR_STORAGE_KEYS, loadToolbarPosition, saveToolbarPosition } from '../utils/localStorage';
import { ToolbarPosition } from '../types/toolbar';

const STORAGE_KEY = TOOLBAR_STORAGE_KEYS.PROJECT;

interface DevServerContextValue {
  state: ToolbarState & {
    availableProjects: string[];
    currentProjectKey: string | null;
    position: ToolbarPosition;
  };
  setOverride: (flagKey: string, value: any) => Promise<void>;
  clearOverride: (flagKey: string) => Promise<void>;
  clearAllOverrides: () => Promise<void>;
  refresh: () => Promise<void>;
  switchProject: (projectKey: string) => Promise<void>;
  handlePositionChange: (position: ToolbarPosition) => void;
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
  initialPosition?: ToolbarPosition;
}

export const DevServerProvider: FC<DevServerProviderProps> = ({ children, config, initialPosition }) => {
  const [toolbarState, setToolbarState] = useState<
    ToolbarState & {
      availableProjects: string[];
      currentProjectKey: string | null;
      position: ToolbarPosition;
    }
  >(() => {
    const savedPosition = loadToolbarPosition();
    return {
      flags: {},
      connectionStatus: 'disconnected',
      lastSyncTime: 0,
      isLoading: true,
      error: null,
      sourceEnvironmentKey: null,
      availableProjects: [],
      currentProjectKey: null,
      position: savedPosition || initialPosition || 'right',
    };
  });

  const devServerClient = useMemo(() => {
    // Only create devServerClient if devServerUrl is provided (dev-server mode)
    if (config.devServerUrl) {
      return new DevServerClient(config.devServerUrl, config.projectKey);
    }
    return null;
  }, [config.devServerUrl, config.projectKey]);

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
    const availableProjects = await devServerClient.getAvailableProjects();

    if (availableProjects.length === 0) {
      throw new Error('No projects found on dev server');
    }

    // Determine which project to use
    let projectKeyToUse: string;

    // First, check for saved project in localStorage
    const savedProjectKey = localStorage.getItem(STORAGE_KEY);
    if (savedProjectKey && availableProjects.includes(savedProjectKey)) {
      projectKeyToUse = savedProjectKey;
    } else if (config.projectKey) {
      // Use provided project key
      if (!availableProjects.includes(config.projectKey)) {
        throw new Error(
          `Project "${config.projectKey}" not found. Available projects: ${availableProjects.join(', ')}`,
        );
      }
      projectKeyToUse = config.projectKey;
    } else {
      // Auto-detect: use first available project
      projectKeyToUse = availableProjects[0];
    }

    // Save the selected project to localStorage
    localStorage.setItem(STORAGE_KEY, projectKeyToUse);

    // Set the project key in the dev server client
    devServerClient.setProjectKey(projectKeyToUse);

    return { availableProjects, projectKeyToUse };
  }, [devServerClient, config.projectKey]);

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

        const { availableProjects, projectKeyToUse } = await initializeProjectSelection();

        setToolbarState((prev) => ({
          ...prev,
          availableProjects,
          currentProjectKey: projectKeyToUse,
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
  }, [initializeProjectSelection, config.devServerUrl]);

  // Load project data after project is set
  useEffect(() => {
    const loadProjectData = async () => {
      if (
        !toolbarState.currentProjectKey ||
        toolbarState.connectionStatus !== 'connected' ||
        !devServerClient ||
        !flagStateManager
      ) {
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true }));
        const projectData = await devServerClient.getProjectData();
        const flags = await flagStateManager.getEnhancedFlags();
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
  }, [toolbarState.currentProjectKey, toolbarState.connectionStatus, devServerClient, flagStateManager]);

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
        if (!devServerClient.getProjectKey()) {
          const { availableProjects, projectKeyToUse } = await initializeProjectSelection();

          setToolbarState((prev) => ({
            ...prev,
            availableProjects,
            currentProjectKey: projectKeyToUse,
          }));
        }

        const projectData = await devServerClient.getProjectData();
        const flags = await flagStateManager.getEnhancedFlags();
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
  }, [devServerClient, flagStateManager, config.pollIntervalInMs, initializeProjectSelection, config.devServerUrl]);

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
        config.onFlagOverride?.(flagKey, value, true);
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
        config.onFlagOverride?.(flagKey, null, false);
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
        config.onFlagOverride?.(flagKey, null, false);
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
      if (
        !toolbarState.currentProjectKey ||
        toolbarState.connectionStatus !== 'connected' ||
        !devServerClient ||
        !flagStateManager
      ) {
        return;
      }
      setToolbarState((prev) => ({ ...prev, isLoading: true }));
      const projectData = await devServerClient.getProjectData();
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setToolbarState((prev) => ({
        ...prev,
        connectionStatus: 'error',
        error: errorMessage,
        isLoading: false,
      }));
    }
  }, [flagStateManager, devServerClient, toolbarState.currentProjectKey, toolbarState.connectionStatus]);

  const switchProject = useCallback(
    async (projectKey: string) => {
      if (!devServerClient || !flagStateManager) {
        const errorMessage = 'Dev server client and flag state manager not available - not in dev-server mode';
        setToolbarState((prev) => ({
          ...prev,
          connectionStatus: 'error',
          error: errorMessage,
          isLoading: false,
        }));
        return;
      }

      try {
        setToolbarState((prev) => ({ ...prev, isLoading: true }));

        if (!toolbarState.availableProjects.includes(projectKey)) {
          throw new Error(`Project "${projectKey}" not found in available projects`);
        }

        localStorage.setItem(STORAGE_KEY, projectKey);

        devServerClient.setProjectKey(projectKey);

        const projectData = await devServerClient.getProjectData();
        const flags = await flagStateManager.getEnhancedFlags();

        setToolbarState((prev) => ({
          ...prev,
          currentProjectKey: projectKey,
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
    },
    [devServerClient, flagStateManager, toolbarState.availableProjects],
  );

  const handlePositionChange = useCallback((newPosition: ToolbarPosition) => {
    setToolbarState((prev) => ({
      ...prev,
      position: newPosition,
    }));
    saveToolbarPosition(newPosition);
  }, []);

  const value = useMemo(
    () => ({
      state: toolbarState,
      setOverride,
      clearOverride,
      clearAllOverrides,
      refresh,
      switchProject,
      handlePositionChange,
    }),
    [toolbarState, setOverride, clearOverride, clearAllOverrides, refresh, switchProject, handlePositionChange],
  );

  return <DevServerContext.Provider value={value}>{children}</DevServerContext.Provider>;
};
