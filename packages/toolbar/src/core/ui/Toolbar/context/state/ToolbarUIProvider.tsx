import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { FC, ReactNode } from 'react';
import { TOOLBAR_POSITIONS, ToolbarPosition } from '../../types';
import { loadToolbarPosition, saveToolbarPosition } from '../../utils/localStorage';

interface ToolbarUIContextValue {
  position: ToolbarPosition;
  handlePositionChange: (position: ToolbarPosition) => void;
}

const ToolbarUIContext = createContext<ToolbarUIContextValue | null>(null);

export const useToolbarUIContext = () => {
  const context = useContext(ToolbarUIContext);
  if (!context) {
    throw new Error('useToolbarUIContext must be used within ToolbarUIProvider');
  }
  return context;
};

export interface ToolbarUIProviderProps {
  children: ReactNode;
  initialPosition?: ToolbarPosition;
}

export const ToolbarUIProvider: FC<ToolbarUIProviderProps> = ({ children, initialPosition }) => {
  const initialValidPosition =
    initialPosition && TOOLBAR_POSITIONS.includes(initialPosition) ? initialPosition : undefined;

  const [position, setPosition] = useState<ToolbarPosition>(
    () => loadToolbarPosition() || initialValidPosition || 'bottom-right',
  );

  const handlePositionChange = useCallback((newPosition: ToolbarPosition) => {
    setPosition(newPosition);
    saveToolbarPosition(newPosition);
  }, []);

  const value = useMemo(() => ({ position, handlePositionChange }), [position, handlePositionChange]);

  return <ToolbarUIContext.Provider value={value}>{children}</ToolbarUIContext.Provider>;
};
