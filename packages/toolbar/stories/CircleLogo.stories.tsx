import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CircleLogo } from '../src/core/ui/Toolbar/components/CircleLogo';

const meta: Meta<typeof CircleLogo> = {
  title: 'UI/Toolbar/CircleLogo',
  component: CircleLogo,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The CircleLogo component is the collapsed state of the LaunchDarkly toolbar. It displays as a circular button with the LaunchDarkly icon and includes hover animations.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the circle logo is clicked',
    },
    onMouseDown: {
      action: 'mouseDown',
      description: 'Callback fired when mouse down event occurs',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClick: () => console.log('CircleLogo clicked'),
    onMouseDown: () => console.log('CircleLogo mouse down'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default CircleLogo state showing the LaunchDarkly icon in a circular button with dark background.',
      },
    },
  },
};

export const OnDarkBackground: Story = {
  args: {
    onClick: () => console.log('CircleLogo clicked'),
    onMouseDown: () => console.log('CircleLogo mouse down'),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'CircleLogo displayed on a dark background to show contrast and visibility.',
      },
    },
  },
};
