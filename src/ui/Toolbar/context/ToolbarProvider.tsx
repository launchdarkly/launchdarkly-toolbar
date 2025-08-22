import React, { createContext } from 'react';
import type { IDebugOverridePlugin } from '../../../types/plugin';

interface ToolbarContextValue {
  debugOverridePlugin?: IDebugOverridePlugin;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

interface ToolbarProviderProps {
  children: React.ReactNode;
  debugOverridePlugin?: IDebugOverridePlugin;
}

export function ToolbarProvider({ children, debugOverridePlugin }: ToolbarProviderProps) {
  const value = {
    debugOverridePlugin,
  };

  return <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;
}
