import { useState } from 'react';
import { Switch, TextField, Group, Input } from '@launchpad-ui/components';
import { EditIcon, CheckIcon, XIcon } from './icons';
import { IconButton } from './IconButton';

import * as styles from './FlagControls.css';

interface LocalFlag {
  key: string;
  name: string;
  currentValue: any;
  isOverridden: boolean;
  type: 'boolean' | 'string' | 'number' | 'object';
}

interface LocalBooleanFlagControlProps {
  flag: LocalFlag;
  onOverride: (value: boolean) => void;
  disabled?: boolean;
}

export function LocalBooleanFlagControl(props: LocalBooleanFlagControlProps) {
  const { flag, onOverride, disabled = false } = props;

  return (
    <div className={styles.switchContainer}>
      <Switch
        data-theme="dark"
        isSelected={flag.currentValue}
        onChange={onOverride}
        isDisabled={disabled}
        className={styles.switch_}
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
    <div className={styles.customVariantContainer}>
      {!isEditing ? (
        <div className={styles.currentValueGroup}>
          <div className={styles.currentValueText}>{String(flag.currentValue)}</div>
          <IconButton icon={<EditIcon />} label="Edit" onClick={() => setIsEditing(true)} disabled={disabled} />
        </div>
      ) : (
        <TextField aria-label={`Enter ${flag.type} value`} className={styles.customVariantField} data-theme="dark">
          <Group className={styles.customVariantFieldGroup}>
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
  const [tempValue, setTempValue] = useState(JSON.stringify(flag.currentValue, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);

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
    <div className={styles.customVariantContainer}>
      {!isEditing ? (
        <div className={styles.currentValueGroup}>
          <div className={styles.currentValueText}>{JSON.stringify(flag.currentValue)}</div>
          <IconButton icon={<EditIcon />} label="Edit JSON" onClick={() => setIsEditing(true)} disabled={disabled} />
        </div>
      ) : (
        <TextField aria-label="Enter JSON value" className={styles.customVariantField} data-theme="dark">
          <Group className={styles.customVariantFieldGroup}>
            <textarea
              placeholder="Enter valid JSON"
              value={tempValue}
              onChange={(e) => handleValueChange(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '12px',
                border: parseError ? '1px solid red' : '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
                backgroundColor: '#2a2a2a',
                color: '#fff',
              }}
            />
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <IconButton icon={<CheckIcon />} label="Confirm" onClick={handleConfirm} />
              <IconButton icon={<XIcon />} label="Cancel" onClick={handleCancel} />
            </div>
            {parseError && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{parseError}</div>}
          </Group>
        </TextField>
      )}
    </div>
  );
}
