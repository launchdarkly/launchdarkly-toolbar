import { useActiveTabContext } from '../../context';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';
import { SettingsContent } from './Settings/SettingsContent';
import { FlagListContent } from './FeatureFlags/FlagListContent';
import { EventsContent } from './Monitoring/EventsContent';

// Placeholder content components - to be implemented later
function ContextContent() {
  return <div>Context Content</div>;
}

function ClickTrackingContent() {
  return <div>Click Tracking Content</div>;
}

export function ContentRenderer() {
  const { activeTab } = useActiveTabContext();
  const { activeSubtab } = useActiveSubtabContext();

  // Render content based on active tab and subtab combination
  if (activeTab === 'flags') {
    switch (activeSubtab) {
      case 'flags':
        return <FlagListContent />;
      case 'context':
        return <ContextContent />;
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
    return <ClickTrackingContent />;
  }

  // Fallback
  return <div>No content available</div>;
}
