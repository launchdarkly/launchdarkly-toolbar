import styles from '../TabContent/TabContent.module.css';

interface ErrorMessageProps {
  error: string;
}

export function ErrorMessage(props: ErrorMessageProps) {
  const { error } = props;

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>{error}</div>
    </div>
  );
}
