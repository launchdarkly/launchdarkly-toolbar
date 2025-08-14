import React, { createContext } from 'react';
import type { ToolbarPlugin } from '../../../../demo/plugins/ToolbarPlugin';

interface ToolbarContextValue {
  toolbarPlugin?: ToolbarPlugin;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

interface ToolbarProviderProps {
  children: React.ReactNode;
  toolbarPlugin?: ToolbarPlugin;
}

export function ToolbarProvider({ children, toolbarPlugin }: ToolbarProviderProps) {
  const value = {
    toolbarPlugin,
  };

  return <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;
}
