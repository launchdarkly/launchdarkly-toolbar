import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { ChevronDownIcon } from './icons';
import * as styles from './Select.css';

export interface SelectOption {
  id: string;
  label: string;
  value?: any;
}

export interface SelectProps {
  selectedKey?: string | null;
  onSelectionChange?: (key: string | null) => void;
  'aria-label'?: string;
  placeholder?: string;
  'data-theme'?: 'dark' | 'light';
  className?: string;
  isDisabled?: boolean;
  children?: ReactNode;
  options: SelectOption[];
}

export function Select(props: SelectProps) {
  const {
    selectedKey,
    onSelectionChange,
    'aria-label': ariaLabel,
    placeholder,
    'data-theme': dataTheme = 'dark',
    className,
    isDisabled = false,
    options,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((option) => option.id === selectedKey);

  const handleToggle = useCallback(() => {
    if (isDisabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isDisabled, isOpen]);

  const handleSelect = useCallback(
    (optionId: string) => {
      onSelectionChange?.(optionId);
      setIsOpen(false);
      setFocusedIndex(-1);
      // Return focus to trigger
      triggerRef.current?.focus();
    },
    [onSelectionChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (isDisabled) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else {
            setFocusedIndex((prev) => (prev + 1) % options.length);
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(options.length - 1);
          } else {
            setFocusedIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
          }
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setFocusedIndex(0);
          } else if (focusedIndex >= 0 && options[focusedIndex]) {
            handleSelect(options[focusedIndex].id);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          triggerRef.current?.focus();
          break;
      }
    },
    [isDisabled, isOpen, focusedIndex, options, handleSelect],
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const path = event.composedPath();
      const clickedInsideSelect = path.some((el) => (el as HTMLElement).id === selectRef.current?.id);
      if (listRef.current && !clickedInsideSelect) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, listRef]);

  const displayValue = selectedOption?.label || placeholder || 'Select option';

  // Create accessible name that combines selected value with aria-label for compatibility with e2e tests
  const accessibleName =
    selectedOption?.label && ariaLabel ? `${selectedOption.label} ${ariaLabel}` : ariaLabel || displayValue;

  return (
    <div
      ref={selectRef}
      id="select-container"
      className={`${styles.selectContainer} ${className || ''}`}
      data-theme={dataTheme}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${isDisabled ? styles.disabled : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={accessibleName}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isDisabled}
      >
        <span className={`${styles.value} ${!selectedOption ? styles.placeholder : ''}`}>{displayValue}</span>
        <ChevronDownIcon className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <ul ref={listRef} className={styles.list} role="listbox" aria-label={ariaLabel}>
            {options.map((option, index) => (
              <li
                key={option.id}
                className={`${styles.option} ${focusedIndex === index ? styles.focused : ''} ${
                  selectedKey === option.id ? styles.selected : ''
                }`}
                role="option"
                aria-selected={selectedKey === option.id}
                onClick={() => handleSelect(option.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(option.id);
                  }
                }}
                onFocus={() => setFocusedIndex(index)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
