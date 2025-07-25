import type { Meta, StoryObj } from '@storybook/react';

import { LaunchDarklyToolbar } from '../src/ui/Toolbar/LaunchDarklyToolbar';

const meta: Meta<typeof LaunchDarklyToolbar> = {
  title: 'UI/LaunchDarklyToolbar',
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

// Default States
export const Default: Story = {
  args: {
    position: 'right',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default toolbar state with auto-detected project and right positioning.',
      },
    },
  },
};

export const LeftPositioned: Story = {
  args: {
    position: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Toolbar positioned on the left side of the screen.',
      },
    },
  },
};

// Project Configuration Stories
export const AutoDetectProject: Story = {
  args: {
    // No projectKey - will auto-detect first available project
  },
  parameters: {
    docs: {
      description: {
        story:
          'When no projectKey is provided, the toolbar automatically detects and uses the first available project from the dev server.',
      },
    },
  },
};

export const ExplicitProject: Story = {
  args: {
    projectKey: 'subs-project',
  },
  parameters: {
    docs: {
      description: {
        story:
          'When a projectKey is explicitly provided, the toolbar uses that specific project. Will show an error if the project is not found.',
      },
    },
  },
};
