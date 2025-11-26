import { useState, useRef, useEffect } from 'react';
import { Switch, TextField, Group, Input, Button } from '@launchpad-ui/components';
import { EditIcon, CheckIcon, CancelIcon } from '../../icons';
import { IconButton } from '../../../../Buttons/IconButton';
import { deepEqual } from '../../../../../utils';
import { Select, SelectOption } from '../../../../Select/Select';

import * as styles from './FlagControls.module.css';
import { NormalizedFlag } from './FlagList';
import { AnimatePresence, motion } from 'motion/react';
import { JsonEditor } from '../../../../JsonEditor/JsonEditor';
import { EASING, VIRTUALIZATION } from '../../../constants';
import { Diagnostic } from '@codemirror/lint';

interface BooleanFlagControlProps {
  flag: NormalizedFlag;
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
        className={styles.switchControl}
      />
    </div>
  );
}

interface MultivariateFlagControlProps {
  flag: NormalizedFlag;
  onOverride: (value: any) => void;
  disabled?: boolean;
}

export function MultivariateFlagControl(props: MultivariateFlagControlProps) {
  const { flag, onOverride, disabled = false } = props;
  const currentVariation = flag.availableVariations.find((v) => deepEqual(v.value, flag.currentValue));

  const options: SelectOption[] = flag.availableVariations.map((variation) => ({
    id: variation._id,
    label: variation.name,
    value: variation.value,
  }));

  return (
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
  );
}

interface StringNumberFlagControlProps {
  flag: NormalizedFlag;
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
    setTempValue(currentValue);
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
              onKeyDown={(e) => {
                // Stop propagation to prevent parent app keyboard shortcuts from interfering
                e.stopPropagation();

                // Submit on Enter
                if (e.key === 'Enter') {
                  handleConfirm();
                }

                // Cancel on Escape
                if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
            />
            <IconButton icon={<CheckIcon />} label="Confirm" onClick={handleConfirm} />
            <IconButton icon={<CancelIcon />} label="Cancel" onClick={handleCancel} />
          </Group>
        </TextField>
      )}
    </div>
  );
}

interface ObjectFlagControlProps {
  handleOverride: (flagKey: string, value: any) => void;
  handleHeightChange: (height: number) => void;
  flag: NormalizedFlag;
}

export function ObjectFlagControl(props: ObjectFlagControlProps) {
  const { handleOverride, handleHeightChange, flag } = props;
  const currentValue = JSON.stringify(flag.currentValue, null, 2);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(currentValue);
  const [hasErrors, setHasErrors] = useState(false);

  // Since this is a virtualized item, we need to set the height to the standard item height when the component mounts
  // This happens specifically if the user is editing a JSON flag, scrolls to the point where the item is no longer visible,
  // and then scrolls back to the point where the item is visible again.
  useEffect(() => {
    handleEditorHeightChange(VIRTUALIZATION.ITEM_HEIGHT);
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
    <div className={styles.jsonEditorContainer}>
      {!isEditing ? (
        <Button onClick={handleEdit} data-theme="dark">
          Edit JSON
        </Button>
      ) : (
        <div className={styles.jsonEditorActions}>
          <Button variant="primary" onClick={handleConfirm} isDisabled={hasErrors} data-theme="dark">
            Save
          </Button>
          <Button onClick={handleCancel} data-theme="dark">
            Cancel
          </Button>
        </div>
      )}

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
    </div>
  );
}
