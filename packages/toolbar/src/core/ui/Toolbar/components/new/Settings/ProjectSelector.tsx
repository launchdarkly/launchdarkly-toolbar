import { useEffect, useMemo } from 'react';
import { useProjectContext } from '../../../context/api';
import { useAnalytics } from '../../../context/telemetry/AnalyticsProvider';
import { Select } from '../../../../Select/Select';

export function ProjectSelector() {
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
}
