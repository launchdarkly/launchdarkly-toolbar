import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as styles from './ContextItem.module.css';
import { Context } from '../../../types/ldApi';
import { CopyableText } from '../../CopyableText';
import { EditIcon, DeleteIcon, CheckIcon, CancelIcon } from '../../icons';
import { useContextsContext } from '../../../context/api/ContextsProvider';
import { JsonEditor } from '../../../../JsonEditor/JsonEditor';
import { VIRTUALIZATION, EASING } from '../../../constants';
import { IconButton } from '../../../../Buttons/IconButton';
import { useAnalytics } from '../../../context/telemetry/AnalyticsProvider';

interface ContextItemProps {
  context: Context;
  isActiveContext: boolean;
  handleHeightChange?: (index: number, height: number) => void;
  index?: number;
}

export function ContextItem({ context, isActiveContext, handleHeightChange, index }: ContextItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJson, setEditedJson] = useState('');
  const [hasLintErrors, setHasLintErrors] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const hasResetOnMountRef = useRef(false);
  const { removeContext, updateContext, setContext } = useContextsContext();
  const analytics = useAnalytics();
  const displayName = context.name || context.key;
  const isClickable = !isActiveContext && !isSelecting && !isEditing;

  const containerClassName = isActiveContext
    ? `${styles.container} ${styles.containerActive}`
    : isClickable
      ? `${styles.container} ${styles.containerClickable}`
      : styles.container;

  const contextJson = useMemo(() => {
    return JSON.stringify(context, null, 2);
  }, [context]);

  const handleEdit = useCallback(() => {
    setEditedJson(contextJson);
    setIsEditing(true);
    setHasLintErrors(false);

    // Track analytics
    const contextKey = context.kind === 'multi' ? context.name || 'multi-kind' : context.key || '';
    analytics.trackContextEditStarted(context.kind, contextKey);
  }, [contextJson, context, analytics]);

  const handleSave = useCallback(() => {
    if (hasLintErrors) {
      return;
    }

    try {
      const parsed = JSON.parse(editedJson);
      if (!parsed || typeof parsed !== 'object') {
        console.error('Invalid JSON: must be an object');
        return;
      }

      if (!parsed.kind || typeof parsed.kind !== 'string') {
        console.error('Context must have a "kind" field');
        return;
      }

      // Update the context
      const oldKey = context.key || context.name;
      updateContext(context.kind, oldKey, parsed as Context);
      setIsEditing(false);

      // Reset height when collapsing
      if (handleHeightChange && index !== undefined) {
        handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP);
      }
    } catch (error) {
      console.error('Failed to parse JSON:', error);
    }
  }, [editedJson, hasLintErrors, context, updateContext, handleHeightChange, index]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedJson('');
    setHasLintErrors(false);

    // Track analytics
    const contextKey = context.kind === 'multi' ? context.name || 'multi-kind' : context.key || '';
    analytics.trackContextEditCancelled(context.kind, contextKey);

    // Reset height when collapsing
    if (handleHeightChange && index !== undefined) {
      handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP);
    }
  }, [handleHeightChange, index, context, analytics]);

  const handleJsonChange = useCallback((value: string) => {
    setEditedJson(value);
  }, []);

  const handleLintErrors = useCallback((errors: any[]) => {
    setHasLintErrors(errors.length > 0);
  }, []);

  const handleEditorHeightChange = useCallback(
    (height: number) => {
      if (handleHeightChange && index !== undefined && isEditing) {
        handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + height + 36); // 36px for padding
      }
    },
    [handleHeightChange, index, isEditing],
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Prevent deletion of active context
      if (isActiveContext) {
        return;
      }
      // Note: Analytics tracking happens in removeContext in ContextsProvider
      removeContext(context.kind, context.key || context.name || '');
    },
    [removeContext, context.kind, context.key, context.name, isActiveContext],
  );

  const handleSelect = useCallback(async () => {
    // Don't select if already active or if currently selecting
    if (isActiveContext || isSelecting) {
      return;
    }

    setIsSelecting(true);
    try {
      await setContext(context);
    } catch (error) {
      console.error('Failed to set context:', error);
    } finally {
      setIsSelecting(false);
    }
  }, [context, isActiveContext, isSelecting, setContext]);

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
    <div
      className={containerClassName}
      onClick={isClickable ? handleSelect : undefined}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `Select context ${displayName}` : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleSelect();
        }
      }}
    >
      <div className={styles.header}>
        {isActiveContext && <span className={styles.activeDot} />}
        <div className={styles.info}>
          <div className={styles.nameRow}>
            <span className={styles.name} title={displayName}>
              {displayName}
            </span>
          </div>
          <div className={styles.keyRow} onClick={(e) => e.stopPropagation()}>
            <CopyableText
              text={context.name || context.key || ''}
              onCopy={() => {
                const contextKey = context.name || context.key || '';
                analytics.trackContextKeyCopy(contextKey);
              }}
            />
          </div>
        </div>
        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
          <span className={styles.kindBadge}>{context.kind}</span>
          {!isEditing ? (
            <>
              <IconButton icon={<EditIcon />} onClick={handleEdit} label="Edit context" title="Edit context" />
              <IconButton
                icon={<DeleteIcon />}
                onClick={handleDelete}
                disabled={isActiveContext}
                label={
                  isActiveContext ? `Cannot delete active context ${context.key}` : `Delete context ${context.key}`
                }
                title={isActiveContext ? 'Cannot delete active context' : 'Delete context'}
              />
            </>
          ) : (
            <>
              <IconButton
                icon={<CheckIcon />}
                onClick={handleSave}
                disabled={hasLintErrors}
                label="Save context"
                title="Save context"
                data-testid={`save-context-${context.kind}-${context.key}`}
              />
              <IconButton
                icon={<CancelIcon />}
                onClick={handleCancel}
                label="Cancel editing"
                title="Cancel editing"
                data-testid={`cancel-context-${context.kind}-${context.key}`}
              />
            </>
          )}
        </div>
      </div>
      <AnimatePresence mode="wait">
        {isEditing && (
          <motion.div
            key={`json-editor-${context.kind}-${context.key}`}
            data-testid={`json-editor-${context.kind}-${context.key}`}
            onClick={(e) => e.stopPropagation()}
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
              docString={editedJson}
              onChange={handleJsonChange}
              onLintErrors={handleLintErrors}
              data-testid={`context-json-${context.kind}-${context.key}`}
              editorId={`json-editor-${context.kind}-${context.key}`}
              onEditorHeightChange={handleEditorHeightChange}
              initialState={{
                startCursorAtLine: 0,
                autoFocus: true,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
