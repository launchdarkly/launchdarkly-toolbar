import styles from '../TabContent/TabContent.module.css';

interface StatusDotProps {
  status: 'connected' | 'disconnected' | 'error';
}

export function StatusDot(props: StatusDotProps) {
  const { status } = props;

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'var(--lp-color-green-500)';
      case 'disconnected':
        return 'var(--lp-color-orange-500)';
      case 'error':
        return 'var(--lp-color-red-500)';
    }
  };

  return <div className={`${styles.statusDot}`} style={{ backgroundColor: getStatusColor() }} />;
}
