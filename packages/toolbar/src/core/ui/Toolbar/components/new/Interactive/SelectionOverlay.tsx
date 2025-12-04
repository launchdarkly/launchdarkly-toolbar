import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useElementSelection } from '../../../context/ElementSelectionProvider';
import { isToolbarElement, getElementDisplayPath, getElementRect } from './utils/elementUtils';
import { throttle } from './utils/throttle';
import { Z_INDEX } from '../../../../constants/zIndex';

interface HighlightBox {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
}

export function SelectionOverlay() {
  const { isSelecting, selectedElement, hoveredElement, setHoveredElement, selectElement } = useElementSelection();

  const [highlightBox, setHighlightBox] = useState<HighlightBox | null>(null);
  const [selectedBox, setSelectedBox] = useState<HighlightBox | null>(null);

  // Update highlight box when hovered element changes
  useEffect(() => {
    if (hoveredElement && isSelecting) {
      const rect = getElementRect(hoveredElement);
      setHighlightBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        label: getElementDisplayPath(hoveredElement),
      });
    } else {
      setHighlightBox(null);
    }
  }, [hoveredElement, isSelecting]);

  // Update selected element box
  useEffect(() => {
    if (selectedElement) {
      const rect = getElementRect(selectedElement);
      setSelectedBox({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        label: getElementDisplayPath(selectedElement),
      });

      // Update position on scroll/resize
      const updatePosition = () => {
        const newRect = getElementRect(selectedElement);
        setSelectedBox({
          top: newRect.top,
          left: newRect.left,
          width: newRect.width,
          height: newRect.height,
          label: getElementDisplayPath(selectedElement),
        });
      };

      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    } else {
      setSelectedBox(null);
    }
  }, [selectedElement]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isSelecting) return;

      const target = event.target as HTMLElement;

      // Ignore toolbar elements
      if (isToolbarElement(target)) {
        setHoveredElement(null);
        return;
      }

      setHoveredElement(target);
    },
    [isSelecting, setHoveredElement],
  );

  // Throttle mouse move handler to ~60fps for performance
  // delay is in milliseconds
  const throttledMouseMove = useMemo(() => throttle(handleMouseMove, 16), [handleMouseMove]);

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!isSelecting) return;

      const target = event.target as HTMLElement;

      // Ignore toolbar elements
      if (isToolbarElement(target)) {
        return;
      }

      // Prevent default behavior and stop propagation
      event.preventDefault();
      event.stopPropagation();

      selectElement(target);
    },
    [isSelecting, selectElement],
  );

  // Set up event listeners when in selection mode
  useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', throttledMouseMove, true);
      document.addEventListener('click', handleClick, true);

      // Change cursor to crosshair
      document.body.style.cursor = 'crosshair';

      return () => {
        document.removeEventListener('mousemove', throttledMouseMove, true);
        document.removeEventListener('click', handleClick, true);
        document.body.style.cursor = '';
      };
    }
  }, [isSelecting, throttledMouseMove, handleClick]);

  // Screen reader announcement for selection mode
  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    if (isSelecting) {
      setAnnouncement('Selection mode active. Click an element to select it.');
    } else if (selectedElement) {
      setAnnouncement('Element selected.');
    } else {
      setAnnouncement('');
    }
  }, [isSelecting, selectedElement]);

  // Don't render anything if not selecting and no selected element
  if (!isSelecting && !selectedElement) {
    return null;
  }

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: isSelecting ? 'none' : 'none',
    zIndex: Z_INDEX.TOOLBAR - 1,
  };

  const highlightStyles: React.CSSProperties = highlightBox
    ? {
        position: 'fixed',
        top: highlightBox.top,
        left: highlightBox.left,
        width: highlightBox.width,
        height: highlightBox.height,
        border: '2px solid #405BFF',
        borderRadius: '2px',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        zIndex: Z_INDEX.TOOLBAR,
      }
    : {};

  const selectedStyles: React.CSSProperties = selectedBox
    ? {
        position: 'fixed',
        top: selectedBox.top,
        left: selectedBox.left,
        width: selectedBox.width,
        height: selectedBox.height,
        border: '2px solid #3DD68C',
        borderRadius: '2px',
        pointerEvents: 'none',
        boxSizing: 'border-box',
        zIndex: Z_INDEX.TOOLBAR,
      }
    : {};

  const labelStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-24px',
    left: '0',
    backgroundColor: '#405BFF',
    color: 'white',
    padding: '2px 8px',
    fontSize: '12px',
    fontFamily: 'monospace',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };

  const selectedLabelStyles: React.CSSProperties = {
    ...labelStyles,
    backgroundColor: '#3DD68C',
    color: '#1a1a1a',
  };

  // Visually hidden but accessible styles for screen reader announcements
  const srOnlyStyles: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  };

  return createPortal(
    <>
      {/* ARIA live region for screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" style={srOnlyStyles as any}>
        {announcement}
      </div>

      {isSelecting && <div style={overlayStyles as any} />}

      {/* Hover highlight (blue) */}
      {highlightBox && isSelecting && (
        <div style={highlightStyles as any}>
          <div style={labelStyles as any}>{highlightBox.label}</div>
        </div>
      )}

      {/* Selected element highlight (green) */}
      {selectedBox && !isSelecting && (
        <div style={selectedStyles as any}>
          <div style={selectedLabelStyles as any}>{selectedBox.label}</div>
        </div>
      )}
    </>,
    document.body,
  );
}
