import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiProvider';
import { TOOLBAR_STORAGE_KEYS } from '../utils/localStorage';
import { ApiEnvironment, ApiProject, ProjectsResponse } from '../types/ldApi';

const STORAGE_KEY = TOOLBAR_STORAGE_KEYS.PROJECT;

type ProjectContextType = {
  projectKey: string;
  setProjectKey: (projectKey: string) => void;
  getProjects: () => Promise<ProjectsResponse>;
  projects: ApiProject[];
  environments: ApiEnvironment[];
  loading: boolean;
};

const ProjectContext = createContext<ProjectContextType>({
  projectKey: '',
  setProjectKey: () => {},
  getProjects: async () => ({ items: [] }),
  projects: [],
  environments: [],
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
  const [projectKey, setProjectKey] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [environments, setEnvironments] = useState<ApiEnvironment[]>([]);

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
    if (!projects || projects.length === 0) {
      return;
    }

    const environments = projects.find((project) => project.key === projectKey)?.environments;
    if (environments) {
      console.log('environments', environments);
      setEnvironments(environments);
    }
  }, [projects, projectKey]);

  useEffect(() => {
    const savedProjectKey = localStorage.getItem(STORAGE_KEY);

    if (savedProjectKey) {
      setProjectKey(savedProjectKey);
    } else if (providedProjectKey) {
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
          localStorage.setItem(STORAGE_KEY, project.key);
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
  }, [providedProjectKey, clientSideId, getProjects, apiReady]);

  return (
    <ProjectContext.Provider value={{ projectKey, setProjectKey, getProjects, projects, environments, loading }}>
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
