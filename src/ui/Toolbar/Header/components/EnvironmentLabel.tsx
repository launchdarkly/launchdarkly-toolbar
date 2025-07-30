import * as styles from '../Header.css';

interface EnvironmentLabelProps {
  label: string;
}

export function EnvironmentLabel(props: EnvironmentLabelProps) {
  const { label } = props;

  return (
    <div className={styles.centerSection}>
      <span className={styles.environmentLabel}>{label}</span>
    </div>
  );
}
