import { useCallback, useRef } from 'react';

import { DRAG_CONSTANTS } from '../constants/animations';

interface Position {
  x: number;
  y: number;
}

interface UseToolbarDragOptions {
  enabled: boolean;
  onDragEnd: (centerX: number, centerY: number) => void;
  elementRef: React.RefObject<HTMLDivElement | null>;
}

interface UseToolbarDragReturn {
  handleMouseDown: (event: React.MouseEvent) => void;
  isDragging: () => boolean;
}

export function useToolbarDrag({ enabled, onDragEnd, elementRef }: UseToolbarDragOptions): UseToolbarDragReturn {
  // Track whether we've actually dragged (moved beyond threshold) vs just clicked
  const draggedRef = useRef(false);
  // Track velocity for momentum/flick
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastPositionRef = useRef({ x: 0, y: 0, time: 0 });
  // Track ongoing animation so we can cancel it
  const animationRef = useRef<any>(null);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!enabled || !elementRef.current) return;

      // Reset velocity tracking
      velocityRef.current = { x: 0, y: 0 };
      lastPositionRef.current = { x: event.clientX, y: event.clientY, time: Date.now() };

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

        // Calculate velocity for momentum
        const now = Date.now();
        const timeDelta = now - lastPositionRef.current.time;
        if (timeDelta > 0) {
          velocityRef.current = {
            x: (mouseEvent.clientX - lastPositionRef.current.x) / timeDelta,
            y: (mouseEvent.clientY - lastPositionRef.current.y) / timeDelta,
          };
        }
        lastPositionRef.current = { x: mouseEvent.clientX, y: mouseEvent.clientY, time: now };

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
          elementRef.current.style.transformOrigin = '';
          elementRef.current.style.transition = '';
          elementRef.current.style.zIndex = '';
        }
      };

      const handleDragComplete = (upEvent: MouseEvent) => {
        // Clean up event listeners
        document.removeEventListener('mousemove', updateElementPosition);
        document.removeEventListener('mouseup', handleDragComplete);
        document.removeEventListener('selectstart', preventDefault);

        // Calculate the center of the element and apply momentum
        let centerX = upEvent.clientX;
        let centerY = upEvent.clientY;

        if (draggedRef.current && elementRef.current) {
          const rect = elementRef.current.getBoundingClientRect();
          centerX = rect.left + rect.width / 2;
          centerY = rect.top + rect.height / 2;

          // Apply momentum: project where the toolbar would end up based on velocity
          const momentumMultiplier = 200; // Adjust for more/less momentum
          const projectedX = centerX + velocityRef.current.x * momentumMultiplier;
          const projectedY = centerY + velocityRef.current.y * momentumMultiplier;

          // Clamp to screen bounds
          const clampedX = Math.max(rect.width / 2, Math.min(window.innerWidth - rect.width / 2, projectedX));
          const clampedY = Math.max(rect.height / 2, Math.min(window.innerHeight - rect.height / 2, projectedY));

          // Determine target corner based on momentum-adjusted position
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const isLeft = clampedX < screenWidth / 2;
          const isTop = clampedY < screenHeight / 2;

          // Calculate target corner position with 20px padding (matching CSS)
          const CORNER_PADDING = 20;
          const targetX = isLeft ? CORNER_PADDING : screenWidth - rect.width - CORNER_PADDING;
          const targetY = isTop ? CORNER_PADDING : screenHeight - rect.height - CORNER_PADDING;

          // Update CSS position class before animation to prevent layout animation conflicts
          onDragEnd(clampedX, clampedY);

          // Animate from drag release position to target corner using CSS transitions
          elementRef.current.style.transition =
            'left 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          void elementRef.current.offsetHeight; // Force reflow
          elementRef.current.style.left = `${targetX}px`;
          elementRef.current.style.top = `${targetY}px`;

          const handleTransitionEnd = (e: TransitionEvent) => {
            if (e.propertyName === 'left' || e.propertyName === 'top') {
              elementRef.current?.removeEventListener('transitionend', handleTransitionEnd);
              resetElementStyles();
            }
          };

          elementRef.current.addEventListener('transitionend', handleTransitionEnd);

          animationRef.current = {
            stop: () => {
              elementRef.current?.removeEventListener('transitionend', handleTransitionEnd);
            },
          };
        } else {
          // If not dragged, just reset immediately
          resetElementStyles();
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
