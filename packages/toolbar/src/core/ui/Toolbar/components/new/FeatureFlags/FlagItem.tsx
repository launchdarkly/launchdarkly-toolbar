import React, { useState } from 'react';
import { motion } from 'motion/react';
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

interface OverrideDotProps {
  onClear: () => void;
}

function OverrideDot({ onClear }: OverrideDotProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClear();
    }
  };

  return (
    <motion.span
      className={styles.overrideDot}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClear}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Remove flag override"
      title={isHovered ? 'Click to remove override' : 'Override active'}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.1 }}
      data-testid="override-dot"
      style={{
        cursor: 'pointer',
      }}
    >
      <motion.span
        className={styles.overrideDotInner}
        animate={{
          backgroundColor: isHovered ? 'var(--lp-color-red-500)' : 'var(--lp-color-brand-cyan-base)',
        }}
        transition={{ duration: 0.05 }}
      />
    </motion.span>
  );
}

interface FlagItemProps {
  flag: NormalizedFlag;
  onOverride: (value: any) => void;
  onClearOverride?: () => void;
  handleHeightChange: (index: number, height: number) => void;
  disabled?: boolean;
  index: number;
}

export function FlagItem({
  flag,
  onOverride,
  onClearOverride,
  handleHeightChange,
  disabled = false,
  index,
}: FlagItemProps) {
  const [isEditingObject, setIsEditingObject] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const [hasErrors, setHasErrors] = useState(false);

  // Object/JSON flags have a different layout structure
  if (flag.type === 'object') {
    return (
      <div className={`${styles.containerBlock} ${flag.isOverridden ? styles.containerBlockOverridden : ''}`}>
        <div className={styles.header}>
          <div className={styles.info}>
            <div className={styles.nameRow}>
              {flag.isOverridden && onClearOverride && <OverrideDot onClear={onClearOverride} />}
              <div className={styles.name}>{flag.name}</div>
            </div>
            <FlagKeyWithCopy flagKey={flag.key} />
          </div>
          <div className={styles.control}>
            <ObjectFlagControlButtons
              isEditing={isEditingObject}
              onEditStart={() => {
                setTempValue(JSON.stringify(flag.currentValue, null, 2));
                setIsEditingObject(true);
              }}
              onConfirm={() => {
                onOverride(JSON.parse(tempValue));
                handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP);
                setIsEditingObject(false);
              }}
              onCancel={() => {
                handleHeightChange(index, VIRTUALIZATION.ITEM_HEIGHT + VIRTUALIZATION.GAP);
                setIsEditingObject(false);
              }}
              hasErrors={hasErrors}
            />
          </div>
        </div>
        <ObjectFlagEditor
          flag={flag}
          isEditing={isEditingObject}
          tempValue={tempValue}
          onValueChange={setTempValue}
          onLintErrors={setHasErrors}
          handleHeightChange={(height) => handleHeightChange(index, height)}
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
    <div className={`${styles.container} ${flag.isOverridden ? styles.containerOverridden : ''}`}>
      <div className={styles.info}>
        <div className={styles.nameRow}>
          {flag.isOverridden && onClearOverride && <OverrideDot onClear={onClearOverride} />}
          <div className={styles.name}>{flag.name}</div>
        </div>
        <FlagKeyWithCopy flagKey={flag.key} />
      </div>
      <div className={styles.control}>{renderControl()}</div>
    </div>
  );
}
