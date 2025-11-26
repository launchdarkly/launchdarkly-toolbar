import React, { useState } from 'react';
import * as styles from './FlagItem.module.css';
import { FlagKeyWithCopy } from '../../FlagKeyWithCopy';
import { NormalizedFlag } from './FlagList';
import {
  BooleanFlagControl,
  MultivariateFlagControl,
  ObjectFlagControlButtons,
  ObjectFlagEditor,
  StringNumberFlagControl,
} from './FlagControls';
import { VIRTUALIZATION } from '../../../constants';

interface FlagItemProps {
  flag: NormalizedFlag;
  onOverride: (value: any) => void;
  handleHeightChange: (height: number) => void;
  disabled?: boolean;
}

export const FlagItem: React.FC<FlagItemProps> = ({ flag, onOverride, handleHeightChange, disabled = false }) => {
  const [isEditingObject, setIsEditingObject] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  // Object/JSON flags have a different layout structure
  if (flag.type === 'object') {
    return (
      <div className={styles.containerBlock}>
        <div className={styles.header}>
          <div className={styles.info}>
            <div className={styles.nameRow}>
              <div className={styles.name}>{flag.name}</div>
              {flag.isOverridden && <div className={styles.overrideBadge}>Override</div>}
            </div>
            <FlagKeyWithCopy flagKey={flag.key} />
          </div>
          <div className={styles.control}>
            <ObjectFlagControlButtons
              flag={flag}
              isEditing={isEditingObject}
              onEditStart={() => {
                setTempValue(JSON.stringify(flag.currentValue, null, 2));
                setIsEditingObject(true);
              }}
              onConfirm={() => {
                onOverride(JSON.parse(tempValue));
                handleHeightChange(VIRTUALIZATION.ITEM_HEIGHT);
                setIsEditingObject(false);
              }}
              onCancel={() => {
                handleHeightChange(VIRTUALIZATION.ITEM_HEIGHT);
                setIsEditingObject(false);
              }}
              hasErrors={hasErrors}
              handleHeightChange={handleHeightChange}
            />
          </div>
        </div>
        <ObjectFlagEditor
          flag={flag}
          isEditing={isEditingObject}
          tempValue={tempValue}
          onValueChange={setTempValue}
          onLintErrors={setHasErrors}
          handleHeightChange={handleHeightChange}
        />
      </div>
    );
  }

  // Standard inline layout for non-object flags
  const renderControl = () => {
    // Boolean flags
    if (flag.type === 'boolean') {
      return <BooleanFlagControl flag={flag} onOverride={onOverride} disabled={disabled} />;
    }

    // Multivariate flags (only for EnhancedFlag from dev-server)
    if (flag.type === 'multivariate' && 'availableVariations' in flag) {
      return <MultivariateFlagControl flag={flag} onOverride={onOverride} disabled={disabled} />;
    }

    // String and number flags
    if (flag.type === 'string' || flag.type === 'number') {
      return <StringNumberFlagControl flag={flag} onOverride={onOverride} disabled={disabled} />;
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <div className={styles.name}>{flag.name}</div>
          {flag.isOverridden && <div className={styles.overrideBadge}>Override</div>}
        </div>
        <FlagKeyWithCopy flagKey={flag.key} />
      </div>
      <div className={styles.control}>{renderControl()}</div>
    </div>
  );
};
