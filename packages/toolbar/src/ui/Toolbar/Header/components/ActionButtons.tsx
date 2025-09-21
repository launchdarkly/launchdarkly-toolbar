import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton } from '../../components/IconButton';
import { SearchIcon, SyncIcon, ChevronDownIcon, PinIcon } from '../../components/icons';

import * as styles from '../Header.css';

interface ActionButtonsProps {
  searchIsExpanded: boolean;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  onRefresh: () => void;
  onTogglePin: () => void;
  isPinned: boolean;
  showSearchButton: boolean;
  showRefreshButton: boolean;
}

export function ActionButtons(props: ActionButtonsProps) {
  const {
    searchIsExpanded,
    setSearchIsExpanded,
    onClose,
    onRefresh,
    onTogglePin,
    isPinned,
    showSearchButton,
    showRefreshButton,
  } = props;
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationCount, setRotationCount] = useState(0);

  const handleRefreshClick = useCallback(() => {
    // Prevent multiple clicks while already spinning
    if (isSpinning) return;

    setIsSpinning(true);
    setRotationCount((prev) => prev + 360);

    // Reset spinning state after animation completes
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);

    onRefresh();
  }, [onRefresh, isSpinning]);

  return (
    <div className={styles.rightSection}>
      {showSearchButton && (
        <AnimatePresence>
          {!searchIsExpanded && (
            <motion.div
              key="search-button"
              className={styles.searchButtonArea}
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <IconButton
                icon={<SearchIcon />}
                label="Search"
                onClick={() => setSearchIsExpanded(true)}
                className={styles.actionButton}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      {showRefreshButton && (
        <IconButton
          icon={
            <motion.span
              animate={{ rotate: rotationCount }}
              transition={{
                duration: 1,
                ease: 'linear',
              }}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <SyncIcon />
            </motion.span>
          }
          label="Refresh"
          onClick={handleRefreshClick}
          className={styles.actionButton}
        />
      )}
      <IconButton
        icon={<PinIcon />}
        label={isPinned ? "Unpin toolbar" : "Pin toolbar"}
        onClick={onTogglePin}
        className={isPinned ? styles.pinned : styles.actionButton}
      />
      <div className={styles.closeButtonArea}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.1 }}>
          <IconButton
            icon={<ChevronDownIcon />}
            label="Close toolbar"
            onClick={() => {
              if (isPinned) {
                onTogglePin();
              }
              onClose();
            }}
            className={styles.actionButton}
          />
        </motion.div>
      </div>
    </div>
  );
}
