import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiProvider';
import { TOOLBAR_STORAGE_KEYS } from '../utils/localStorage';
import { ApiProject, ProjectsResponse } from '../types/ldApi';

const STORAGE_KEY = TOOLBAR_STORAGE_KEYS.PROJECT;

type ProjectContextType = {
  projectKey: string;
  setProjectKey: (projectKey: string) => void;
  getProjects: () => Promise<ProjectsResponse>;
  projects: ApiProject[];
  loading: boolean;
};

const ProjectContext = createContext<ProjectContextType>({
  projectKey: '',
  setProjectKey: () => {},
  getProjects: async () => ({ items: [] }),
  projects: [],
  loading: false,
});

interface ProjectProviderProps {
  children: React.ReactNode;
  clientSideId?: string; // Optional - either clientSideId or projectKey must be provided to make requests to the LaunchDarkly API
  providedProjectKey?: string;
}

export const ProjectProvider = ({ children, clientSideId, providedProjectKey }: ProjectProviderProps) => {
  const { getProjects: getApiProjects, apiReady } = useApi();
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [projectKey, setProjectKeyState] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Wrapper function to update project and save to localStorage
  const setProjectKey = useCallback((key: string) => {
    setProjectKeyState(key);
    localStorage.setItem(STORAGE_KEY, key);
  }, []);

  const getProjects = useCallback(async () => {
    if (!apiReady) {
      return { items: [] };
    }

    return await getApiProjects();
  }, [apiReady, getApiProjects]);

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

          if (clientSideId) {
            project = projects.items.find((project) =>
              project.environments.some((environment) => environment._id === clientSideId),
            );

            if (!project) {
              throw new Error(`No project found for clientSideId: ${clientSideId}`);
            }
          }

          if (!project) {
            throw new Error('No project found');
          }

          setProjectKey(project.key);
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
  }, [providedProjectKey, clientSideId, getProjects, apiReady, setProjectKey]);

  return (
    <ProjectContext.Provider value={{ projectKey, setProjectKey, getProjects, projects, loading }}>
      {children}
    </ProjectContext.Provider>
  );
};

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}
