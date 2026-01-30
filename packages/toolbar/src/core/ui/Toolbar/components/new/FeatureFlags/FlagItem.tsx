import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as styles from './FlagItem.module.css';
import { CopyableText } from '../../CopyableText';
import { NormalizedFlag } from './types';
import {
  BooleanFlagControl,
  MultivariateFlagControl,
  ObjectFlagControlButtons,
  ObjectFlagEditor,
  StringNumberFlagControl,
} from './FlagControls';
import { VIRTUALIZATION } from '../../../constants';
import { StarButton } from '../../../../Buttons/StarButton';
import { useStarredFlags, useAnalytics, usePlugins, useProjectContext } from '../../../context';
import { ExternalLinkIcon, CancelCircleIcon } from '../../icons';
import { clearOverrideHoverReveal, clearOverrideIconButton } from '../../../../../../flags';

interface OverrideDotProps {
  onClear: () => void;
}

const OverrideDotDefault = memo(function OverrideDotDefault({ onClear }: OverrideDotProps) {
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
      aria-label="Clear override"
      title={isHovered ? 'Click to clear override' : 'Override active'}
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
});

const OverrideDotHoverReveal = memo(function OverrideDotHoverReveal({ onClear }: OverrideDotProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClear();
    }
  };

  return (
    <motion.span
      className={styles.overrideHoverReveal}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClear}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Clear override"
      title="Click to clear override"
      data-testid="override-hover-reveal"
      style={{ cursor: 'pointer' }}
    >
      <motion.span
        className={styles.overrideDotInner}
        animate={{
          backgroundColor: isHovered ? 'var(--lp-color-red-500)' : 'var(--lp-color-brand-cyan-base)',
        }}
        transition={{ duration: 0.1 }}
      />
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className={styles.overrideHoverText}
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
          >
            Clear
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
});

const OverrideDotIconButton = memo(function OverrideDotIconButton({ onClear }: OverrideDotProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClear();
    }
  };

  return (
    <motion.button
      className={styles.overrideIconButton}
      onClick={onClear}
      onKeyDown={handleKeyDown}
      aria-label="Clear override"
      title="Clear override"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      data-testid="override-icon-button"
      type="button"
    >
      <CancelCircleIcon className={styles.overrideIcon} />
    </motion.button>
  );
});

const OverrideDot = memo(function OverrideDot({ onClear }: OverrideDotProps) {
  const useIconButton = clearOverrideIconButton();
  const useHoverReveal = clearOverrideHoverReveal();

  if (useIconButton) {
    return <OverrideDotIconButton onClear={onClear} />;
  }

  if (useHoverReveal) {
    return <OverrideDotHoverReveal onClear={onClear} />;
  }

  return <OverrideDotDefault onClear={onClear} />;
});

interface FlagItemProps {
  flag: NormalizedFlag;
  onOverride: (value: any) => void;
  onClearOverride?: () => void;
  handleHeightChange: (index: number, height: number) => void;
  disabled?: boolean;
  index: number;
}

export const FlagItem = memo(function FlagItem({
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
  const { isStarred, toggleStarred } = useStarredFlags();
  const analytics = useAnalytics();
  const { baseUrl } = usePlugins();
  const { projectKey } = useProjectContext();

  const handleToggleStarred = useCallback(
    (flagKey: string) => {
      const wasPreviouslyStarred = isStarred(flagKey);
      toggleStarred(flagKey);
      analytics.trackStarredFlag(flagKey, wasPreviouslyStarred ? 'unstar' : 'star');
    },
    [isStarred, toggleStarred, analytics],
  );

  const flagDeeplinkUrl = `${baseUrl}/projects/${projectKey}/flags/${flag.key}`;

  const handleFlagLinkClick = useCallback(() => {
    analytics.trackOpenFlagDeeplink(flag.key, baseUrl);
  }, [analytics, flag.key, baseUrl]);

  const handleCopy = useCallback(
    (text: string) => {
      analytics.trackFlagKeyCopy(text);
    },
    [analytics],
  );

  // Object/JSON flags have a different layout structure
  if (flag.type === 'object') {
    return (
      <div
        className={`${styles.containerBlock} ${flag.isOverridden ? styles.containerBlockOverridden : ''}`}
        data-testid={`flag-item-${flag.key}`}
      >
        <div className={styles.header}>
          <div className={styles.flagInfo}>
            <StarButton flagKey={flag.key} isStarred={isStarred(flag.key)} onToggle={handleToggleStarred} />
            <div className={styles.info}>
              <div className={styles.nameRow}>
                {flag.isOverridden && onClearOverride ? <OverrideDot onClear={onClearOverride} /> : null}
                <a
                  className={styles.nameLink}
                  href={flagDeeplinkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleFlagLinkClick}
                  title={`Open ${flag.name} in LaunchDarkly`}
                >
                  <span className={styles.nameLinkText} title={flag.name}>
                    {flag.name}
                  </span>
                  <ExternalLinkIcon size="small" className={styles.externalLinkIcon} />
                </a>
              </div>
              <CopyableText text={flag.key} onCopy={handleCopy} />
            </div>
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
    <div
      className={`${styles.container} ${flag.isOverridden ? styles.containerOverridden : ''}`}
      data-testid={`flag-item-${flag.key}`}
    >
      <div className={styles.flagInfo}>
        <StarButton flagKey={flag.key} isStarred={isStarred(flag.key)} onToggle={handleToggleStarred} />
        <div className={styles.info}>
          <div className={styles.nameRow}>
            {flag.isOverridden && onClearOverride ? <OverrideDot onClear={onClearOverride} /> : null}
            <a
              className={styles.nameLink}
              href={flagDeeplinkUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleFlagLinkClick}
              title={`Open ${flag.name} in LaunchDarkly`}
            >
              <span className={styles.nameLinkText} title={flag.name}>
                {flag.name}
              </span>
              <ExternalLinkIcon size="small" className={styles.externalLinkIcon} />
            </a>
          </div>
          <CopyableText text={flag.key} onCopy={handleCopy} />
        </div>
      </div>
      <div className={styles.control}>{renderControl()}</div>
    </div>
  );
});
