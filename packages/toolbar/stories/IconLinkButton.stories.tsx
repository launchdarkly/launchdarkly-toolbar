import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconLinkButton } from '../src/core/ui/Buttons/IconLinkButton';
import { GearIcon, EditIcon, SearchIcon } from '../src/core/ui/Toolbar/components/icons';

const meta: Meta<typeof IconLinkButton> = {
  title: 'UI/Toolbar/IconLinkButton',
  component: IconLinkButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The IconLinkButton component is a customizable link button that displays an icon with accessibility support. It supports different sizes and can open links in various targets.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    icon: {
      description: 'The icon element to display inside the button',
      control: false,
    },
    label: {
      control: 'text',
      description: 'Accessibility label for screen readers',
    },
    href: {
      control: 'text',
      description: 'The URL the link points to',
    },
    target: {
      control: { type: 'radio' },
      options: ['_blank', '_self', '_parent', '_top'],
      description: 'Where to open the linked document',
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the button',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback fired when the link is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <GearIcon />,
    label: 'Settings',
    href: 'https://launchdarkly.com',
    target: '_blank',
    size: 'large',
    onClick: () => console.log('Settings link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default IconLinkButton with a settings icon linking to LaunchDarkly website.',
      },
    },
  },
};

export const SmallSize: Story = {
  args: {
    icon: <SearchIcon />,
    label: 'Search Documentation',
    href: 'https://docs.launchdarkly.com',
    target: '_blank',
    size: 'small',
    onClick: () => console.log('Search link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Small-sized IconLinkButton with a search icon.',
      },
    },
  },
};

export const MediumSize: Story = {
  args: {
    icon: <EditIcon />,
    label: 'Edit Configuration',
    href: '#edit',
    target: '_self',
    size: 'medium',
    onClick: () => console.log('Edit link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Medium-sized IconLinkButton with an edit icon.',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    icon: <GearIcon />,
    label: 'Configuration Panel',
    href: '#configuration',
    target: '_self',
    size: 'large',
    onClick: () => console.log('Configuration link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Large-sized IconLinkButton (default size) with a gear icon.',
      },
    },
  },
};

export const SizesComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <IconLinkButton icon={<GearIcon />} label="Small Settings" href="#small" size="small" />
      <IconLinkButton icon={<GearIcon />} label="Medium Settings" href="#medium" size="medium" />
      <IconLinkButton icon={<GearIcon />} label="Large Settings" href="#large" size="large" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of all available sizes (small, medium, large) side by side.',
      },
    },
  },
};

export const OnDarkBackground: Story = {
  args: {
    icon: <EditIcon />,
    label: 'Edit on Dark Background',
    href: 'https://app.launchdarkly.com',
    target: '_blank',
    size: 'large',
    onClick: () => console.log('Dark background link clicked'),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          borderRadius: '8px',
          color: 'white',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'IconLinkButton displayed on a dark background to show contrast and visibility.',
      },
    },
  },
};

export const ExternalLink: Story = {
  args: {
    icon: <SearchIcon />,
    label: 'Open Documentation',
    href: 'https://docs.launchdarkly.com',
    target: '_blank',
    size: 'medium',
    onClick: () => console.log('External documentation link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'IconLinkButton configured to open an external link in a new tab.',
      },
    },
  },
};

export const InternalNavigation: Story = {
  args: {
    icon: <EditIcon />,
    label: 'Navigate to Edit Page',
    href: '/edit',
    target: '_self',
    size: 'medium',
    onClick: () => console.log('Internal navigation clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'IconLinkButton configured for internal navigation within the same window.',
      },
    },
  },
};

export const WithCustomClassName: Story = {
  args: {
    icon: <GearIcon />,
    label: 'Custom Styled Button',
    href: '#custom',
    target: '_self',
    size: 'large',
    className: 'custom-icon-button',
    onClick: () => console.log('Custom styled link clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'IconLinkButton with a custom CSS class applied for additional styling.',
      },
    },
  },
};
