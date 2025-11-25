import React, { useEffect, useMemo } from 'react';
import { Select } from '../../Select';
import { useProjectContext } from '../../../context/ProjectProvider';
import { useAnalytics } from '../../../context/AnalyticsProvider';

export const ProjectSelector: React.FC = () => {
  const { projectKey, setProjectKey, projects, loading, getProjects } = useProjectContext();
  const analytics = useAnalytics();

  useEffect(() => {
    if (projects.length === 0) {
      getProjects();
    }
  }, [projects, getProjects]);

  const projectOptions = useMemo(() => {
    return projects.map((project) => ({
      id: project.key,
      label: project.name,
    }));
  }, [projects]);

  const handleProjectSelect = (key: string | null) => {
    if (key && key !== projectKey && !loading) {
      analytics.trackProjectSwitch(projectKey, key);
      setProjectKey(key);
    }
  };

  return (
    <Select
      selectedKey={projectKey}
      onSelectionChange={handleProjectSelect}
      aria-label="Select project"
      placeholder="Select project"
      data-theme="dark"
      isDisabled={loading}
      options={projectOptions}
    />
  );
};

