import { createContext, useContext, useEffect, useState } from 'react';
import { useApi } from './ApiProvider';
import { useAuthContext } from './AuthProvider';

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

    if (!clientSideId && !providedProjectKey) {
      setLoading(false);
      throw new Error('Either clientSideId or projectKey must be provided to make requests to the LaunchDarkly API');
    }

    setLoading(true);

    if (providedProjectKey) {
      setProjectKey(providedProjectKey);
    } else if (clientSideId && apiReady) {
      getProjects().then((projects) => {
        const matchingProject = projects.find((project: any) =>
          project.environments.some((environment: any) => environment._id === clientSideId),
        );

        if (!matchingProject) {
          throw new Error('No matching project found');
        }

        setProjectKey(matchingProject.key);
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
