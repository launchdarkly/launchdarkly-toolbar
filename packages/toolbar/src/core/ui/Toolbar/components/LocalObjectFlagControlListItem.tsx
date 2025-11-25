import { ListItem } from '../../List/ListItem';
import { LocalFlag } from '../context';
import { LocalObjectFlagControl } from './LocalFlagControls';
import { OverrideIndicator } from './OverrideIndicator';
import { StarButton } from './StarButton';
import { FlagKeyWithCopy } from './FlagKeyWithCopy';
import { ExternalLinkIcon } from './icons';
import { useStarredFlags } from '../context/StarredFlagsProvider';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JsonEditor } from '../../JsonEditor/JsonEditor';
import { EASING } from '../constants/animations';
import { VIRTUALIZATION } from '../constants';
import { EnhancedFlag } from '../../../types/devServer';
import { Diagnostic } from '@codemirror/lint';

import * as sharedStyles from '../TabContent/FlagDevServerTabContent.css';
import * as styles from './LocalObjectFlagControlListItem.css';
import { useEnvironmentContext } from '../context/EnvironmentProvider';
import { useProjectContext } from '../context/ProjectProvider';

interface LocalObjectFlagControlListItemProps {
  handleClearOverride: (key: string) => void;
  handleOverride: (flagKey: string, value: any) => void;
  handleHeightChange: (height: number) => void;
  onToggleStarred?: (flagKey: string) => void;
  flag: LocalFlag | EnhancedFlag;
  size: number;
  start: number;
}

export function LocalObjectFlagControlListItem(props: LocalObjectFlagControlListItemProps) {
  const { handleClearOverride, handleOverride, handleHeightChange, onToggleStarred, flag, size, start } = props;
  const { isStarred, toggleStarred: defaultToggleStarred } = useStarredFlags();
  const toggleStarred = onToggleStarred || defaultToggleStarred;
  const currentValue = JSON.stringify(flag.currentValue, null, 2);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(currentValue);
  const [hasErrors, setHasErrors] = useState(false);
  const { environment } = useEnvironmentContext();
  const { projectKey } = useProjectContext();

  // Since this is a virtualized item, we need to set the height to the standard item height when the component mounts
  // This happens specifically if the user is editing a JSON flag, scrolls to the point where the item is no longer visible,
  // and then scrolls back to the point where the item is visible again.
  useEffect(() => {
    handleHeightChange(VIRTUALIZATION.ITEM_HEIGHT);
  }, []);

  const handleValueChange = (value: string) => {
    setTempValue(value);
  };

  const handleLintErrors = (diagnostics: Diagnostic[]) => {
    setHasErrors(diagnostics.length > 0);
  };

  const handleEdit = () => {
    setTempValue(currentValue);
    setIsEditing(true);
  };

  const handleConfirm = () => {
    handleOverride(flag.key, JSON.parse(tempValue));
    setIsEditing(false);
    handleHeightChange(VIRTUALIZATION.ITEM_HEIGHT);
  };

  const handleCancel = () => {
    setIsEditing(false);
    handleHeightChange(VIRTUALIZATION.ITEM_HEIGHT);
  };

  const handleEditorHeightChange = (height: number) => {
    handleHeightChange(VIRTUALIZATION.ITEM_HEIGHT + height + 20); // 20px for padding
  };

  return (
    <div
      data-testid={`flag-row-${flag.key}`}
      className={sharedStyles.virtualItem}
      style={{
        height: size,
        transform: `translateY(${start}px)`,
        borderBottom: '1px solid var(--lp-color-gray-800)',
      }}
    >
      <ListItem className={sharedStyles.flagListItemBlock}>
        {flag.isOverridden && (
          <div className={sharedStyles.overrideIndicatorContainer}>
            <OverrideIndicator onClear={() => handleClearOverride(flag.key)} />
          </div>
        )}
        <div className={styles.flagContentWrapper}>
          <div className={sharedStyles.flagHeader}>
            <a
              href={`https://app.launchdarkly.com/projects/${projectKey}/flags/${flag.key}?env=${environment}&selectedEnv=${environment}`}
              target="_blank"
              className={sharedStyles.flagName}
            >
              <span className={styles.flagNameText} data-testid={`flag-name-${flag.key}`}>
                {flag.name}
              </span>
              <ExternalLinkIcon size="small" />
            </a>
            <FlagKeyWithCopy flagKey={flag.key} className={sharedStyles.flagKey} />
          </div>

          <div className={sharedStyles.flagOptions}>
            <LocalObjectFlagControl
              flag={flag}
              isEditing={isEditing}
              handleEdit={handleEdit}
              handleConfirm={handleConfirm}
              handleCancel={handleCancel}
              onOverride={() => handleOverride(flag.key, tempValue)}
              hasErrors={hasErrors}
            />
            <StarButton flagKey={flag.key} isStarred={isStarred(flag.key)} onToggle={toggleStarred} />
          </div>
        </div>

        <AnimatePresence data-testid={`json-editor-${flag.key}`} mode="wait">
          {isEditing && (
            <motion.div
              key={`json-editor-${flag.key}`}
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
                docString={tempValue}
                onChange={handleValueChange}
                onLintErrors={handleLintErrors}
                data-testid={`flag-input-${flag.key}`}
                editorId={`json-editor-${flag.key}`}
                initialState={{
                  startCursorAtLine: 0,
                  autoFocus: true,
                }}
                onEditorHeightChange={handleEditorHeightChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ListItem>
    </div>
  );
}
