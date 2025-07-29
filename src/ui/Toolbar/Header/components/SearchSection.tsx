import { Dispatch, SetStateAction } from 'react';
import { motion } from 'motion/react';
import { Group, Input, SearchField } from '@launchpad-ui/components';
import { IconButton } from '../../components/IconButton';
import { CancelCircleIcon, SearchIcon } from '../../components/icons';

import styles from '../Header.module.css';

interface SearchSectionProps {
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  setSearchIsExpanded: Dispatch<SetStateAction<boolean>>;
}

export function SearchSection(props: SearchSectionProps) {
  const { searchTerm, onSearch, setSearchIsExpanded } = props;

  const handleBlur = () => {
    // Only close the search if the input is empty
    if (!searchTerm.trim()) {
      setSearchIsExpanded(false);
    }
  };

  return (
    <motion.div
      className={styles.searchFieldWrapper}
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <SearchField aria-label="Search" data-theme="dark" onBlur={handleBlur} className={styles.searchField}>
        <Group className={styles.searchGroup}>
          <SearchIcon className={styles.icon} />
          <Input
            // oxlint-disable-next-line no-autofocus
            autoFocus
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
          />
          <IconButton icon={<CancelCircleIcon />} label="Clear" onClick={() => onSearch('')} />
        </Group>
      </SearchField>
    </motion.div>
  );
}
