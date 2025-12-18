import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useApi } from './ApiProvider';
import { TOOLBAR_STORAGE_KEYS } from '../../utils/localStorage';
import { ApiProject, ProjectsResponse, ApiEnvironment } from '../../types/ldApi';
import { useAuthContext } from './AuthProvider';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const STORAGE_KEY = TOOLBAR_STORAGE_KEYS.PROJECT;

interface ProjectContextType {
  projectKey: string;
  setProjectKey: (projectKey: string) => void;
  getProjects: () => Promise<ProjectsResponse>;
  projects: ApiProject[];
  environments: ApiEnvironment[];
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

interface ProjectProviderProps {
  children: React.ReactNode;
  clientSideId?: string; // Optional - either clientSideId or projectKey must be provided to make requests to the LaunchDarkly API
  providedProjectKey?: string;
}

export const ProjectProvider = ({ children, clientSideId, providedProjectKey }: ProjectProviderProps) => {
  const { authenticated } = useAuthContext();
  const { getProjects: getApiProjects, apiReady } = useApi();
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [projectKey, setProjectKey] = useLocalStorage(STORAGE_KEY, '', {
    serialize: (v) => v,
    deserialize: (v) => v,
  });
  const [loading, setLoading] = useState(false);
  const [environments, setEnvironments] = useState<ApiEnvironment[]>([]);
  const hasInitialized = useRef(false);

  const getProjects = useCallback(async () => {
    if (!apiReady || !authenticated) {
      return { items: [] };
    }

    return await getApiProjects();
  }, [apiReady, authenticated, getApiProjects]);

  useEffect(() => {
    if (!projects || projects.length === 0) {
      return;
    }

    const envs = projects.find((project) => project.key === projectKey)?.environments;
    if (envs) {
      setEnvironments(envs);
    }
  }, [projects, projectKey]);

  useEffect(() => {
    let isMounted = true;

    if (apiReady) {
      setLoading(true);
      getProjects().then((projects) => {
        if (isMounted) {
          setProjects(projects.items);
          setLoading(false);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [apiReady, getProjects]);

  useEffect(() => {
    if (hasInitialized.current) return;

    const hasSavedProjectKey =
      typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) !== null && projectKey !== '';

    if (hasSavedProjectKey) {
      // Already loaded from localStorage via hook
      hasInitialized.current = true;
    } else if (providedProjectKey) {
      // Use provided project key
      hasInitialized.current = true;
      setProjectKey(providedProjectKey);
    } else if (apiReady) {
      setLoading(true);

      getProjects()
        .then((projects) => {
          if (!projects || projects.items?.length === 0) {
            throw new Error('No projects found');
          }

          let project: ApiProject | undefined = projects.items[0];
          let envs: ApiEnvironment[] = [];

          if (clientSideId) {
            project = projects.items.find((proj) =>
              proj.environments.some((environment) => environment._id === clientSideId),
            );

            if (!project) {
              throw new Error(`No project found for clientSideId: ${clientSideId}`);
            }

            envs = project.environments;
          }

          if (!project) {
            throw new Error('No project found');
          }

          hasInitialized.current = true;
          setProjectKey(project.key);
          setEnvironments(envs);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error loading project:', error);
          setLoading(false);
          // Don't crash - just leave project unselected
        });
    } else {
      setLoading(false);
    }
  }, [providedProjectKey, clientSideId, getProjects, apiReady, setProjectKey, projectKey]);

  return (
    <ProjectContext.Provider value={{ projectKey, setProjectKey, getProjects, projects, environments, loading }}>
      {children}
    </ProjectContext.Provider>
  );
};

export function useProjectContext(): ProjectContextType {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}
