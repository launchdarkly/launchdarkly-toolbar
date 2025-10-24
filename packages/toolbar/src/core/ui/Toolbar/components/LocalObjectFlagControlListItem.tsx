import { ListItem } from '../../List/ListItem';
import { LocalFlag } from '../context';
import { LocalObjectFlagControl } from './LocalFlagControls';
import { OverrideIndicator } from './OverrideIndicator';
import { useState } from 'react';

import * as sharedStyles from '../TabContent/FlagDevServerTabContent.css';
import { JsonEditor } from '../../JsonEditor/JsonEditor';

interface LocalObjectFlagControlListItemProps {
  handleClearOverride: (key: string) => void;
  handleOverride: (flagKey: string, value: any) => void;
  handleEditingChange: (index: number, isEditing: boolean) => void;
  flag: LocalFlag;
  key: number | string | bigint;
  index: number;
  size: number;
  start: number;
}

export function LocalObjectFlagControlListItem(props: LocalObjectFlagControlListItemProps) {
  const { handleClearOverride, handleOverride, handleEditingChange, flag, key, index, size, start } = props;
  const currentValue = JSON.stringify(flag.currentValue, null, 2);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(currentValue);

  const handleValueChange = (value: string) => {
    setTempValue(value);
  };

  const handleEdit = () => {
    setTempValue(currentValue);
    setIsEditing(true);
    handleEditingChange(index, true);
  };

  const handleConfirm = () => {
    handleOverride(flag.key, JSON.parse(tempValue));
    setIsEditing(false);
    handleEditingChange(index, false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    handleEditingChange(index, false);
  };

  return (
    <div
      key={key}
      data-testid={`flag-row-${flag.key}`}
      className={sharedStyles.virtualItem}
      style={{
        height: size,
        transform: `translateY(${start}px)`,
        borderBottom: '1px solid var(--lp-color-gray-800)',
      }}
    >
      <ListItem>
        <div className={sharedStyles.flagListItem}>
          <span>
            <span data-testid={`flag-name-${flag.key}`}>{flag.name}</span>
            {flag.isOverridden && <OverrideIndicator onClear={() => handleClearOverride(flag.key)} />}
          </span>
          <span data-testid={`flag-key-${flag.key}`}>{flag.key}</span>

          <LocalObjectFlagControl
            flag={flag}
            isEditing={isEditing}
            handleEdit={handleEdit}
            handleConfirm={handleConfirm}
            handleCancel={handleCancel}
            onOverride={() => handleOverride(flag.key, tempValue)}
          />

          {isEditing && (
            <JsonEditor
              docString={tempValue}
              onChange={handleValueChange}
              data-testid={`flag-input-${flag.key}`}
              id={`flag-input-${flag.key}`}
            />
          )}
        </div>
      </ListItem>
    </div>
  );
}
