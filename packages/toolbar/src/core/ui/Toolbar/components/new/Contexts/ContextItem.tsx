import * as styles from './ContextItem.module.css';
import { ApiContext } from '../../../types/ldApi';
import { CopyableText } from '../../CopyableText';
import { FingerprintIcon, PersonIcon } from '../../icons';

interface ContextItemProps {
  context: ApiContext;
}

export function ContextItem({ context }: ContextItemProps) {
  const displayName = context.name || context.key;
  const isUser = context.kind === 'user';

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>{isUser ? <PersonIcon /> : <FingerprintIcon />}</div>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name} title={displayName}>
            {displayName}
          </span>
          {context.anonymous && <span className={styles.anonymousBadge}>Anonymous</span>}
        </div>
        <div className={styles.keyRow}>
          <CopyableText text={context.key} />
        </div>
      </div>
      <span className={styles.kindBadge}>{context.kind}</span>
    </div>
  );
}
