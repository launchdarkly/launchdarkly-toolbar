import { createContext, useEffect, useState } from 'react';
import { useApi } from './ApiProvider';

type ProjectContextType = {
  projectKey: string;
};

const ProjectContext = createContext<ProjectContextType>({
  projectKey: '',
});

interface ProjectProviderProps {
  children: React.ReactNode;
  clientSideId?: string; // Optional - either clientSideId or projectKey must be provided to make requests to the LaunchDarkly API
  providedProjectKey?: string;
}

export const ProjectProvider = ({ children, clientSideId, providedProjectKey }: ProjectProviderProps) => {
  const { getProjects } = useApi();
  const [projectKey, setProjectKey] = useState<string>('');

  useEffect(() => {
    if (!clientSideId && !providedProjectKey) {
      throw new Error('Either clientSideId or projectKey must be provided to make requests to the LaunchDarkly API');
    }

    if (providedProjectKey) {
      setProjectKey(providedProjectKey);
    } else if (clientSideId) {
      getProjects().then((projects) => {
        const matchingProject = projects.find((project: any) =>
          project.environments.some((environment: any) => environment._id === clientSideId),
        );

        if (!matchingProject) {
          throw new Error('No matching project found');
        }

        setProjectKey(matchingProject.key);
      });
    }
  }, [providedProjectKey, clientSideId, getProjects]);

  return <ProjectContext.Provider value={{ projectKey }}>{children}</ProjectContext.Provider>;
};
