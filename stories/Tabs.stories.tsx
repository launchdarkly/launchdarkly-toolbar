import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Tabs } from '../src/ui/Tabs/Tabs';
import { TabButton } from '../src/ui/Tabs/TabButton';

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
      <TabButton id="code" label="Code" icon="code-circle" />
      <TabButton id="flags" label="Flags" icon="flag" />
      <TabButton id="settings" label="Settings" icon="gear" />
    </Tabs>
  ),
};

export const WithActiveTab: Story = {
  render: () => (
    <Tabs activeTab="flags">
      <TabButton id="code" label="Code" icon="code-circle" />
      <TabButton id="flags" label="Flags" icon="flag" />
      <TabButton id="settings" label="Settings" icon="gear" />
    </Tabs>
  ),
};

export const CustomTabs: Story = {
  render: () => (
    <Tabs activeTab="analytics">
      <TabButton id="dashboard" label="Dashboard" />
      <TabButton id="analytics" label="Analytics" />
      <TabButton id="reports" label="Reports" />
      <TabButton id="settings" label="Settings" />
    </Tabs>
  ),
};

export const WithDisabledTab: Story = {
  render: () => (
    <Tabs>
      <TabButton id="code" label="Code" icon="code-circle" />
      <TabButton id="flags" label="Flags" icon="flag" />
      <TabButton id="settings" label="Settings" icon="gear" />
      <TabButton id="disabled" label="Disabled" disabled />
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs activeTab="experiments">
      <TabButton id="overview" label="Overview" />
      <TabButton id="features" label="Flags" />
      <TabButton id="experiments" label="Experiments" />
      <TabButton id="metrics" label="Metrics" />
      <TabButton id="audiences" label="Audiences" />
      <TabButton id="integrations" label="Integrations" />
      <TabButton id="settings" label="Settings" />
      <TabButton id="billing" label="Billing" />
    </Tabs>
  ),
};

export const Interactive: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState('flags');

    return (
      <div style={{ padding: '20px' }}>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
          <TabButton id="flags" label="Flags" icon="toggle-off" />
          <TabButton id="events" label="Events" icon="chart-line" />
          <TabButton id="settings" label="Settings" icon="gear-outline" />
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
