import styles from './GenericHelpText.module.css';

interface GenericHelpTextProps {
  title: string;
  subtitle?: string;
}

export function GenericHelpText(props: GenericHelpTextProps) {
  const { title, subtitle } = props;

  return (
    <div className={styles.genericHelpText}>
      <p>{title}</p>
      {subtitle && <span>{subtitle}</span>}
    </div>
  );
}
