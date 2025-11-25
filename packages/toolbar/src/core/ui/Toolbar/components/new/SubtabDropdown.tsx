import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { FilterTuneIcon } from '../icons/FilterTuneIcon';
import { SubTab, TabConfig } from './types';
import * as styles from './SubtabDropdown.module.css.ts';

interface SubtabDropdownProps {
  subtabs: TabConfig[];
  activeSubtab: SubTab | undefined;
  onSelectSubtab: (subtab: SubTab) => void;
}

export function SubtabDropdown({ subtabs, activeSubtab, onSelectSubtab }: SubtabDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTab = subtabs.find((tab) => tab.id === activeSubtab);
  const activeLabel = activeTab?.label || 'Select';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (subtab: SubTab) => {
    onSelectSubtab(subtab);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.label}>{activeLabel}</span>
        <motion.span
          className={styles.chevron}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className={styles.chevronIcon} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.menu}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {subtabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.menuItem} ${tab.id === activeSubtab ? styles.menuItemActive : ''}`}
                onClick={() => handleSelect(tab.id as SubTab)}
                role="menuitem"
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

