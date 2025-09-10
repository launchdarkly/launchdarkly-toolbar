import { useState, useMemo } from 'react';
import { Switch, TextField, Group, Input } from '@launchpad-ui/components';
import { EditIcon, CheckIcon, XIcon } from './icons';
import { IconButton } from './IconButton';
import type { LocalFlag } from '../context';

import * as sharedStyles from './FlagControls.css';
import * as styles from './LocalFlagControls.css';

interface LocalBooleanFlagControlProps {
  flag: LocalFlag;
  onOverride: (value: boolean) => void;
  disabled?: boolean;
}

export function LocalBooleanFlagControl(props: LocalBooleanFlagControlProps) {
  const { flag, onOverride, disabled = false } = props;

  return (
    <div className={sharedStyles.switchContainer}>
      <Switch
        data-theme="dark"
        isSelected={flag.currentValue}
        onChange={onOverride}
        isDisabled={disabled}
        className={sharedStyles.switch_}
      />
    </div>
  );
}

interface LocalStringNumberFlagControlProps {
  flag: LocalFlag;
  onOverride: (value: string | number) => void;
  disabled?: boolean;
}

export function LocalStringNumberFlagControl(props: LocalStringNumberFlagControlProps) {
  const { flag, onOverride, disabled = false } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(String(flag.currentValue));

  const handleConfirm = () => {
    let finalValue: string | number;
    if (flag.type === 'number') {
      finalValue = parseFloat(tempValue);
      // Check if it's a valid number
      if (isNaN(finalValue)) {
        return; // Don't save invalid numbers
      }
    } else {
      finalValue = tempValue;
    }
    onOverride(finalValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(String(flag.currentValue));
    setIsEditing(false);
  };

  return (
    <div className={sharedStyles.customVariantContainer}>
      {!isEditing ? (
        <div className={sharedStyles.currentValueGroup}>
          <div className={sharedStyles.currentValueText}>{String(flag.currentValue)}</div>
          <IconButton icon={<EditIcon />} label="Edit" onClick={() => setIsEditing(true)} disabled={disabled} />
        </div>
      ) : (
        <TextField
          aria-label={`Enter ${flag.type} value`}
          className={sharedStyles.customVariantField}
          data-theme="dark"
        >
          <Group className={sharedStyles.customVariantFieldGroup}>
            <Input
              placeholder={`Enter ${flag.type} value`}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              type={flag.type === 'number' ? 'number' : 'text'}
            />
            <IconButton icon={<CheckIcon />} label="Confirm" onClick={handleConfirm} />
            <IconButton icon={<XIcon />} label="Cancel" onClick={handleCancel} />
          </Group>
        </TextField>
      )}
    </div>
  );
}

interface LocalObjectFlagControlProps {
  flag: LocalFlag;
  onOverride: (value: any) => void;
  disabled?: boolean;
}

export function LocalObjectFlagControl(props: LocalObjectFlagControlProps) {
  const { flag, onOverride, disabled = false } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(() => JSON.stringify(flag.currentValue, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

  const displayValue = useMemo(() => JSON.stringify(flag.currentValue), [flag.currentValue]);

  const handleConfirm = () => {
    try {
      const parsedValue = JSON.parse(tempValue);
      onOverride(parsedValue);
      setIsEditing(false);
      setParseError(null);
    } catch {
      setParseError('Invalid JSON format');
    }
  };

  const handleCancel = () => {
    setTempValue(JSON.stringify(flag.currentValue, null, 2));
    setIsEditing(false);
    setParseError(null);
  };

  const handleValueChange = (value: string) => {
    setTempValue(value);
    setParseError(null); // Clear error when user types
  };

  return (
    <div className={sharedStyles.customVariantContainer}>
      {!isEditing ? (
        <div className={sharedStyles.currentValueGroup}>
          <div className={sharedStyles.currentValueText}>{displayValue}</div>
          <IconButton icon={<EditIcon />} label="Edit JSON" onClick={() => setIsEditing(true)} disabled={disabled} />
        </div>
      ) : (
        <TextField aria-label="Enter JSON value" className={sharedStyles.customVariantField} data-theme="dark">
          <Group className={sharedStyles.customVariantFieldGroup}>
            <textarea
              placeholder="Enter valid JSON"
              value={tempValue}
              onChange={(e) => handleValueChange(e.target.value)}
              rows={4}
              className={parseError ? `${styles.jsonTextarea} ${styles.jsonTextareaError}` : styles.jsonTextarea}
            />
            <div className={styles.jsonButtonGroup}>
              <IconButton icon={<CheckIcon />} label="Confirm" onClick={handleConfirm} />
              <IconButton icon={<XIcon />} label="Cancel" onClick={handleCancel} />
            </div>
            {parseError && <div className={styles.jsonParseError}>{parseError}</div>}
          </Group>
        </TextField>
      )}
    </div>
  );
}
