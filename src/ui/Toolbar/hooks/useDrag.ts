import { useCallback, useState } from 'react';

interface UseDragOptions {
  enabled: boolean;
  onDragEnd: (clientX: number) => void;
  elementRef: React.RefObject<HTMLDivElement | null>;
}

interface UseDragReturn {
  isDragging: boolean;
  handleMouseDown: (event: React.MouseEvent) => void;
}

export function useDrag({ enabled, onDragEnd, elementRef }: UseDragOptions): UseDragReturn {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!enabled || !elementRef.current) return;
    
    event.preventDefault();
    const startPos = { x: event.clientX, y: event.clientY };
    setIsDragging(true);
    
    // Capture the element's current visual position to prevent flashing
    const rect = elementRef.current.getBoundingClientRect();
    const initialLeft = rect.left;
    const initialTop = rect.top;
    
    // Override CSS positioning temporarily and position at current location
    elementRef.current.style.left = `${initialLeft}px`;
    elementRef.current.style.top = `${initialTop}px`;
    elementRef.current.style.right = 'auto';
    elementRef.current.style.bottom = 'auto';
    elementRef.current.style.transform = 'none';
    elementRef.current.style.zIndex = '1001';
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!elementRef.current) return;
      
      // Calculate offset from drag start
      const offsetX = moveEvent.clientX - startPos.x;
      const offsetY = moveEvent.clientY - startPos.y;
      
      // Apply new position based on initial position + mouse offset
      const newX = initialLeft + offsetX;
      const newY = initialTop + offsetY;
      
      elementRef.current.style.left = `${newX}px`;
      elementRef.current.style.top = `${newY}px`;
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      setIsDragging(false);
      
      // Remove global listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Reset all inline styles to let CSS classes take over
      if (elementRef.current) {
        elementRef.current.style.left = '';
        elementRef.current.style.top = '';
        elementRef.current.style.right = '';
        elementRef.current.style.bottom = '';
        elementRef.current.style.transform = '';
        elementRef.current.style.zIndex = '';
      }
      
      // Call the drag end callback with the final mouse position
      onDragEnd(upEvent.clientX);
    };
    
    // Add global mouse move and mouse up listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [enabled, onDragEnd, elementRef]);

  return {
    isDragging,
    handleMouseDown,
  };
}