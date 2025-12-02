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
    label: variation.value,
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
          <div className={styles.currentValueText} data-testid={`flag-value-${flag.key}`}>
            {currentValue}
          </div>
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

interface ObjectFlagControlButtonsProps {
  isEditing: boolean;
  onEditStart: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  hasErrors: boolean;
}

export function ObjectFlagControlButtons(props: ObjectFlagControlButtonsProps) {
  const { isEditing, onEditStart, onConfirm, onCancel, hasErrors } = props;

  return (
    <div className={styles.jsonEditorActions}>
      {!isEditing ? (
        <Button onClick={onEditStart} data-theme="dark">
          Edit JSON
        </Button>
      ) : (
        <>
          <Button variant="primary" onClick={onConfirm} isDisabled={hasErrors} data-theme="dark">
            Save
          </Button>
          <Button onClick={onCancel} data-theme="dark">
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}

interface ObjectFlagEditorProps {
  flag: NormalizedFlag;
  isEditing: boolean;
  tempValue: string;
  onValueChange: (value: string) => void;
  onLintErrors: (hasErrors: boolean) => void;
  handleHeightChange: (height: number) => void;
}

export function ObjectFlagEditor(props: ObjectFlagEditorProps) {
  const { flag, isEditing, tempValue, onValueChange, onLintErrors, handleHeightChange } = props;

  const handleEditorHeightChange = (height: number) => {
    handleHeightChange(VIRTUALIZATION.ITEM_HEIGHT + height + 36); // 36px for padding
  };

  const handleLintErrors = (diagnostics: Diagnostic[]) => {
    onLintErrors(diagnostics.length > 0);
  };

  return (
    <AnimatePresence mode="wait">
      {isEditing && (
        <motion.div
          key={`json-editor-${flag.key}`}
          data-testid={`json-editor-${flag.key}`}
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
            onChange={onValueChange}
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
  );
}
