import { motion } from 'motion/react';
import { FlagDevServerTabContent } from '../TabContent/FlagDevServerTabContent';
// import { EventsTabContent } from '../TabContent/EventsTabContent';
import { SettingsTabContent } from '../TabContent/SettingsTabContent';
import { ANIMATION_CONFIG, DIMENSIONS } from '../constants';
import { TabId, ToolbarMode } from '../types';
import type { IFlagOverridePlugin } from '../../../types/plugin';
import { FlagSdkOverrideTabContent } from '../TabContent/FlagSdkOverrideTabContent';

interface TabContentRendererProps {
  activeTab: TabId;
  slideDirection: number;
  flagOverridePlugin?: IFlagOverridePlugin;
  mode: ToolbarMode;
}

export function TabContentRenderer(props: TabContentRendererProps) {
  const { activeTab, slideDirection, flagOverridePlugin, mode } = props;

  const renderContent = () => {
    switch (activeTab) {
      case 'flag-sdk':
        if (!flagOverridePlugin) return null;
        return <FlagSdkOverrideTabContent flagOverridePlugin={flagOverridePlugin} />;
      case 'flag-dev-server':
        return <FlagDevServerTabContent />;
      case 'settings':
        return <SettingsTabContent mode={mode} />;
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
