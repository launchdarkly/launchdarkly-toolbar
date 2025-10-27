import { ListItem } from '../../List/ListItem';
import { LocalFlag } from '../context';
import { LocalObjectFlagControl } from './LocalFlagControls';
import { OverrideIndicator } from './OverrideIndicator';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import * as sharedStyles from '../TabContent/FlagDevServerTabContent.css';
import { JsonEditor } from '../../JsonEditor/JsonEditor';
import { EASING } from '../constants/animations';
import { VIRTUALIZATION } from '../constants';

interface LocalObjectFlagControlListItemProps {
  handleClearOverride: (key: string) => void;
  handleOverride: (flagKey: string, value: any) => void;
  handleHeightChange: (height: number) => void;
  flag: LocalFlag;
  index: number;
  size: number;
  start: number;
}

export function LocalObjectFlagControlListItem(props: LocalObjectFlagControlListItemProps) {
  const { handleClearOverride, handleOverride, handleHeightChange, flag, index, size, start } = props;
  const currentValue = JSON.stringify(flag.currentValue, null, 2);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(currentValue);

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

  const handleEditorExpand = (height: number) => {
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
        <div className={sharedStyles.flagListItem} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div className={sharedStyles.flagHeader} style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={sharedStyles.flagName}>
              <span data-testid={`flag-name-${flag.key}`}>{flag.name}</span>
              {flag.isOverridden && <OverrideIndicator onClear={() => handleClearOverride(flag.key)} />}
            </span>
            <span className={sharedStyles.flagKey} data-testid={`flag-key-${flag.key}`}>{flag.key}</span>
          </div>

          <LocalObjectFlagControl
            flag={flag}
            isEditing={isEditing}
            handleEdit={handleEdit}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            onOverride={() => handleOverride(flag.key, tempValue)}
          />
        </div>
        <AnimatePresence mode="wait">
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
                id={`flag-input-${flag.key}`}
                onEditorExpand={handleEditorExpand}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ListItem>
    </div>
  );
}
