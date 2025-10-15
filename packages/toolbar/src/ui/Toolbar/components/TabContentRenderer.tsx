import { motion } from 'motion/react';
import { FlagDevServerTabContent } from '../TabContent/FlagDevServerTabContent';
import { FlagSdkOverrideTabContent } from '../TabContent/FlagSdkOverrideTabContent';
import { EventsTabContent } from '../TabContent/EventsTabContent';
import { SettingsTabContent } from '../TabContent/SettingsTabContent';
import { ANIMATION_CONFIG, DIMENSIONS } from '../constants';
import { TabId, ToolbarMode } from '../types';
import type { IFlagOverridePlugin, IEventInterceptionPlugin } from '../../../types/plugin';

interface TabContentRendererProps {
  activeTab: TabId;
  baseUrl: string;
  slideDirection: number;
  mode: ToolbarMode;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
  isPinned: boolean;
  reloadOnFlagChangeIsEnabled: boolean;
  onTogglePin: () => void;
  onToggleReloadOnFlagChange: () => void;
}

export function TabContentRenderer(props: TabContentRendererProps) {
  const {
    activeTab,
    slideDirection,
    mode,
    flagOverridePlugin,
    eventInterceptionPlugin,
    baseUrl,
    isPinned,
    reloadOnFlagChangeIsEnabled,
    onTogglePin,
    onToggleReloadOnFlagChange,
  } = props;

  const renderContent = () => {
    switch (activeTab) {
      case 'flag-sdk':
        return (
          <FlagSdkOverrideTabContent
            flagOverridePlugin={flagOverridePlugin}
            reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled}
          />
        );
      case 'flag-dev-server':
        return <FlagDevServerTabContent reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled} />;
      case 'events':
        return <EventsTabContent baseUrl={baseUrl} eventInterceptionPlugin={eventInterceptionPlugin} />;
      case 'settings':
        return (
          <SettingsTabContent
            mode={mode}
            isPinned={isPinned}
            onTogglePin={onTogglePin}
            reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled}
            onToggleReloadOnFlagChange={onToggleReloadOnFlagChange}
          />
        );
      default:
        return null;
    }
  };

  const content = renderContent();
  if (!content) return null;

  return (
    <motion.div
      key={activeTab}
      initial={{
        opacity: 0,
        x: slideDirection * DIMENSIONS.slideDistance,
        scale: 0.95,
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        x: slideDirection * -DIMENSIONS.slideDistance,
        scale: 0.95,
      }}
      transition={ANIMATION_CONFIG.tabContent}
    >
      {content}
    </motion.div>
  );
}
