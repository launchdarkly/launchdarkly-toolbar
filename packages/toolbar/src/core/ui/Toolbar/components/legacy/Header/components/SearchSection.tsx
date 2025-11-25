import { Dispatch, SetStateAction } from 'react';
import { motion } from 'motion/react';
import { Group, Input, SearchField } from '@launchpad-ui/components';
import { IconButton } from '../../../IconButton';
import { CancelCircleIcon } from '../../../icons';

import * as styles from '../Header.css';

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

  const handleClear = () => {
    if (searchTerm.trim()) {
      // If there's text, just clear it (keep search expanded)
      onSearch('');
    } else {
      // If no text, collapse the search
      setSearchIsExpanded(false);
    }
  };

  return (
    <motion.div
      className={styles.searchFieldWrapper}
      initial={{ scale: 0.9, opacity: 0, x: -20 }}
      animate={{ scale: 1, opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
      onBlur={handleBlur}
    >
      <SearchField aria-label="Search" data-theme="dark" className={styles.searchField}>
        <Group className={styles.searchGroup}>
          <Input
            // oxlint-disable-next-line no-autofocus
            autoFocus
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              onSearch(e.target.value);
            }}
          />
          <IconButton icon={<CancelCircleIcon />} label="Clear" onClick={handleClear} size="medium" />
        </Group>
      </SearchField>
    </motion.div>
  );
}
