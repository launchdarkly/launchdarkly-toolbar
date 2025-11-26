import React from 'react';
import * as styles from './FlagItem.module.css';
import { FlagKeyWithCopy } from '../../FlagKeyWithCopy';
import { NormalizedFlag } from './FlagList';
import {
  BooleanFlagControl,
  MultivariateFlagControl,
  ObjectFlagControl,
  StringNumberFlagControl,
} from './FlagControls';

interface FlagItemProps {
  flag: NormalizedFlag;
  onOverride: (value: any) => void;
  handleHeightChange: (height: number) => void;
  disabled?: boolean;
}

export const FlagItem: React.FC<FlagItemProps> = ({ flag, onOverride, handleHeightChange, disabled = false }) => {

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

    // Object/JSON flags
    if (flag.type === 'object') {
      return (
        <ObjectFlagControl 
          flag={flag} 
          handleOverride={(_flagKey: string, value: any) => onOverride(value)} 
          handleHeightChange={handleHeightChange}  
        />
      );
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
