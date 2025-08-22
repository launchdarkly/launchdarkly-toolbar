import { motion } from 'motion/react';
import { FlagTabContent } from '../TabContent/FlagTabContent';
import { LocalOverridesTabContent } from '../TabContent/LocalOverridesTabContent';
// import { EventsTabContent } from '../TabContent/EventsTabContent';
import { SettingsTabContent } from '../TabContent/SettingsTabContent';
import { ANIMATION_CONFIG, DIMENSIONS } from '../constants';
import { TabId } from '../types';
import type { DebugOverridePlugin } from '../../../../demo/plugins/DebugOverridePlugin';

interface TabContentRendererProps {
  activeTab: TabId;
  slideDirection: number;
  debugOverridePlugin?: DebugOverridePlugin;
}

export function TabContentRenderer(props: TabContentRendererProps) {
  const { activeTab, slideDirection, debugOverridePlugin } = props;

  const renderContent = () => {
    switch (activeTab) {
      case 'local-overrides':
        if (!debugOverridePlugin) return null;
        return <LocalOverridesTabContent debugOverridePlugin={debugOverridePlugin} />;
      case 'flags':
        return <FlagTabContent />;
      case 'settings':
        return <SettingsTabContent />;
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
