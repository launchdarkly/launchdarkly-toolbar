import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';

import { ExpandedToolbarContent } from '../ui/Toolbar/components/ExpandedToolbarContent';
import { DevServerProvider } from '../ui/Toolbar/context/DevServerProvider';
import { SearchProvider } from '../ui/Toolbar/context/SearchProvider';

// Mock the DevServerClient and FlagStateManager
vi.mock('../services/DevServerClient', () => ({
  DevServerClient: vi.fn().mockImplementation(() => ({
    getAvailableProjects: vi.fn().mockResolvedValue(['test-project']),
    setProjectKey: vi.fn(),
    getProjectKey: vi.fn().mockReturnValue('test-project'),
    getProjectData: vi.fn().mockResolvedValue({
      sourceEnvironmentKey: 'test-environment',
      flagsState: {},
      overrides: {},
      availableVariations: {},
      _lastSyncedFromSource: Date.now(),
    }),
    setOverride: vi.fn(),
    clearOverride: vi.fn(),
    healthCheck: vi.fn().mockResolvedValue(true),
  })),
}));

vi.mock('../services/FlagStateManager', () => ({
  FlagStateManager: vi.fn().mockImplementation(() => ({
    getEnhancedFlags: vi.fn().mockResolvedValue({}),
    setOverride: vi.fn(),
    clearOverride: vi.fn(),
    subscribe: vi.fn().mockReturnValue(() => {}),
  })),
}));

// Mock the tab content components
vi.mock('../ui/Toolbar/TabContent/FlagDevServerTabContent', () => ({
  FlagDevServerTabContent: () => <div data-testid="flag-dev-server-tab-content">Flag Tab Content</div>,
}));

vi.mock('../ui/Toolbar/TabContent/FlagOverrideTabContent', () => ({
  FlagOverrideTabContent: () => <div data-testid="flag-sdk-tab-content">Local Overrides Tab Content</div>,
}));

vi.mock('../ui/Toolbar/TabContent/SettingsTabContent', () => ({
  SettingsTabContent: ({ mode }: { mode: string }) => (
    <div data-testid="settings-tab-content">Settings Tab Content - {mode}</div>
  ),
}));

// Helper component to wrap ExpandedToolbarContent with necessary providers
function TestWrapper({
  children,
  devServerUrl,
  initialPosition = 'right',
}: {
  children: React.ReactNode;
  devServerUrl?: string;
  initialPosition?: 'left' | 'right';
}) {
  return (
    <DevServerProvider
      config={{
        devServerUrl,
        pollIntervalInMs: 5000,
      }}
      initialPosition={initialPosition}
    >
      <SearchProvider>{children}</SearchProvider>
    </DevServerProvider>
  );
}

