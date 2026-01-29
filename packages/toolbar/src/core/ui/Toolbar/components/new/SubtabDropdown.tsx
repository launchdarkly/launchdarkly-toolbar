import { useId, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { SubTab, TabConfig } from './types';
import { useAnalytics } from '../../context';
import * as styles from './SubtabDropdown.module.css.ts';

interface SubtabDropdownProps {
  subtabs: TabConfig[];
  activeSubtab: SubTab | undefined;
  onSelectSubtab: (subtab: SubTab) => void;
}

export function SubtabDropdown({ subtabs, activeSubtab, onSelectSubtab }: SubtabDropdownProps) {
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();

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
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (event: React.MouseEvent, subtab: SubTab) => {
    event.stopPropagation();

    if (activeSubtab !== subtab) {
      analytics.trackSubtabChange(activeSubtab || null, subtab);
    }

    onSelectSubtab(subtab);
    setIsOpen(false);
  };

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
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
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label="Subtab selector"
        data-testid="subtab-dropdown-trigger"
      >
        <span className={styles.label}>{activeLabel}</span>
        <motion.span className={styles.chevron} animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon className={styles.chevronIcon} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.menu}
            id={listboxId}
            role="listbox"
            aria-label="Subtabs"
            data-testid="subtab-dropdown-listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {subtabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.menuItem} ${tab.id === activeSubtab ? styles.menuItemActive : ''}`}
                onClick={(e) => {
                  handleSelect(e, tab.id as SubTab);
                }}
                id={`${listboxId}-${tab.id}`}
                role="option"
                aria-selected={tab.id === activeSubtab}
                type="button"
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
