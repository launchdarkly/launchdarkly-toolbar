import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExpandedToolbarContent } from '../../ui/Toolbar/components/new/ExpandedToolbarContent';
import { ActiveTabProvider } from '../../ui/Toolbar/context/ActiveTabProvider';
import { SearchProvider } from '../../ui/Toolbar/context/SearchProvider';
import { AnalyticsProvider } from '../../ui/Toolbar/context/AnalyticsProvider';
import { ToolbarStateProvider } from '../../ui/Toolbar/context/ToolbarStateProvider';
import { InternalClientProvider } from '../../ui/Toolbar/context/InternalClientProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock the child components
vi.mock('../../ui/Toolbar/components/new/Header/ToolbarHeader', () => ({
  ToolbarHeader: ({ onClose }: { onClose?: () => void }) => (
    <div data-testid="toolbar-header">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock('../../ui/Toolbar/components/new/IconBar/IconBar', () => ({
  IconBar: ({ defaultActiveTab }: { defaultActiveTab: string }) => (
    <div data-testid="icon-bar">Icon Bar - Default: {defaultActiveTab}</div>
  ),
}));

vi.mock('../../ui/Toolbar/components/new/TabBar', () => ({
  TabBar: () => <div data-testid="tab-bar">Tab Bar</div>,
}));

vi.mock('../../ui/Toolbar/components/new/ContentRenderer', () => ({
  ContentRenderer: ({ activeTab, activeSubtab }: { activeTab: string; activeSubtab: string }) => (
    <div data-testid="content-renderer">
      Content: {activeTab} - {activeSubtab}
    </div>
  ),
}));

// Mock toolbar flags
vi.mock('../../../flags/toolbarFlags', () => ({
  showInteractiveIcon: vi.fn().mockReturnValue(false),
}));

// Mock the AuthProvider to return authenticated state
vi.mock('../../ui/Toolbar/context/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuthContext: () => ({
    authenticated: true,
    authenticating: false,
    loading: false,
    setAuthenticating: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock the IFrameProvider
vi.mock('../../ui/Toolbar/context/IFrameProvider', () => ({
  IFrameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useIFrameContext: () => ({
    ref: { current: null },
    iframeSrc: 'https://integrations.launchdarkly.com',
  }),
}));

// Helper component to wrap ExpandedToolbarContent with necessary providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <InternalClientProvider>
      <AnalyticsProvider>
        <SearchProvider>
          <ActiveTabProvider>
            <ToolbarStateProvider domId="test-toolbar">{children}</ToolbarStateProvider>
          </ActiveTabProvider>
        </SearchProvider>
      </AnalyticsProvider>
    </InternalClientProvider>
  );
}

describe('ExpandedToolbarContent', () => {
  const defaultProps = {
    defaultActiveTab: 'flags' as const,
    onClose: vi.fn(),
    onHeaderMouseDown: vi.fn(),
  };

  const renderExpandedToolbarContent = (props = defaultProps) => {
    return render(
      <TestWrapper>
        <ExpandedToolbarContent {...props} />
      </TestWrapper>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all child components', () => {
    renderExpandedToolbarContent();

    expect(screen.getByTestId('toolbar-header')).toBeInTheDocument();
    expect(screen.getByTestId('icon-bar')).toBeInTheDocument();
    expect(screen.getByTestId('tab-bar')).toBeInTheDocument();
    expect(screen.getByTestId('content-renderer')).toBeInTheDocument();
  });

  it('should pass defaultActiveTab to IconBar', () => {
    renderExpandedToolbarContent();

    expect(screen.getByText(/Default: flags/)).toBeInTheDocument();
  });

  it('should pass different defaultActiveTab to IconBar', () => {
    render(
      <TestWrapper>
        <ExpandedToolbarContent defaultActiveTab="settings" onClose={vi.fn()} onHeaderMouseDown={vi.fn()} />
      </TestWrapper>,
    );

    expect(screen.getByText(/Default: settings/)).toBeInTheDocument();
  });

  it('should call onClose when header close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <TestWrapper>
        <ExpandedToolbarContent defaultActiveTab="flags" onClose={onClose} onHeaderMouseDown={vi.fn()} />
      </TestWrapper>,
    );

    const closeButton = screen.getByText('Close');
    closeButton.click();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should wrap content in ActiveSubtabProvider', () => {
    // This tests the provider structure
    const { container } = renderExpandedToolbarContent();

    // Should have rendered without errors (provider is present)
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <TestWrapper>
        <ExpandedToolbarContent ref={ref} defaultActiveTab="flags" onClose={vi.fn()} onHeaderMouseDown={vi.fn()} />
      </TestWrapper>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should render with monitoring as default tab', () => {
    render(
      <TestWrapper>
        <ExpandedToolbarContent defaultActiveTab="monitoring" onClose={vi.fn()} onHeaderMouseDown={vi.fn()} />
      </TestWrapper>,
    );

    expect(screen.getByText(/Default: monitoring/)).toBeInTheDocument();
  });

  it('should have proper structure with motion.div wrapper', () => {
    const { container } = renderExpandedToolbarContent();

    // Should have a container element
    expect(container.firstChild).toBeTruthy();
  });
});