describe('ExpandedToolbarContent - User Interaction Flows', () => {
  const defaultProps = {
    isExpanded: true,
    activeTab: 'settings' as const,
    slideDirection: 1,
    searchTerm: '',
    searchIsExpanded: false,
    onSearch: vi.fn(),
    onClose: vi.fn(),
    onTabChange: vi.fn(),
    setSearchIsExpanded: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dev Server Mode - Server-Side Flag Management Flow', () => {
    test('developer explores server-side flag management interface', () => {
      // GIVEN: Developer has expanded the toolbar in dev server mode
      render(
        <TestWrapper devServerUrl="http://localhost:8765">
          <ExpandedToolbarContent {...defaultProps} mode="dev-server" />
        </TestWrapper>,
      );

      // WHEN: They look at the available tabs
      // THEN: They see server-side focused functionality
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument(); // Server-side flags
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument(); // Configuration

      // AND: Client-side override functionality is not cluttering the interface
      expect(screen.queryByText('flag-sdk')).not.toBeInTheDocument();

      // AND: The settings are contextual to dev-server mode
      expect(screen.getByTestId('settings-tab-content')).toHaveTextContent('Settings Tab Content - dev-server');
    });

    test('developer navigates to server-side flags view', () => {
      // GIVEN: Developer wants to work with server-side flags
      render(
        <TestWrapper devServerUrl="http://localhost:8765">
          <ExpandedToolbarContent {...defaultProps} activeTab="flag-dev-server" mode="dev-server" />
        </TestWrapper>,
      );

      // WHEN: They select the flags tab
      // THEN: They see the server-side flag management interface
      expect(screen.getByTestId('flag-dev-server-tab-content')).toBeInTheDocument();
    });
  });

  describe('SDK Mode - Client-Side Override Flow', () => {
    test('developer with flag override plugin explores client-side override capabilities', () => {
      // GIVEN: Developer has a flag override plugin configured and expands the toolbar
      const mockDebugPlugin = {
        getFlagOverride: vi.fn().mockResolvedValue({}),
        setFlagOverride: vi.fn(),
        clearFlagOverride: vi.fn(),
        clearAllFlagOverride: vi.fn(),
        setOverride: vi.fn(),
        removeOverride: vi.fn(),
        clearAllOverrides: vi.fn(),
        getAllOverrides: vi.fn().mockResolvedValue({}),
        getClient: vi.fn(),
      };

      render(
        <TestWrapper>
          <ExpandedToolbarContent {...defaultProps} mode="sdk" flagOverridePlugin={mockDebugPlugin} />
        </TestWrapper>,
      );

      // WHEN: They examine available functionality
      // THEN: They see client-side override capabilities
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument(); // Local overrides (labeled as "Flags")
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: Settings are contextual to SDK mode
      expect(screen.getByTestId('settings-tab-content')).toHaveTextContent('Settings Tab Content - sdk');
    });

    test('developer works with local flag overrides', () => {
      // GIVEN: Developer wants to override flags locally for testing
      const mockDebugPlugin = {
        getFlagOverride: vi.fn().mockResolvedValue({}),
        setFlagOverride: vi.fn(),
        clearFlagOverride: vi.fn(),
        clearAllFlagOverride: vi.fn(),
        setOverride: vi.fn(),
        removeOverride: vi.fn(),
        clearAllOverrides: vi.fn(),
        getAllOverrides: vi.fn().mockResolvedValue({}),
        getClient: vi.fn(),
      };

      render(
        <TestWrapper>
          <ExpandedToolbarContent
            {...defaultProps}
            activeTab="flag-sdk"
            mode="sdk"
            flagOverridePlugin={mockDebugPlugin}
          />
        </TestWrapper>,
      );

      // WHEN: They navigate to the local overrides tab
      // THEN: They see the client-side override interface
      expect(screen.getByTestId('flag-sdk-tab-content')).toBeInTheDocument();
    });

    test('developer without flag override plugin has limited functionality', () => {
      // GIVEN: Developer is using the toolbar without a flag override plugin
      render(
        <TestWrapper>
          <ExpandedToolbarContent {...defaultProps} mode="sdk" />
        </TestWrapper>,
      );

      // WHEN: They explore the available functionality
      // THEN: They only see basic settings (no flag override capabilities)
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1); // Only settings tab available

      // AND: Settings reflect the limited SDK mode
      expect(screen.getByTestId('settings-tab-content')).toHaveTextContent('Settings Tab Content - sdk');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('component handles invalid mode gracefully', () => {
      // GIVEN: Developer accidentally passes an invalid mode (edge case)
      render(
        <TestWrapper>
          <ExpandedToolbarContent
            {...defaultProps}
            mode={'invalid-mode' as any} // TypeScript bypass for testing
          />
        </TestWrapper>,
      );

      // WHEN: The component renders
      // THEN: It doesn't crash and falls back to safe defaults
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: Only shows settings tab as fallback
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
    });

    test('component handles undefined activeTab gracefully', () => {
      // GIVEN: Developer doesn't specify an active tab (edge case)
      render(
        <TestWrapper>
          <ExpandedToolbarContent {...defaultProps} activeTab={undefined} mode="dev-server" />
        </TestWrapper>,
      );

      // WHEN: The component renders
      // THEN: It shows the tab structure without crashing
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: No tab content is rendered when activeTab is undefined (correct behavior)
      expect(screen.queryByTestId('settings-tab-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('flag-dev-server-tab-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('flag-sdk-tab-content')).not.toBeInTheDocument();
    });
  });
});
