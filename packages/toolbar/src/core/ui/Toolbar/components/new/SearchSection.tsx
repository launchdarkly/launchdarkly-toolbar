import { Dispatch, SetStateAction } from 'react';
import { Group, Input, SearchField } from '@launchpad-ui/components';
import { IconButton } from '../../../Buttons/IconButton';
import { CancelCircleIcon } from '../icons';
import * as styles from './SearchSection.module.css';

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
    <div className={styles.searchFieldWrapper} onBlur={handleBlur}>
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
            onKeyDown={(e) => {
              // Stop propagation to prevent parent app keyboard shortcuts from interfering
              e.stopPropagation();
            }}
            onKeyUp={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
          />
          <IconButton icon={<CancelCircleIcon />} label="Clear" onClick={handleClear} size="medium" />
        </Group>
      </SearchField>
    </div>
  );
}
