import type { Meta, StoryObj } from '@storybook/react';

import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import { FlagOverridePlugin } from '../src/plugins/FlagOverridePlugin';
import { EventInterceptionPlugin } from '../src/plugins/EventInterceptionPlugin';

const meta: Meta<typeof LaunchDarklyToolbar> = {
  title: 'Testing/Toolbar',
  component: LaunchDarklyToolbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main LaunchDarkly toolbar component that provides feature flag management UI with real-time updates, search functionality, event tracking, and flag override capabilities. Supports plugins for extended functionality.',
      },
    },
  },
  args: {
    position: 'right',
    flagOverridePlugin: new FlagOverridePlugin(),
    eventInterceptionPlugin: new EventInterceptionPlugin(),
  },
  argTypes: {
    projectKey: {
      control: 'text',
      description: 'Project key to use. If not provided, will auto-detect first available project',
    },
    position: {
      control: { type: 'radio' },
      options: ['left', 'right'],
      description: 'Position of the toolbar on screen',
    },
    devServerUrl: {
      control: 'text',
      description: 'URL of the LaunchDarkly dev server',
    },
    pollIntervalInMs: {
      control: { type: 'number', min: 1000, max: 30000, step: 1000 },
      description: 'Polling interval in milliseconds for fetching data from dev server',
    },
    flagOverridePlugin: {
      table: { disable: true },
      description: 'Plugin for flag overrides functionality',
    },
    eventInterceptionPlugin: {
      table: { disable: true },
      description: 'Plugin for event interception and tracking',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mode-based Stories
export const DevServerMode: Story = {
  args: {
    devServerUrl: 'http://localhost:8765',
    projectKey: 'test-project',
    position: 'right',
    // No plugins needed for dev-server mode
    flagOverridePlugin: undefined,
    eventInterceptionPlugin: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dev-server mode connects to a LaunchDarkly development server. Shows Flags and Settings tabs. This mode is used when you have a dev server running locally.',
      },
    },
  },
};

export const SdkMode: Story = {
  args: {
    // No devServerUrl - triggers SDK mode
    position: 'right',
    flagOverridePlugin: new FlagOverridePlugin(),
    eventInterceptionPlugin: new EventInterceptionPlugin(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'SDK mode works with an existing LaunchDarkly client in your application. Shows Local Overrides, Events, and Settings tabs. This mode is used when you have the LaunchDarkly SDK initialized in your app.',
      },
    },
  },
};
