import { motion } from 'motion/react';
import { FlagTabContent } from '../TabContent/FlagTabContent';
// import { EventsTabContent } from '../TabContent/EventsTabContent';
import { SettingsTabContent } from '../TabContent/SettingsTabContent';
import { ANIMATION_CONFIG, DIMENSIONS } from '../constants';
import { TabId } from '../types';

const TAB_CONTENT_MAP = {
  flags: FlagTabContent,
  // events: EventsTabContent,
  settings: SettingsTabContent,
} as const satisfies Record<TabId, React.ComponentType>;

interface TabContentRendererProps {
  activeTab: TabId;
  slideDirection: number;
}

export function TabContentRenderer(props: TabContentRendererProps) {
  const { activeTab, slideDirection } = props;
  const ContentComponent = TAB_CONTENT_MAP[activeTab];

  if (!ContentComponent) {
    return null;
  }

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
      <ContentComponent />
    </motion.div>
  );
}
