import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { ElementInfo, getElementInfo } from '../components/new/Interactive/utils/elementUtils';

/**
 * Context value for element selection functionality.
 * Provides state and actions for selecting DOM elements in the interactive mode.
 */
export interface ElementSelectionContextValue {
  /** Whether the user is currently in element selection mode */
  isSelecting: boolean;
  /** The currently selected DOM element, or null if none selected */
  selectedElement: HTMLElement | null;
  /** Extracted information about the selected element */
  selectedElementInfo: ElementInfo | null;
  /** The element currently being hovered over during selection */
  hoveredElement: HTMLElement | null;

  /** Start element selection mode */
  startSelection: () => void;
  /** Exit element selection mode without selecting an element */
  exitSelection: () => void;
  /** Select an element and exit selection mode */
  selectElement: (element: HTMLElement) => void;
  /** Clear the current selection */
  clearSelection: () => void;
  /** Set the currently hovered element (used internally by SelectionOverlay) */
  setHoveredElement: (element: HTMLElement | null) => void;
}

const ElementSelectionContext = createContext<ElementSelectionContextValue | undefined>(undefined);

export interface ElementSelectionProviderProps {
  /** Child components that will have access to the element selection context */
  children: ReactNode;
  /** Optional callback invoked when selection mode starts */
  onSelectionStart?: () => void;
  /** Optional callback invoked when selection mode ends (either by selecting or exiting) */
  onSelectionEnd?: () => void;
}

/**
 * Provider component that manages element selection state for the interactive mode.
 * Wraps components that need access to element selection functionality.
 *
 * @param props - The provider props
 * @param props.children - Child components
 * @param props.onSelectionStart - Optional callback when selection starts
 * @param props.onSelectionEnd - Optional callback when selection ends
 */
export function ElementSelectionProvider({
  children,
  onSelectionStart,
  onSelectionEnd,
}: ElementSelectionProviderProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedElementInfo, setSelectedElementInfo] = useState<ElementInfo | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  const startSelection = useCallback(() => {
    setIsSelecting(true);
    setSelectedElement(null);
    setSelectedElementInfo(null);
    setHoveredElement(null);
    onSelectionStart?.();
  }, [onSelectionStart]);

  const exitSelection = useCallback(() => {
    setIsSelecting(false);
    setHoveredElement(null);
    onSelectionEnd?.();
  }, [onSelectionEnd]);

  const selectElement = useCallback(
    (element: HTMLElement) => {
      setSelectedElement(element);
      setSelectedElementInfo(getElementInfo(element));
      setIsSelecting(false);
      setHoveredElement(null);
      onSelectionEnd?.();
    },
    [onSelectionEnd]
  );

  const clearSelection = useCallback(() => {
    setSelectedElement(null);
    setSelectedElementInfo(null);
    setIsSelecting(false);
    setHoveredElement(null);
  }, []);

  const value = useMemo<ElementSelectionContextValue>(
    () => ({
      isSelecting,
      selectedElement,
      selectedElementInfo,
      hoveredElement,
      startSelection,
      exitSelection,
      selectElement,
      clearSelection,
      setHoveredElement,
    }),
    [
      isSelecting,
      selectedElement,
      selectedElementInfo,
      hoveredElement,
      startSelection,
      exitSelection,
      selectElement,
      clearSelection,
    ]
  );

  return (
    <ElementSelectionContext.Provider value={value}>{children}</ElementSelectionContext.Provider>
  );
}

/**
 * Hook to access the element selection context.
 * Must be used within an ElementSelectionProvider.
 *
 * @returns The element selection context value
 * @throws Error if used outside of ElementSelectionProvider
 */
export function useElementSelection(): ElementSelectionContextValue {
  const context = useContext(ElementSelectionContext);
  if (context === undefined) {
    throw new Error('useElementSelection must be used within an ElementSelectionProvider');
  }
  return context;
}

