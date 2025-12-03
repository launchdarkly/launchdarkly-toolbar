import { useMemo } from 'react';
import { useEnvironmentContext, useProjectContext } from '../../../context';
import { Select } from '../../../../Select/Select';

export function EnvironmentSelector() {
  const { environment, setEnvironment } = useEnvironmentContext();
  const { environments, loading } = useProjectContext();

  const environmentOptions = useMemo(() => {
    return environments.map((env) => ({
      id: env.key,
      label: env.name,
    }));
  }, [environments]);

  const handleEnvironmentSelect = (key: string | null) => {
    if (key && key !== environment && !loading) {
      setEnvironment(key);
    }
  };

  return (
    <Select
      selectedKey={environment}
      onSelectionChange={handleEnvironmentSelect}
      aria-label="Select environment"
      placeholder="Select environment"
      data-theme="dark"
      isDisabled={loading || environments.length === 0}
      options={environmentOptions}
    />
  );
}
