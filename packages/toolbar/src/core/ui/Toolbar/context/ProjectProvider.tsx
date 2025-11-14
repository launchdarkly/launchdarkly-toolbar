import { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiProvider';

type ProjectContextType = {
  projectKey: string;
  loading: boolean;
};

const ProjectContext = createContext<ProjectContextType>({
  projectKey: '',
  loading: false,
});

interface ProjectProviderProps {
  children: React.ReactNode;
  clientSideId?: string; // Optional - either clientSideId or projectKey must be provided to make requests to the LaunchDarkly API
  providedProjectKey?: string;
}

export const ProjectProvider = ({ children, clientSideId, providedProjectKey }: ProjectProviderProps) => {
  const { getProjects } = useApi();
  const { apiReady } = useApi();
  const [projectKey, setProjectKey] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiReady) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (providedProjectKey) {
      setProjectKey(providedProjectKey);
    } else if (apiReady) {
      getProjects().then((projects) => {
        if (projects.length === 0) {
          throw new Error('No projects found');
        }

        let project = projects[0];

        if (clientSideId) {
          project = projects.find((project) =>
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
      });
    } else {
      setLoading(false);
    }
  }, [providedProjectKey, clientSideId, getProjects, apiReady]);

  return <ProjectContext.Provider value={{ projectKey, loading }}>{children}</ProjectContext.Provider>;
};

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}
