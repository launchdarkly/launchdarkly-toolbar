import * as styles from './GenericHelpText.css';

interface GenericHelpTextProps {
  title: string;
  subtitle?: string;
}

export function GenericHelpText(props: GenericHelpTextProps) {
  const { title, subtitle } = props;

  return (
    <div className={styles.genericHelpText}>
      <p className={styles.genericHelpTextP}>{title}</p>
      {subtitle ? <span className={styles.genericHelpTextSpan}>{subtitle}</span> : null}
    </div>
  );
}
