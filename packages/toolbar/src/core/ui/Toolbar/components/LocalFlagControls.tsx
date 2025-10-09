import { useState, useMemo, useRef, useEffect } from 'react';
import { Switch, TextField, Group, Input } from '@launchpad-ui/components';
import { EditIcon, CheckIcon, XIcon } from './icons';
import { IconButton } from './IconButton';
import type { LocalFlag } from '../context';
import { enableShadowDOM } from '@react-stately/flags';
enableShadowDOM();

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
    <div className={sharedStyles.switchContainer} data-testid={`flag-control-${flag.key}`}>
      <Switch
        data-theme="dark"
        isSelected={flag.currentValue}
        onChange={onOverride}
        isDisabled={disabled}
        className={sharedStyles.switch_}
        aria-label={`Toggle ${flag.name}`}
        data-testid={`flag-switch-${flag.key}`}
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
  const currentValue = String(flag.currentValue);
  const [tempValue, setTempValue] = useState(currentValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

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
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempValue(currentValue);
    setIsEditing(true);
  };

  return (
    <div className={sharedStyles.customVariantContainer} data-testid={`flag-control-${flag.key}`}>
      {!isEditing ? (
        <div className={sharedStyles.currentValueGroup}>
          <div className={sharedStyles.currentValueText} data-testid={`flag-value-${flag.key}`}>
            {currentValue}
          </div>
          <IconButton
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEdit}
            disabled={disabled}
            data-testid={`flag-edit-${flag.key}`}
          />
        </div>
      ) : (
        <TextField
          aria-label={`Enter ${flag.type} value for ${flag.name}`}
          className={sharedStyles.customVariantField}
          data-theme="dark"
        >
          <Group className={sharedStyles.customVariantFieldGroup}>
            <Input
              ref={inputRef}
              placeholder={`Enter ${flag.type} value`}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              type={flag.type === 'number' ? 'number' : 'text'}
              data-testid={`flag-input-${flag.key}`}
            />
            <IconButton
              icon={<CheckIcon />}
              label="Confirm"
              onClick={handleConfirm}
              data-testid={`flag-confirm-${flag.key}`}
            />
            <IconButton
              icon={<XIcon />}
              label="Cancel"
              onClick={handleCancel}
              data-testid={`flag-cancel-${flag.key}`}
            />
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
  const currentValue = JSON.stringify(flag.currentValue, null, 2);
  const [tempValue, setTempValue] = useState(currentValue);
  const [parseError, setParseError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayValue = useMemo(() => JSON.stringify(flag.currentValue), [flag.currentValue]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [isEditing]);

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
    setIsEditing(false);
    setParseError(null);
  };

  const handleValueChange = (value: string) => {
    setTempValue(value);
    setParseError(null); // Clear error when user types
  };

  const handleEdit = () => {
    setTempValue(currentValue);
    setIsEditing(true);
  };

  return (
    <div className={sharedStyles.customVariantContainer} data-testid={`flag-control-${flag.key}`}>
      {!isEditing ? (
        <div className={sharedStyles.currentValueGroup}>
          <div className={sharedStyles.currentValueText} data-testid={`flag-value-${flag.key}`}>
            {displayValue}
          </div>
          <IconButton
            icon={<EditIcon />}
            label="Edit JSON"
            onClick={handleEdit}
            disabled={disabled}
            data-testid={`flag-edit-${flag.key}`}
          />
        </div>
      ) : (
        <TextField
          aria-label={`Enter JSON value for ${flag.name}`}
          className={sharedStyles.customVariantField}
          data-theme="dark"
        >
          <Group className={sharedStyles.customVariantFieldGroup}>
            <textarea
              ref={textareaRef}
              placeholder="Enter valid JSON"
              value={tempValue}
              onChange={(e) => handleValueChange(e.target.value)}
              rows={4}
              className={parseError ? `${styles.jsonTextarea} ${styles.jsonTextareaError}` : styles.jsonTextarea}
              data-testid={`flag-input-${flag.key}`}
              aria-label={`JSON input for ${flag.name}`}
            />
            <div className={styles.jsonButtonGroup}>
              <IconButton
                icon={<CheckIcon />}
                label="Confirm"
                onClick={handleConfirm}
                data-testid={`flag-confirm-${flag.key}`}
              />
              <IconButton
                icon={<XIcon />}
                label="Cancel"
                onClick={handleCancel}
                data-testid={`flag-cancel-${flag.key}`}
              />
            </div>
            {parseError && <div className={styles.jsonParseError}>{parseError}</div>}
          </Group>
        </TextField>
      )}
    </div>
  );
}
