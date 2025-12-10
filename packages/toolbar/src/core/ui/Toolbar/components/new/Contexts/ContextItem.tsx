import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as styles from './ContextItem.module.css';
import { ApiContext } from '../../../types/ldApi';
import { CopyableText } from '../../CopyableText';
import { FingerprintIcon, PersonIcon, ChevronDownIcon } from '../../icons';
import { JsonEditor } from '../../../../JsonEditor/JsonEditor';
import { VIRTUALIZATION, EASING } from '../../../constants';

interface ContextItemProps {
  context: ApiContext;
  /** Whether this context is the currently active SDK context */
  isActive?: boolean;
  /** Callback to notify parent of height changes */
  handleHeightChange?: (index: number, height: number) => void;
  /** Index of this item in the virtualized list */
  index?: number;
}

export function ContextItem({ context, isActive = false, handleHeightChange, index }: ContextItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasResetOnMountRef = useRef(false);
  const displayName = context.name || context.key;
  const isUser = context.kind === 'user';

  const containerClassName = isActive ? `${styles.container} ${styles.containerActive}` : styles.container;

  // Serialize context to JSON for display
  const contextJson = useMemo(() => {
    return JSON.stringify(context, null, 2);
  }, [context]);

  const handleToggleExpand = useCallback(() => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);

    // Notify parent of height change immediately when collapsing
    if (handleHeightChange && index !== undefined && !newExpanded) {
      // Reset to default height immediately when collapsing
      handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP);
    }
  }, [isExpanded, handleHeightChange, index]);

  const handleEditorHeightChange = useCallback(
    (height: number) => {
      if (handleHeightChange && index !== undefined && isExpanded) {
        handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + height + 36); // 36px for padding
      }
    },
    [handleHeightChange, index, isExpanded],
  );

  // Reset height on mount if not expanded (ensures clean state when item is remounted)
  // This handles the case where an item was expanded, scrolled out of view, then scrolled back
  useEffect(() => {
    if (!hasResetOnMountRef.current && handleHeightChange && index !== undefined) {
      // Always reset to default height on mount, regardless of expanded state
      // The expanded state will be false on remount anyway
      handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP);
      hasResetOnMountRef.current = true;
    }
  }, [handleHeightChange, index]); // Run when handleHeightChange or index become available

  // Reset height when component unmounts to ensure clean state
  useEffect(() => {
    return () => {
      // On unmount, reset to default height so item returns to normal size when remounted
      if (handleHeightChange && index !== undefined) {
        handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP);
      }
    };
  }, [handleHeightChange, index]);

  return (
    <div className={containerClassName}>
      <div className={styles.header}>
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
        <div className={styles.actions}>
          <span className={styles.kindBadge}>{context.kind}</span>
          <button
            className={styles.expandButton}
            onClick={handleToggleExpand}
            aria-label={isExpanded ? 'Collapse context details' : 'Expand context details'}
            aria-expanded={isExpanded}
          >
            <span className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}>
              <ChevronDownIcon />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key={`json-editor-${context.kind}-${context.key}`}
            data-testid={`json-editor-${context.kind}-${context.key}`}
            initial={{
              opacity: 0,
              height: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
              y: 0,
            }}
            exit={{
              opacity: 0,
              height: 0,
              y: -10,
            }}
            transition={{
              duration: 0.25,
              ease: EASING.smooth,
              height: {
                duration: 0.3,
                ease: EASING.smooth,
              },
            }}
            style={{
              overflow: 'hidden',
            }}
          >
            <JsonEditor
              docString={contextJson}
              data-testid={`context-json-${context.kind}-${context.key}`}
              editorId={`json-editor-${context.kind}-${context.key}`}
              onEditorHeightChange={handleEditorHeightChange}
              readOnly={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
