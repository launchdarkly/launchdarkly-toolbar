import { useEffect, useCallback } from 'react';

/**
 * Global keyboard navigation for the toolbar
 * Enables seamless navigation across all sections using arrow keys and Tab
 */
export function useToolbarKeyboardNavigation(toolbarRef: React.RefObject<HTMLElement | null>) {
  const getFocusableElements = useCallback(() => {
    if (!toolbarRef.current) return [];

    const selector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="row"]',
    ].join(', ');

    return Array.from(toolbarRef.current.querySelectorAll(selector)) as HTMLElement[];
  }, [toolbarRef]);

  const focusElement = useCallback((direction: 'next' | 'previous') => {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

    if (currentIndex === -1) return;

    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusableElements.length) {
        nextIndex = 0; // Wrap to start
      }
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
        nextIndex = focusableElements.length - 1; // Wrap to end
      }
    }

    focusableElements[nextIndex]?.focus();
  }, [getFocusableElements]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't interfere if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.getAttribute('role') === 'textbox'
      ) {
        return;
      }

      // Don't interfere if a popover/dropdown is open (listbox inside a popover)
      const openPopover = document.querySelector('[data-trigger][data-open="true"]');
      if (openPopover && target.closest('[role="listbox"]')) {
        return;
      }

      const isInGrid = target.closest('[role="grid"]');

      switch (e.key) {
        case 'Tab':
          // Let Tab work normally - it already navigates between sections
          break;

        case 'ArrowDown':
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'ArrowRight': {
          // If NOT in a grid, use manual focus management for navigation
          if (!isInGrid) {
            e.preventDefault();
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
              focusElement('next');
            } else {
              focusElement('previous');
            }
          }
          // If IN a grid, let GridList handle it naturally (don't preventDefault)
          break;
        }

        case '/':
          // Focus search input with '/' shortcut (common pattern)
          if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !isInGrid) {
            e.preventDefault();
            const searchInput = toolbarRef.current?.querySelector(
              'input[type="search"], input[placeholder*="Search"]',
            ) as HTMLInputElement;
            if (searchInput) {
              searchInput.focus();
              searchInput.select();
            }
          }
          break;

        case 'Escape':
          // Unfocus search input or close any open dialogs
          if (target.tagName === 'INPUT' && target.getAttribute('type') === 'search') {
            e.preventDefault();
            (target as HTMLInputElement).blur();
            // Focus the toolbar root
            toolbarRef.current?.focus();
          }
          break;

        default:
          break;
      }
    },
    [toolbarRef, focusElement],
  );

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    toolbar.addEventListener('keydown', handleKeyDown);

    return () => {
      toolbar.removeEventListener('keydown', handleKeyDown);
    };
  }, [toolbarRef, handleKeyDown]);
}
