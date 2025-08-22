import React, { createContext } from 'react';
import type { DebugOverridePlugin } from '../../../../demo/plugins/DebugOverridePlugin';

interface ToolbarContextValue {
  debugOverridePlugin?: DebugOverridePlugin;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

interface ToolbarProviderProps {
  children: React.ReactNode;
  debugOverridePlugin?: DebugOverridePlugin;
}

export function ToolbarProvider({ children, debugOverridePlugin }: ToolbarProviderProps) {
  const value = {
    debugOverridePlugin,
  };

  return <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;
}
