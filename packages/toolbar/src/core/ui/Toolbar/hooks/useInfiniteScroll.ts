import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  /**
   * Callback to load more items
   */
  onLoadMore: () => void | Promise<void>;
  /**
   * Whether there are more items to load
   */
  hasMore: boolean;
  /**
   * Whether currently loading more items
   */
  isLoading: boolean;
  /**
   * Distance from bottom in pixels to trigger load more (default: 200)
   */
  threshold?: number;
  /**
   * Whether the hook is enabled (default: true)
   */
  enabled?: boolean;
}

interface UseInfiniteScrollReturn<T extends HTMLElement> {
  ref: (node: T | null) => void;
  getElement: () => T | null;
}

/**
 * Hook for implementing infinite scroll in a scrollable container.
 * Triggers onLoadMore when the user scrolls near the bottom.
 *
 * @returns An object with a callback ref and getElement function
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>(
  options: UseInfiniteScrollOptions,
): UseInfiniteScrollReturn<T> {
  const { onLoadMore, hasMore, isLoading, threshold = 200, enabled = true } = options;
  const scrollRef = useRef<T | null>(null);
  const loadingRef = useRef(false);
  const listenerAttachedRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (!enabled || !hasMore || isLoading || loadingRef.current) {
      return;
    }

    const element = scrollRef.current;
    if (!element) {
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = element;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < threshold) {
      loadingRef.current = true;
      Promise.resolve(onLoadMore()).finally(() => {
        loadingRef.current = false;
      });
    }
  }, [enabled, hasMore, isLoading, threshold, onLoadMore]);

  // Cleanup effect for when dependencies change
  useEffect(() => {
    const element = scrollRef.current;
    if (!element || !enabled) {
      if (element && listenerAttachedRef.current) {
        element.removeEventListener('scroll', handleScroll);
        listenerAttachedRef.current = false;
      }
      return;
    }

    // Only add listener if not already attached
    if (!listenerAttachedRef.current) {
      element.addEventListener('scroll', handleScroll, { passive: true });
      listenerAttachedRef.current = true;
    }

    return () => {
      if (element && listenerAttachedRef.current) {
        element.removeEventListener('scroll', handleScroll);
        listenerAttachedRef.current = false;
      }
    };
  }, [handleScroll, enabled]);

  // Return a callback ref that handles node mounting/unmounting
  const callbackRef = useCallback(
    (node: T | null) => {
      // Cleanup previous element
      if (scrollRef.current && listenerAttachedRef.current) {
        scrollRef.current.removeEventListener('scroll', handleScroll);
        listenerAttachedRef.current = false;
      }

      // Store new element
      scrollRef.current = node;

      // Attach listener to new element
      if (node && enabled) {
        node.addEventListener('scroll', handleScroll, { passive: true });
        listenerAttachedRef.current = true;
      }
    },
    [handleScroll, enabled],
  );

  const getElement = useCallback(() => scrollRef.current, []);

  return { ref: callbackRef, getElement };
}
