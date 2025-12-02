import { createContext, useContext, ReactNode } from 'react';
import { IEventInterceptionPlugin, IFlagOverridePlugin } from '../../../../../types';

interface PluginsContextValue {
  baseUrl: string;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
}

const PluginsContext = createContext<PluginsContextValue | undefined>(undefined);

export interface PluginsProviderProps {
  children: ReactNode;
  baseUrl: string;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
}

export function PluginsProvider({
  children,
  baseUrl,
  flagOverridePlugin,
  eventInterceptionPlugin,
}: PluginsProviderProps) {
  return (
    <PluginsContext.Provider value={{ baseUrl, flagOverridePlugin, eventInterceptionPlugin }}>
      {children}
    </PluginsContext.Provider>
  );
}

export function usePlugins(): PluginsContextValue {
  const context = useContext(PluginsContext);
  if (context === undefined) {
    throw new Error('usePlugins must be used within a PluginsProvider');
  }
  return context;
}
