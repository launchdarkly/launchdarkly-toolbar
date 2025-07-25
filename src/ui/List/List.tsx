import styles from './List.module.css';

export interface ListProps {
  children: React.ReactNode;
  className?: string;
}

export function List(props: ListProps) {
  const { children, className } = props;

  return <div className={`${styles.list} ${className || ''}`}>{children}</div>;
}
