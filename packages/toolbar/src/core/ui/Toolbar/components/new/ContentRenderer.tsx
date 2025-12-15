import { useActiveTabContext } from '../../context';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import { SettingsContent } from './Settings/SettingsContent';
import { FlagListContent } from './FeatureFlags/FlagListContent';
import { ContextListContent } from './Contexts/ContextListContent';
import { EventsContent } from './Monitoring/EventsContent';
import { InteractiveContent } from './Interactive';

export function ContentRenderer() {
  const { activeTab } = useActiveTabContext();
  const { activeSubtab } = useActiveSubtabContext();

  // Render content based on active tab and subtab combination
  if (activeTab === 'flags') {
    switch (activeSubtab) {
      case 'flags':
        return <FlagListContent />;
      case 'contexts':
        return <ContextListContent />;
      default:
        return <FlagListContent />;
    }
  }

  if (activeTab === 'monitoring') {
    switch (activeSubtab) {
      case 'events':
        return <EventsContent />;
      default:
        return <EventsContent />;
    }
  }

  if (activeTab === 'settings') {
    return <SettingsContent />;
  }

  if (activeTab === 'interactive') {
    return <InteractiveContent />;
  }

  // Fallback
  return <div>No content available</div>;
}
