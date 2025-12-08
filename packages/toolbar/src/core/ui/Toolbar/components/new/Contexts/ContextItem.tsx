import * as styles from './ContextItem.module.css';
import { ApiContext } from '../../../types/ldApi';
import { CopyableText } from '../../CopyableText';
import { FingerprintIcon, PersonIcon } from '../../icons';

interface ContextItemProps {
  context: ApiContext;
  /** Whether this context is the currently active SDK context */
  isActive?: boolean;
}

export function ContextItem({ context, isActive = false }: ContextItemProps) {
  const displayName = context.name || context.key;
  const isUser = context.kind === 'user';

  const containerClassName = isActive ? `${styles.container} ${styles.containerActive}` : styles.container;

  return (
    <div className={containerClassName}>
      <div className={styles.iconContainer}>{isUser ? <PersonIcon /> : <FingerprintIcon />}</div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name} title={displayName}>
            {displayName}
          </span>
          {context.anonymous && <span className={styles.anonymousBadge}>Anonymous</span>}
          {isActive && (
            <span className={styles.activeBadge}>
              <span className={styles.activeDot} />
              Active
            </span>
          )}
        </div>
        <div className={styles.keyRow}>
          <CopyableText text={context.key} />
        </div>
      </div>
      <span className={styles.kindBadge}>{context.kind}</span>
    </div>
  );
}
