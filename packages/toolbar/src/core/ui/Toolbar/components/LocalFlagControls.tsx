import { useState, useRef, useEffect } from 'react';
import { Switch, TextField, Group, Input, Button } from '@launchpad-ui/components';
import { EditIcon, CheckIcon, CancelIcon } from './icons';
import { IconButton } from './IconButton';
import type { LocalFlag } from '../context';
import { enableShadowDOM } from '@react-stately/flags';
import * as sharedStyles from './FlagControls.css';
import * as styles from './LocalFlagControls.css';
import { EnhancedFlag } from '../../../types/devServer';
import { Select, SelectOption } from './Select';
import { deepEqual } from '../../../utils/deepEqual';

enableShadowDOM();

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
              icon={<CancelIcon />}
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
  flag: LocalFlag | EnhancedFlag;
  isEditing: boolean;
  handleEdit: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
  onOverride: (value: any) => void;
  hasErrors: boolean;
}

export function LocalObjectFlagControl(props: LocalObjectFlagControlProps) {
  const { flag, isEditing, handleEdit, handleConfirm, handleCancel, hasErrors } = props;

  return (
    <div className={styles.editActionsContainer}>
      <div className={sharedStyles.jsonEditorContainer} data-testid={`flag-control-${flag.key}`}>
        {!isEditing ? (
          <Button onClick={handleEdit} data-testid={`flag-edit-${flag.key}`}>
            Edit JSON
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              onClick={handleConfirm}
              data-testid={`flag-confirm-${flag.key}`}
              isDisabled={hasErrors}
            >
              Save
            </Button>
            <Button onClick={handleCancel} data-testid={`flag-cancel-${flag.key}`}>
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

interface LocalMultivariateFlagControlProps {
  flag: LocalFlag;
  onOverride: (value: any) => void;
  disabled?: boolean;
}

export function LocalMultivariateFlagControl(props: LocalMultivariateFlagControlProps) {
  const { flag, onOverride, disabled = false } = props;
  const currentVariation = flag.availableVariations.find((v) => deepEqual(v.value, flag.currentValue));

  // Format the value for display
  const formatValue = (value: any): string => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  };

  const options: SelectOption[] = flag.availableVariations.map((variation) => ({
    id: variation._id,
    label: formatValue(variation.value),
    value: variation.value,
  }));

  return (
    <div className={styles.multivariateContainer} data-testid={`flag-control-${flag.key}`}>
      <Select
        selectedKey={currentVariation?._id || null}
        onSelectionChange={(key) => {
          if (key) {
            const variation = flag.availableVariations.find((v) => v._id === key);
            if (variation) {
              onOverride(variation.value);
            }
          }
        }}
        aria-label="Select variant"
        placeholder="Select variant"
        data-theme="dark"
        className={styles.select}
        isDisabled={disabled}
        options={options}
      />
    </div>
  );
}
