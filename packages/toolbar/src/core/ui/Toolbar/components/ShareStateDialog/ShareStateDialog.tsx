import { useState, useCallback } from 'react';
import { Button, Checkbox } from '@launchpad-ui/components';
import * as styles from './ShareStateDialog.css';

export interface ShareStateOptions {
  includeFlagOverrides: boolean;
  includeContexts: boolean;
  includeSettings: boolean;
}

interface ShareStateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (options: ShareStateOptions) => void;
  overrideCount: number;
  contextCount: number;
}

export function ShareStateDialog(props: ShareStateDialogProps) {
  const { isOpen, onClose, onShare, overrideCount, contextCount } = props;

  const [includeFlagOverrides, setIncludeFlagOverrides] = useState(true);
  const [includeContexts, setIncludeContexts] = useState(true);
  const [includeSettings, setIncludeSettings] = useState(true);

  const handleShare = useCallback(() => {
    onShare({
      includeFlagOverrides,
      includeContexts,
      includeSettings,
    });
    onClose();
  }, [includeFlagOverrides, includeContexts, includeSettings, onShare, onClose]);

  const handleCancel = useCallback(() => {
    // Reset to defaults
    setIncludeFlagOverrides(true);
    setIncludeContexts(true);
    setIncludeSettings(true);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const hasAnySelection = includeFlagOverrides || includeContexts || includeSettings;

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Share Toolbar State</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>Select which parts of your toolbar state to include in the shareable link:</p>

          <div className={styles.options}>
            <label className={styles.option}>
              <Checkbox
                isSelected={includeFlagOverrides}
                onChange={setIncludeFlagOverrides}
                aria-label="Include flag overrides"
              >
                <span className={styles.optionLabel}>
                  Flag Overrides
                  <span className={styles.count}>({overrideCount})</span>
                </span>
              </Checkbox>
            </label>

            <label className={styles.option}>
              <Checkbox
                isSelected={includeContexts}
                onChange={setIncludeContexts}
                aria-label="Include contexts"
              >
                <span className={styles.optionLabel}>
                  Contexts
                  <span className={styles.count}>({contextCount})</span>
                </span>
              </Checkbox>
            </label>

            <label className={styles.option}>
              <Checkbox isSelected={includeSettings} onChange={setIncludeSettings} aria-label="Include settings">
                <span className={styles.optionLabel}>Settings</span>
              </Checkbox>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onPress={handleCancel} variant="default">
            Cancel
          </Button>
          <Button onPress={handleShare} variant="primary" isDisabled={!hasAnySelection}>
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
}
