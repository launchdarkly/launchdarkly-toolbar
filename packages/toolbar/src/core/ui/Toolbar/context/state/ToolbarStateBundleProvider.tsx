import { PluginsProvider, SearchProvider, ToolbarStateProvider, ToolbarUIProvider } from '..';
import { IEventInterceptionPlugin, IFlagOverridePlugin } from '../../../../../types';
import { ToolbarPosition } from '../../types';
import { ActiveTabProvider } from './ActiveTabProvider';

interface ToolbarStateBundleProviderProps {
  initialPosition?: ToolbarPosition;
  domId: string;
  devServerUrl?: string;
  baseUrl: string;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
  children: React.ReactNode;
}

export function ToolbarStateBundleProvider(props: ToolbarStateBundleProviderProps) {
  const { initialPosition, domId, devServerUrl, baseUrl, flagOverridePlugin, eventInterceptionPlugin, children } =
    props;

  return (
    <ToolbarUIProvider initialPosition={initialPosition}>
      <SearchProvider>
        <ActiveTabProvider>
          <ToolbarStateProvider domId={domId} devServerUrl={devServerUrl}>
            <PluginsProvider
              baseUrl={baseUrl}
              flagOverridePlugin={flagOverridePlugin}
              eventInterceptionPlugin={eventInterceptionPlugin}
            >
              {children}
            </PluginsProvider>
          </ToolbarStateProvider>
        </ActiveTabProvider>
      </SearchProvider>
    </ToolbarUIProvider>
  );
}
