import { useEffect, RefObject } from 'react';

/**
 * Hook that detects clicks outside of the specified element(s) and calls the handler.
 *
 * @param refs - Single ref or array of refs to elements that should be considered "inside"
 * @param handler - Callback to execute when clicking outside
 * @param enabled - Whether the listener is active (default: true)
 *
 * @example
 * // Single ref
 * const dropdownRef = useRef<HTMLDivElement>(null);
 * useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);
 *
 * @example
 * // Multiple refs (e.g., dropdown + trigger button)
 * const dropdownRef = useRef<HTMLDivElement>(null);
 * const triggerRef = useRef<HTMLButtonElement>(null);
 * useClickOutside([dropdownRef, triggerRef], () => setIsOpen(false), isOpen);
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      const refsArray = Array.isArray(refs) ? refs : [refs];

      // Check if click is outside all provided refs
      const isOutside = refsArray.every((ref) => {
        return ref.current && !ref.current.contains(event.target as Node);
      });

      if (isOutside) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refs, handler, enabled]);
}

/**
 * Hook that handles escape key press to close popovers/modals.
 *
 * @param handler - Callback to execute when Escape is pressed
 * @param enabled - Whether the listener is active (default: true)
 *
 * @example
 * useEscapeKey(() => setIsOpen(false), isOpen);
 */
export function useEscapeKey(handler: () => void, enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handler, enabled]);
}

/**
 * Combined hook for common popover behavior (click outside + escape key).
 *
 * @param refs - Ref(s) to consider as "inside"
 * @param handler - Callback to execute when closing
 * @param enabled - Whether the listeners are active
 *
 * @example
 * const popoverRef = useRef<HTMLDivElement>(null);
 * usePopoverDismiss(popoverRef, () => setIsOpen(false), isOpen);
 */
export function usePopoverDismiss(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled: boolean = true,
): void {
  useClickOutside(refs, handler, enabled);
  useEscapeKey(handler, enabled);
}
