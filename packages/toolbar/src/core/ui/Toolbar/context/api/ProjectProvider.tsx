import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiProvider';
import { TOOLBAR_STORAGE_KEYS } from '../../utils/localStorage';
import { ApiProject, ProjectsResponse, ApiEnvironment } from '../../types/ldApi';
import { useAuthContext } from './AuthProvider';

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
  const [projectKey, setProjectKeyState] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [environments, setEnvironments] = useState<ApiEnvironment[]>([]);

  // Wrapper function to update project and save to localStorage
  const setProjectKey = useCallback((key: string) => {
    setProjectKeyState(key);
    localStorage.setItem(STORAGE_KEY, key);
  }, []);

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

    const environments = projects.find((project) => project.key === projectKey)?.environments;
    if (environments) {
      setEnvironments(environments);
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
    const savedProjectKey = localStorage.getItem(STORAGE_KEY);

    if (savedProjectKey) {
      // Load from localStorage without triggering a save
      setProjectKeyState(savedProjectKey);
    } else if (providedProjectKey) {
      // Use provided project key and save it
      setProjectKey(providedProjectKey);
    } else if (apiReady) {
      setLoading(true);

      getProjects()
        .then((projects) => {
          if (!projects || projects.items?.length === 0) {
            throw new Error('No projects found');
          }

          let project = projects.items[0];
          let environments: ApiEnvironment[] = [];

          if (clientSideId) {
            project = projects.items.find((project) =>
              project.environments.some((environment) => environment._id === clientSideId),
            );

            if (!project) {
              throw new Error(`No project found for clientSideId: ${clientSideId}`);
            }

            environments = project.environments;
          }

          if (!project) {
            throw new Error('No project found');
          }

          setProjectKey(project.key);
          setEnvironments(environments);
          setLoading(false);
          localStorage.setItem(STORAGE_KEY, project.key);
        })
        .catch((error) => {
          console.error('Error loading project:', error);
          setLoading(false);
          // Don't crash - just leave project unselected
        });
    } else {
      setLoading(false);
    }
  }, [providedProjectKey, clientSideId, getProjects, apiReady, setProjectKey]);

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
