import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton } from '../../components/IconButton';
import { SearchIcon, SyncIcon, ChevronDownIcon, ChevronUpIcon, PersonPassword } from '../../components/icons';
import { useToolbarUIContext } from '../../context/ToolbarUIProvider';

import * as styles from '../Header.css';
import { useAuthContext } from '../../context/AuthProvider';
import { internalClientTest } from '../../../../../flags/toolbarFlags';

interface ActionButtonsProps {
  searchIsExpanded: boolean;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  onRefresh: () => void;
  onOpenConfig?: () => void;
  showSearchButton: boolean;
  showRefreshButton: boolean;
}

export function ActionButtons(props: ActionButtonsProps) {
  const {
    searchIsExpanded,
    setSearchIsExpanded,
    onClose,
    onRefresh,
    onOpenConfig,
    showSearchButton,
    showRefreshButton,
  } = props;
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationCount, setRotationCount] = useState(0);
  const { position } = useToolbarUIContext();
  const isTop = position.startsWith('top-');

  const { authenticated, loading } = useAuthContext();
  // Use toolbar flag function (Gonfalon-style pattern)
  // TODO: Remove this
  const showSearchIcon = internalClientTest();
  console.log('🚀 ~ ActionButtons ~ showSearchIcon:', showSearchIcon);

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
      {showSearchButton && showSearchIcon && (
        <AnimatePresence mode="wait">
          {!searchIsExpanded && (
            <motion.div
              key="search-button"
              className={styles.searchButtonArea}
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
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
      {onOpenConfig && !authenticated && !loading && (
        <IconButton
          icon={<PersonPassword />}
          label="Configuration"
          onClick={onOpenConfig}
          className={styles.actionButton}
        />
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
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className={styles.closeButtonArea}
        tabIndex={-1}
      >
        <IconButton
          icon={isTop ? <ChevronUpIcon /> : <ChevronDownIcon />}
          label="Close toolbar"
          onClick={onClose}
          className={styles.actionButton}
        />
      </motion.div>
    </div>
  );
}
