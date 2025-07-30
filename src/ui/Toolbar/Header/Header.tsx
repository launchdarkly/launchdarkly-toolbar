import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import styles from './Header.module.css';
import { LogoSection, EnvironmentLabel, SearchSection, ActionButtons } from './components';
import { useToolbarContext } from '../context/LaunchDarklyToolbarProvider';
import { ConnectionStatus } from '../components/ConnectionStatus';

export interface HeaderProps {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onClose: () => void;
  searchIsExpanded: boolean;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
  label: string;
}

export function Header(props: HeaderProps) {
  const { onClose, onSearch, searchTerm, searchIsExpanded, setSearchIsExpanded, label } = props;

  const { state, refresh } = useToolbarContext();
  const { connectionStatus } = state;
  const isConnected = connectionStatus === 'connected';

  return (
    <>
      <div className={styles.header}>
        <LogoSection />

        <div className={styles.centerSection}>
          {isConnected && (
            <AnimatePresence mode="wait">
              {!searchIsExpanded ? (
                <motion.div
                  key="environment"
                  className={styles.environmentWrapper}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <EnvironmentLabel label={label} />
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  className={styles.searchWrapper}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <SearchSection
                    searchTerm={searchTerm}
                    onSearch={onSearch}
                    setSearchIsExpanded={setSearchIsExpanded}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <ActionButtons
          searchIsExpanded={searchIsExpanded}
          setSearchIsExpanded={setSearchIsExpanded}
          onClose={onClose}
          onRefresh={refresh}
          showSearchButton={isConnected}
        />
      </div>
      <ConnectionStatus status={connectionStatus} lastSyncTime={state.lastSyncTime} />
    </>
  );
}
