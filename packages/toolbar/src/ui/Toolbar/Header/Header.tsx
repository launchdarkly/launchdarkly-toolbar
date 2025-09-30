import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as styles from './Header.css';
import { LogoSection, EnvironmentLabel, SearchSection, ActionButtons } from './components';
import { useDevServerContext } from '../context/DevServerProvider';
import { ConnectionStatus } from '../components';
import { ToolbarMode } from '../types/toolbar';
import { useAnalytics } from '../context';

export interface HeaderProps {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onClose: () => void;
  searchIsExpanded: boolean;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
  label: string;
  mode: ToolbarMode;
}

export function Header(props: HeaderProps) {
  const { onClose, onSearch, searchTerm, searchIsExpanded, setSearchIsExpanded, label, mode } = props;

  const { state, refresh } = useDevServerContext();
  const { connectionStatus } = state;
  const isConnected = connectionStatus === 'connected';
  const analytics = useAnalytics();

  const isDevServer = mode === 'dev-server';
  const showEnvironment = isDevServer && isConnected;
  const showSearch = isDevServer ? isConnected : true;
  const showRefresh = isDevServer;
  const showConnectionStatus = isDevServer;

  const handleSearch = (term: string) => {
    onSearch(term);
    analytics.trackSearch(term);
  };

  return (
    <>
      <div className={styles.header}>
        <LogoSection />

        <div className={styles.centerSection}>
          {(showEnvironment || showSearch) && (
            <AnimatePresence mode="wait">
              {!searchIsExpanded ? (
                showEnvironment ? (
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
                ) : null
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
                    onSearch={handleSearch}
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
          showSearchButton={showSearch}
          showRefreshButton={showRefresh}
        />
      </div>
      {showConnectionStatus && <ConnectionStatus status={connectionStatus} lastSyncTime={state.lastSyncTime} />}
    </>
  );
}
