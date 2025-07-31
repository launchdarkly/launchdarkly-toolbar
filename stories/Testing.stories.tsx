import type { Meta, StoryObj } from '@storybook/react';

import { LaunchDarklyToolbar } from '@launchdarkly/toolbar';
import '@launchdarkly/toolbar/css';

const meta: Meta<typeof LaunchDarklyToolbar> = {
  title: 'Testing/Toolbar',
  component: LaunchDarklyToolbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main LaunchDarkly toolbar component that provides feature flag management UI with real-time updates, search functionality, and project switching capabilities.',
      },
    },
  },
  args: {
    position: 'right',
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default toolbar state with auto-detected project.',
      },
    },
  },
};
