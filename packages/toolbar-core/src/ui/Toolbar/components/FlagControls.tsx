import { useState, useRef, useEffect } from 'react';
import {
  Button,
  ListBox,
  Popover,
  Select,
  SelectValue,
  Switch,
  ListBoxItem,
  TextField,
  Group,
  Input,
} from '@launchpad-ui/components';
import { ChevronDownIcon, EditIcon, CheckIcon, XIcon } from './icons';
import { IconButton } from './IconButton';
import { EnhancedFlag } from '../../../types/devServer';
import { deepEqual } from '../../../utils';

import * as popoverStyles from '../components/Popover.css';
import * as styles from './FlagControls.css';

interface BooleanFlagControlProps {
  flag: EnhancedFlag;
  onOverride: (value: boolean) => void;
  disabled?: boolean;
}

export function BooleanFlagControl(props: BooleanFlagControlProps) {
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

interface MultivariateFlagControlProps {
  flag: EnhancedFlag;
  onOverride: (value: any) => void;
  disabled?: boolean;
}

export function MultivariateFlagControl(props: MultivariateFlagControlProps) {
  const { flag, onOverride, disabled = false } = props;
  const currentVariation = flag.availableVariations.find((v) => deepEqual(v.value, flag.currentValue));

  return (
    <Select
      selectedKey={currentVariation?._id}
      onSelectionChange={(key) => {
        const variation = flag.availableVariations.find((v) => v._id === key);
        if (variation) {
          onOverride(variation.value);
        }
      }}
      aria-label="Select variant"
      placeholder="Select variant"
      data-theme="dark"
      className={styles.select}
      isDisabled={disabled}
    >
      <Button>
        <SelectValue className={styles.selectedValue} />
        <ChevronDownIcon className={styles.icon} />
      </Button>
      <Popover data-theme="dark" className={popoverStyles.popover}>
        <ListBox>
          {flag.availableVariations.map((variation) => (
            <ListBoxItem id={variation._id} key={variation._id}>
              {variation.name}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}

interface StringNumberFlagControlProps {
  flag: EnhancedFlag;
  onOverride: (value: string | number) => void;
  disabled?: boolean;
}

export function StringNumberFlagControl(props: StringNumberFlagControlProps) {
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
    const finalValue = flag.type === 'number' ? parseFloat(tempValue) : tempValue;
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
    <div className={styles.customVariantContainer}>
      {!isEditing ? (
        <div className={styles.currentValueGroup}>
          <div className={styles.currentValueText}>{currentValue}</div>
          <IconButton icon={<EditIcon />} label="Edit" onClick={handleEdit} disabled={disabled} />
        </div>
      ) : (
        <TextField aria-label={`Enter ${flag.type} value`} className={styles.customVariantField} data-theme="dark">
          <Group className={styles.customVariantFieldGroup}>
            <Input
              ref={inputRef}
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
