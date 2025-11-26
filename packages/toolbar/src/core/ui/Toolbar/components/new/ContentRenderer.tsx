import React from 'react';
import { SettingsContent } from './Settings/SettingsContent';
import { FlagListContent } from './FeatureFlags/FlagListContent';
import { EventsContent } from './Monitoring/EventsContent';
import { useActiveTabContext } from '../../context/ActiveTabProvider';
import { useActiveSubtabContext } from './context/ActiveSubtabProvider';

// Placeholder content components - to be implemented later
const ContextContent = () => <div>Context Content</div>;
const ClickTrackingContent = () => <div>Click Tracking Content</div>;

export const ContentRenderer: React.FC = () => {
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
};
