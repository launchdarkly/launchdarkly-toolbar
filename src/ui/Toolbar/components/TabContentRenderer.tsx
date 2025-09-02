import { motion } from 'motion/react';
import { FlagTabContent } from '../TabContent/FlagTabContent';
import { FlagOverridesTabContent } from '../TabContent/FlagOverridesTabContent';
import { EventsTabContent } from '../TabContent/EventsTabContent';
import { SettingsTabContent } from '../TabContent/SettingsTabContent';
import { ANIMATION_CONFIG, DIMENSIONS } from '../constants';
import { TabId, ToolbarMode } from '../types';

interface TabContentRendererProps {
  activeTab: TabId;
  slideDirection: number;
  mode: ToolbarMode;
}

export function TabContentRenderer(props: TabContentRendererProps) {
  const { activeTab, slideDirection, mode } = props;

  const renderContent = () => {
    switch (activeTab) {
      case 'local-overrides':
        return <FlagOverridesTabContent />;
      case 'flags':
        return <FlagTabContent />;
      case 'events':
        return <EventsTabContent />;
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
