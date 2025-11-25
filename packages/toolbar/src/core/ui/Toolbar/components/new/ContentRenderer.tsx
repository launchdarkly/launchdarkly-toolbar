import React from 'react';
import { NewActiveTabId, ActiveTabId } from '../../types/toolbar';
import { SubTab } from './types';
import { SettingsContent } from './Settings/SettingsContent';
import { FlagListContent } from './FeatureFlags/FlagListContent';
import { EventsContent } from './Monitoring/EventsContent';

// Placeholder content components - to be implemented later
const ContextContent = () => <div>Context Content</div>;
const ClickTrackingContent = () => <div>Click Tracking Content</div>;

interface ContentRendererProps {
  activeTab: NewActiveTabId | ActiveTabId;
  activeSubtab: SubTab | undefined;
}

export const ContentRenderer: React.FC<ContentRendererProps> = ({ activeTab, activeSubtab }) => {
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
