import { useCallback, useRef } from 'react';

import { DRAG_CONSTANTS } from '../constants/animations';

interface Position {
  x: number;
  y: number;
}

interface UseToolbarDragOptions {
  enabled: boolean;
  onDragEnd: (clientX: number) => void;
  elementRef: React.RefObject<HTMLDivElement | null>;
}

interface UseToolbarDragReturn {
  handleMouseDown: (event: React.MouseEvent) => void;
  isDragging: () => boolean;
}

export function useToolbarDrag({ enabled, onDragEnd, elementRef }: UseToolbarDragOptions): UseToolbarDragReturn {
  // Track whether we've actually dragged (moved beyond threshold) vs just clicked
  const draggedRef = useRef(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!enabled || !elementRef.current) return;

      // Capture initial mouse and element positions
      const startPosition: Position = {
        x: event.clientX,
        y: event.clientY,
      };

      const boundingRect = elementRef.current.getBoundingClientRect();
      const initialPosition: Position = {
        x: boundingRect.left,
        y: boundingRect.top,
      };

      const updateElementPosition = (mouseEvent: MouseEvent): void => {
        if (!elementRef.current) return;

        // Calculate how far the mouse has moved from the initial position
        const offset: Position = {
          x: mouseEvent.clientX - startPosition.x,
          y: mouseEvent.clientY - startPosition.y,
        };

        const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y);

        // Only consider it a "drag" if mouse moved beyond threshold
        // This prevents tiny movements during clicks from being treated as drags
        if (distance > DRAG_CONSTANTS.THRESHOLD_PIXELS && !draggedRef.current) {
          draggedRef.current = true;
          // Prevent text selection while dragging
          document.addEventListener('selectstart', preventDefault);
        }

        // Only update element position if we're actually dragging
        if (draggedRef.current) {
          const newPosition: Position = {
            x: initialPosition.x + offset.x,
            y: initialPosition.y + offset.y,
          };

          // Move the element by directly setting CSS position
          elementRef.current.style.left = `${newPosition.x}px`;
          elementRef.current.style.top = `${newPosition.y}px`;
        }
      };

      const preventDefault = (e: Event) => e.preventDefault();

      // Reset all positioning styles to return element to its original CSS-controlled position
      const resetElementStyles = () => {
        if (elementRef.current) {
          elementRef.current.style.left = '';
          elementRef.current.style.top = '';
          elementRef.current.style.right = '';
          elementRef.current.style.bottom = '';
          elementRef.current.style.transform = '';
          elementRef.current.style.zIndex = '';
        }
      };

      const handleDragComplete = (upEvent: MouseEvent) => {
        // Clean up event listeners
        document.removeEventListener('mousemove', updateElementPosition);
        document.removeEventListener('mouseup', handleDragComplete);
        document.removeEventListener('selectstart', preventDefault);

        // Reset element to original position (CSS will handle final positioning)
        resetElementStyles();

        // Only call onDragEnd if we actually dragged (moved beyond threshold)
        if (draggedRef.current) {
          onDragEnd(upEvent.clientX);
        }

        // Keep drag state for a brief moment to let click handler check it
        // This prevents the click event from firing immediately after a drag
        setTimeout(() => {
          draggedRef.current = false;
        }, DRAG_CONSTANTS.CLICK_RESET_DELAY_MS);
      };

      // Set up document-level event listeners for drag tracking
      // Using document ensures we track mouse movement even outside the element
      document.addEventListener('mousemove', updateElementPosition);
      document.addEventListener('mouseup', handleDragComplete);
    },
    [enabled, onDragEnd, elementRef],
  );

  const isDragging = useCallback(() => draggedRef.current, []);

  return {
    handleMouseDown,
    isDragging,
  };
}
