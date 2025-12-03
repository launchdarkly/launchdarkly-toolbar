import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { useDevServerContext, useProjectContext } from '../../../context';
import { LogoSection, EnvironmentLabel, ActionButtons, SearchSection } from './components';
import { ToolbarMode } from '../../../types';
import { ConnectionStatus } from '../../ConnectionStatus';
import * as styles from './Header.css';

export interface HeaderProps {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onClose: () => void;
  searchIsExpanded: boolean;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
  mode: ToolbarMode;
  onMouseDown?: (event: React.MouseEvent) => void;
  onOpenConfig?: () => void;
}

export function Header(props: HeaderProps) {
  const { onClose, onSearch, searchTerm, searchIsExpanded, setSearchIsExpanded, mode, onMouseDown, onOpenConfig } =
    props;

  const { state, refresh } = useDevServerContext();
  const { connectionStatus } = state;
  const isConnected = connectionStatus === 'connected';

  const isDevServer = mode === 'dev-server';
  const showSearch = isDevServer ? isConnected : true;
  const showRefresh = isDevServer;
  const showConnectionStatus = isDevServer;

  const { projectKey, loading: loadingProjectKey } = useProjectContext();

  return (
    <>
      <div className={styles.header}>
        <LogoSection onMouseDown={onMouseDown} />

        <div className={styles.centerSection}>
          {(projectKey || showSearch) && (
            <AnimatePresence mode="wait">
              {!searchIsExpanded ? (
                projectKey || loadingProjectKey ? (
                  <motion.div
                    key="environment"
                    className={styles.environmentWrapper}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EnvironmentLabel label={loadingProjectKey ? 'Loading Project...' : projectKey} />
                  </motion.div>
                ) : null
              ) : (
                <motion.div
                  key="search"
                  className={styles.searchWrapper}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ duration: 0.15, ease: 'easeIn' }}
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
          onOpenConfig={onOpenConfig}
          showSearchButton={showSearch}
          showRefreshButton={showRefresh}
        />
      </div>
      {showConnectionStatus && <ConnectionStatus status={connectionStatus} lastSyncTime={state.lastSyncTime} />}
    </>
  );
}
