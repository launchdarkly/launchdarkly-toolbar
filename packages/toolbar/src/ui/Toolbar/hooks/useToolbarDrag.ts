import { useCallback } from 'react';

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
}

export function useToolbarDrag({ enabled, onDragEnd, elementRef }: UseToolbarDragOptions): UseToolbarDragReturn {
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (!enabled || !elementRef.current) return;

      event.preventDefault();

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

        const offset: Position = {
          x: mouseEvent.clientX - startPosition.x,
          y: mouseEvent.clientY - startPosition.y,
        };

        const newPosition: Position = {
          x: initialPosition.x + offset.x,
          y: initialPosition.y + offset.y,
        };

        elementRef.current.style.left = `${newPosition.x}px`;
        elementRef.current.style.top = `${newPosition.y}px`;
      };

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
        document.removeEventListener('mousemove', updateElementPosition);
        document.removeEventListener('mouseup', handleDragComplete);

        resetElementStyles();
        onDragEnd(upEvent.clientX);
      };

      document.addEventListener('mousemove', updateElementPosition);
      document.addEventListener('mouseup', handleDragComplete);
    },
    [enabled, onDragEnd, elementRef],
  );

  return {
    handleMouseDown,
  };
}
