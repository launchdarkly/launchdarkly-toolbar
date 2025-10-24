import { useMemo } from "react";
import { ListItem } from "../../List/ListItem";
import { LocalFlag } from "../context";
import { LocalObjectFlagControl } from "./LocalFlagControls";
import { OverrideIndicator } from "./OverrideIndicator";
import { useState } from "react";

import * as sharedStyles from '../TabContent/FlagDevServerTabContent.css';

interface LocalObjectFlagControlListItemProps {
  handleClearOverride: (key: string) => void;
  handleOverride: (flagKey: string, value: any) => void;
  handleEditingChange: (isEditing: boolean) => void;
  flag: LocalFlag;
  key: number | string | bigint;
  size: number;
  start: number;
}

export function LocalObjectFlagControlListItem(props: LocalObjectFlagControlListItemProps) {
  const { handleClearOverride, handleOverride, handleEditingChange, flag, key, size, start } = props;
  const currentValue = JSON.stringify(flag.currentValue, null, 2);

  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(currentValue);
  const [parseError, setParseError] = useState<string | null>(null);

  const displayValue = useMemo(() => JSON.stringify(flag.currentValue), [flag.currentValue]);


  const handleValueChange = (value: string) => {
    setTempValue(value);
    setParseError(null); // Clear error when user types
  };

  const handleEdit = () => {
    setTempValue(currentValue);
    setIsEditing(true);
    handleEditingChange(true);
  };

  const handleConfirm = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  
  return (
    <div
      key={key}
      data-testid={`flag-row-${flag.key}`}
      className={sharedStyles.virtualItem}
      style={{
        height: isEditing ? '250px' : '65px',
        transform: `translateY(${start}px)`,
        borderBottom: '1px solid var(--lp-color-gray-800)',
      }}
    >
      <ListItem>
        <div className={sharedStyles.flagListItem}>
          <span>
            <span data-testid={`flag-name-${flag.key}`}>
              {flag.name}
            </span>
            {flag.isOverridden && <OverrideIndicator onClear={() => handleClearOverride(flag.key)} />}
          </span>
          <span data-testid={`flag-key-${flag.key}`}>
            {flag.key}
          </span>

          <LocalObjectFlagControl flag={flag} isEditing={isEditing} handleEdit={handleEdit} handleConfirm={handleConfirm} handleCancel={handleCancel} onOverride={() => handleOverride(flag.key, tempValue)} />

          {/* {isEditing && (
            <CodeEditor
              className={sharedStyles.codeEditor}
              value={tempValue}
              onChange={handleValueChange}
              data-testid={`flag-input-${flag.key}`}
            />
          )} */}
        </div>
      </ListItem>
    </div>
  )
}
