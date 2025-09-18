import * as styles from './ErrorMessage.css';

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
