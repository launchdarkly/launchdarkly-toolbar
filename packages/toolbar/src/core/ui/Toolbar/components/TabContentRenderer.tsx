import { motion } from 'motion/react';
import { FlagDevServerTabContent } from '../TabContent/FlagDevServerTabContent';
import { FlagSdkOverrideTabContent } from '../TabContent/FlagSdkOverrideTabContent';
import { EventsTabContent } from '../TabContent/EventsTabContent';
import { SettingsTabContent } from '../TabContent/SettingsTabContent';
import { ANIMATION_CONFIG, DIMENSIONS } from '../constants';
import { TabId, ToolbarMode } from '../types';
import { IEventInterceptionPlugin, IFlagOverridePlugin } from '../../../../types';

interface TabContentRendererProps {
  activeTab: TabId;
  baseUrl: string;
  slideDirection: number;
  mode: ToolbarMode;
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
  reloadOnFlagChangeIsEnabled: boolean;
  onToggleReloadOnFlagChange: () => void;
  isAutoCollapseEnabled: boolean;
  onToggleAutoCollapse: () => void;
}

export function TabContentRenderer(props: TabContentRendererProps) {
  const {
    activeTab,
    slideDirection,
    mode,
    flagOverridePlugin,
    eventInterceptionPlugin,
    baseUrl,
    reloadOnFlagChangeIsEnabled,
    onToggleReloadOnFlagChange,
    isAutoCollapseEnabled,
    onToggleAutoCollapse,
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
            reloadOnFlagChangeIsEnabled={reloadOnFlagChangeIsEnabled}
            onToggleReloadOnFlagChange={onToggleReloadOnFlagChange}
            isAutoCollapseEnabled={isAutoCollapseEnabled}
            onToggleAutoCollapse={onToggleAutoCollapse}
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
      style={{ height: '450px' }}
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
