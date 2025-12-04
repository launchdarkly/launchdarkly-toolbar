import React, { useEffect, useRef } from 'react';
import { ElementSelectionProvider, useElementSelection } from '../../../context/ElementSelectionProvider';
import { useToolbarState } from '../../../context/ToolbarStateProvider';
import { SelectionOverlay } from './SelectionOverlay';
import { SelectionModeBar } from './SelectionModeBar';

interface InteractiveWrapperProps {
  children: React.ReactNode;
}

/**
 * Inner component that connects selection state to toolbar state
 * and renders the selection UI elements that need to persist when toolbar is closed
 */
function InteractiveStateConnector({ children }: { children: React.ReactNode }) {
  const { isSelecting } = useElementSelection();
  const { isExpanded, handleClose, handleCircleClick } = useToolbarState();
  const wasExpandedBeforeSelection = useRef(false);

  // When starting selection, collapse the toolbar
  useEffect(() => {
    if (isSelecting && isExpanded) {
      wasExpandedBeforeSelection.current = true;
      handleClose();
    }
  }, [isSelecting, isExpanded, handleClose]);

  // When selection ends (element selected or exit), expand the toolbar if it was expanded before
  useEffect(() => {
    if (!isSelecting && wasExpandedBeforeSelection.current) {
      handleCircleClick();
      wasExpandedBeforeSelection.current = false;
    }
  }, [isSelecting, handleCircleClick]);

  return (
    <>
      {/* Selection UI rendered via portals, persists when toolbar is closed */}
      <SelectionOverlay />
      <SelectionModeBar />
      {children}
    </>
  );
}

/**
 * Wrapper component that provides element selection context
 * and connects it to the toolbar state
 */
export function InteractiveWrapper({ children }: InteractiveWrapperProps) {
  return (
    <ElementSelectionProvider>
      <InteractiveStateConnector>{children}</InteractiveStateConnector>
    </ElementSelectionProvider>
  );
}

