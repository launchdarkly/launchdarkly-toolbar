import { ListItem } from '../../List/ListItem';
import { LocalFlag } from '../context';
import { LocalObjectFlagControl } from './LocalFlagControls';
import { OverrideIndicator } from './OverrideIndicator';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import * as sharedStyles from '../TabContent/FlagDevServerTabContent.css';
import { JsonEditor } from '../../JsonEditor/JsonEditor';
import { EASING } from '../constants/animations';
import { VIRTUALIZATION } from '../constants';
import { EnhancedFlag } from '../../../types/devServer';

interface LocalObjectFlagControlListItemProps {
  handleClearOverride: (key: string) => void;
  handleOverride: (flagKey: string, value: any) => void;
  handleHeightChange: (height: number) => void;
  flag: LocalFlag | EnhancedFlag;
  size: number;
  start: number;
}

export function LocalObjectFlagControlListItem(props: LocalObjectFlagControlListItemProps) {
  const { handleClearOverride, handleOverride, handleHeightChange, flag, size, start } = props;
  const currentValue = JSON.stringify(flag.currentValue, null, 2);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(currentValue);

  // Since this is a virtualized item, we need to set the height to the standard item height when the component mounts
  // This happens specifically if the user is editing a JSON flag, scrolls to the point where the item is no longer visible,
  // and then scrolls back to the point where the item is visible again.
  useEffect(() => {
    handleHeightChange(VIRTUALIZATION.ITEM_HEIGHT);
  }, []);

  const handleValueChange = (value: string) => {
    setTempValue(value);
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className={sharedStyles.flagHeader} style={{ display: 'flex', flexDirection: 'column' }}>
              <span className={sharedStyles.flagName}>
                <span
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  data-testid={`flag-name-${flag.key}`}
                >
                  {flag.name}
                </span>
                {flag.isOverridden && <OverrideIndicator onClear={() => handleClearOverride(flag.key)} />}
              </span>
              <span className={sharedStyles.flagKey} data-testid={`flag-key-${flag.key}`}>
                {flag.key}
              </span>
            </div>
            <div className={sharedStyles.flagOptions}>
              <LocalObjectFlagControl
                flag={flag}
                isEditing={isEditing}
                handleEdit={handleEdit}
                handleConfirm={handleConfirm}
                handleCancel={handleCancel}
                onOverride={() => handleOverride(flag.key, tempValue)}
              />
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
                  data-testid={`flag-input-${flag.key}`}
                  editorId={`json-editor-${flag.key}`}
                  onEditorHeightChange={handleEditorHeightChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ListItem>
    </div>
  );
}
