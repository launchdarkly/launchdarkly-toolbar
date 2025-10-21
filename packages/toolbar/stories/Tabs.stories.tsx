import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from '../src/core/ui/Tabs/Tabs';
import { TabButton } from '../src/core/ui/Tabs/TabButton';
import { ToggleOffIcon, GearIcon } from '../src/core/ui/Toolbar/components/icons';
import { TabId } from '../src/core/ui/Toolbar/types';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    activeTab: {
      control: 'select',
      description: 'Currently active tab ID',
    },
    onTabChange: {
      action: 'tab-changed',
      description: 'Callback when tab is clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs>
      <TabButton id="flag-dev-server" label="Flags" icon={ToggleOffIcon} />
      <TabButton id="settings" label="Settings" icon={GearIcon} />
    </Tabs>
  ),
};

export const WithActiveTab: Story = {
  render: () => (
    <Tabs activeTab="flag-dev-server">
      <TabButton id="flag-sdk" label="SDK Flags" icon={ToggleOffIcon} />
      <TabButton id="flag-dev-server" label="Dev Server Flags" icon={ToggleOffIcon} />
      <TabButton id="settings" label="Settings" icon={GearIcon} />
    </Tabs>
  ),
};

export const AllTabs: Story = {
  render: () => (
    <Tabs activeTab="flag-sdk">
      <TabButton id="flag-sdk" label="SDK Flags" icon={ToggleOffIcon} />
      <TabButton id="flag-dev-server" label="Dev Server Flags" icon={ToggleOffIcon} />
      <TabButton id="settings" label="Settings" icon={GearIcon} />
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs>
      <TabButton id="flag-dev-server" label="Flags" icon={ToggleOffIcon} />
      <TabButton id="settings" label="Settings" icon={GearIcon} disabled />
    </Tabs>
  ),
};

export const DevServerMode: Story = {
  render: () => (
    <Tabs activeTab="flag-dev-server">
      <TabButton id="flag-dev-server" label="Dev Server Flags" icon={ToggleOffIcon} />
      <TabButton id="settings" label="Settings" icon={GearIcon} />
    </Tabs>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState<TabId>('flag-dev-server');

    const handleTabChange = (tabId: string) => {
      setActiveTab(tabId as TabId);
    };

    return (
      <div style={{ padding: '20px' }}>
        <Tabs activeTab={activeTab} onTabChange={handleTabChange}>
          <TabButton id="flag-dev-server" label="Dev Server Flags" icon={ToggleOffIcon} />
          <TabButton id="flag-sdk" label="SDK Flags" icon={ToggleOffIcon} />
          <TabButton id="settings" label="Settings" icon={GearIcon} />
        </Tabs>
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: 'var(--lp-color-bg-ui-primary)',
            border: '1px solid var(--lp-color-border-ui-primary)',
            borderRadius: 'var(--lp-border-radius-regular)',
            color: 'var(--lp-color-text-ui-primary-base)',
          }}
        >
          <h3>Active Tab: {activeTab}</h3>
          <p>Click different tabs to see the state change.</p>
        </div>
      </div>
    );
  },
};
