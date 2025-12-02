import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TabBar } from '../../ui/Toolbar/components/new/TabBar';
import { ActiveTabProvider, useActiveTabContext } from '../../ui/Toolbar/context/ActiveTabProvider';
import { ActiveSubtabProvider } from '../../ui/Toolbar/components/new/context/ActiveSubtabProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock ContentActions component
vi.mock('../../ui/Toolbar/components/new/ContentActions', () => ({
  ContentActions: () => <div data-testid="content-actions">Content Actions</div>,
}));

// Test wrapper that sets an active tab
const TestWrapperWithTab = ({ tab }: { tab: 'flags' | 'monitoring' | 'settings' | 'interactive' }) => {
  const { setActiveTab } = useActiveTabContext();

  React.useEffect(() => {
    setActiveTab(tab);
  }, [tab, setActiveTab]);

  return <TabBar />;
};

describe('TabBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when activeTab is undefined', () => {
    const { container } = render(
      <ActiveTabProvider>
        <ActiveSubtabProvider>
          <TabBar />
        </ActiveSubtabProvider>
      </ActiveTabProvider>,
    );

    // TabBar should not render anything when no active tab
    expect(container.firstChild).toBeNull();
  });

  it('should render dropdown for flags tab', () => {
    render(
      <ActiveTabProvider>
        <ActiveSubtabProvider>
          <TestWrapperWithTab tab="flags" />
        </ActiveSubtabProvider>
      </ActiveTabProvider>,
    );

    // Should render dropdown trigger with "Flags" label
    expect(screen.getByText('Flags')).toBeInTheDocument();
  });

  it('should render dropdown for monitoring tab', () => {
    render(
      <ActiveTabProvider>
        <ActiveSubtabProvider>
          <TestWrapperWithTab tab="monitoring" />
        </ActiveSubtabProvider>
      </ActiveTabProvider>,
    );

    // Should render dropdown with "Events" label
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('should open dropdown menu when clicked', () => {
    render(
      <ActiveTabProvider>
        <ActiveSubtabProvider>
          <TestWrapperWithTab tab="flags" />
        </ActiveSubtabProvider>
      </ActiveTabProvider>,
    );

    const trigger = screen.getByRole('button', { expanded: false });
    fireEvent.click(trigger);

    // Dropdown should now be expanded
    expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument();
  });

  it('should render ContentActions component', () => {
    render(
      <ActiveTabProvider>
        <ActiveSubtabProvider>
          <TestWrapperWithTab tab="flags" />
        </ActiveSubtabProvider>
      </ActiveTabProvider>,
    );

    expect(screen.getByTestId('content-actions')).toBeInTheDocument();
  });
});
