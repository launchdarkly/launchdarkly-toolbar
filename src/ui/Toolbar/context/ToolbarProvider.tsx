import React, { createContext, useEffect, useState } from 'react';
import type { ToolbarPlugin } from '../../../../demo/plugins/ToolbarPlugin';

interface ToolbarContextValue {
  toolbarPlugin?: ToolbarPlugin;
  overrideVersion: number;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

interface ToolbarProviderProps {
  children: React.ReactNode;
  toolbarPlugin?: ToolbarPlugin;
}

export function ToolbarProvider({ children, toolbarPlugin }: ToolbarProviderProps) {
  const [overrideVersion, setOverrideVersion] = useState(0);

  // Listen to toolbar plugin changes and trigger re-renders via context
  useEffect(() => {
    if (!toolbarPlugin) return;

    const unsubscribe = toolbarPlugin.onChange((event) => {
      console.log('ToolbarProvider: Override changed, triggering context re-render', event);
      // This will cause all components that consume our context to re-render
      // When they re-render, their ldClient.variation() calls will get the new override values
      setOverrideVersion((prev) => prev + 1);
    });

    return unsubscribe;
  }, [toolbarPlugin]);

  const value = {
    toolbarPlugin,
    overrideVersion,
  };

  return <ToolbarContext.Provider value={value}>{children}</ToolbarContext.Provider>;
}
