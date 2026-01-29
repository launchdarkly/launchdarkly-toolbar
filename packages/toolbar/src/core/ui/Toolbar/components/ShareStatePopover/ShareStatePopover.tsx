import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Button, Checkbox } from '@launchpad-ui/components';
import * as styles from './ShareStatePopover.css';

export interface ShareStateOptions {
  includeFlagOverrides: boolean;
  includeContexts: boolean;
  includeSettings: boolean;
}

interface ShareStatePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (options: ShareStateOptions) => void;
  overrideCount: number;
  contextCount: number;
  anchorRef?: React.RefObject<HTMLElement>;
}

export function ShareStatePopover(props: ShareStatePopoverProps) {
  const { isOpen, onClose, onShare, overrideCount, contextCount } = props;
  const popoverRef = useRef<HTMLDivElement>(null);

  const [includeFlagOverrides, setIncludeFlagOverrides] = useState(true);
  const [includeContexts, setIncludeContexts] = useState(true);
  const [includeSettings, setIncludeSettings] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll popover into view when it opens
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      const scrollTimeout = setTimeout(() => {
        if (popoverRef.current && typeof popoverRef.current.scrollIntoView === 'function') {
          popoverRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const handleShare = useCallback(() => {
    onShare({
      includeFlagOverrides,
      includeContexts,
      includeSettings,
    });

    // Show copied feedback
    setIsCopied(true);

    // Clear any existing timeout
    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
    }

    // Reset after 2 seconds and close the popover
    copiedTimeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      onClose();
      setIncludeFlagOverrides(true);
      setIncludeContexts(true);
      setIncludeSettings(true);
      copiedTimeoutRef.current = null;
    }, 1000);
  }, [includeFlagOverrides, includeContexts, includeSettings, onShare, onClose]);

  const hasAnySelection = includeFlagOverrides || includeContexts || includeSettings;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={popoverRef}
          className={styles.popover}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <h3 className={styles.title}>Share Toolbar State</h3>
          </div>

          <div className={styles.content}>
            <p className={styles.description}>Select what to include:</p>

            <div className={styles.options}>
              <div className={styles.option}>
                <Checkbox
                  isSelected={includeFlagOverrides}
                  onChange={setIncludeFlagOverrides}
                  aria-label="Include flag overrides"
                >
                  <span className={styles.optionLabel}>
                    Flag Overrides
                    {overrideCount > 0 ? <span className={styles.count}>({overrideCount})</span> : null}
                  </span>
                </Checkbox>
              </div>

              <div className={styles.option}>
                <Checkbox isSelected={includeContexts} onChange={setIncludeContexts} aria-label="Include contexts">
                  <span className={styles.optionLabel}>
                    Contexts
                    {contextCount > 0 ? <span className={styles.count}>({contextCount})</span> : null}
                  </span>
                </Checkbox>
              </div>

              <div className={styles.option}>
                <Checkbox isSelected={includeSettings} onChange={setIncludeSettings} aria-label="Include settings">
                  <span className={styles.optionLabel}>Settings</span>
                </Checkbox>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button onPress={onClose} variant="default" size="small" isDisabled={isCopied}>
              Cancel
            </Button>
            <Button onPress={handleShare} variant="primary" size="small" isDisabled={!hasAnySelection || isCopied}>
              {isCopied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
