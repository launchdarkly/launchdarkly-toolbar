import { render, screen } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';

import { ExpandedToolbarContent } from '../ui/Toolbar/components/ExpandedToolbarContent';
import { DevServerProvider } from '../ui/Toolbar/context/DevServerProvider';
import { SearchProvider } from '../ui/Toolbar/context/SearchProvider';
import { IFlagOverridePlugin, IEventInterceptionPlugin } from '../types/plugin';

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

<<<<<<< HEAD
vi.mock('../ui/Toolbar/TabContent/FlagOverridesTabContent', () => ({
  FlagOverridesTabContent: () => <div data-testid="local-overrides-tab-content">Local Overrides Tab Content</div>,
}));

vi.mock('../ui/Toolbar/TabContent/EventsTabContent', () => ({
  EventsTabContent: () => <div data-testid="events-tab-content">Events Tab Content</div>,
=======
vi.mock('../ui/Toolbar/TabContent/FlagSdkOverrideTabContent', () => ({
  FlagSdkOverrideTabContent: () => <div data-testid="flag-sdk-tab-content">Local Overrides Tab Content</div>,
>>>>>>> origin/toolbar-plugin-poc-react-sdk
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
  flagOverridePlugin,
  eventInterceptionPlugin,
}: {
  children: React.ReactNode;
  devServerUrl?: string;
  initialPosition?: 'left' | 'right';
  flagOverridePlugin?: IFlagOverridePlugin;
  eventInterceptionPlugin?: IEventInterceptionPlugin;
}) {
  return (
    <DevServerProvider
      config={{
        devServerUrl,
        pollIntervalInMs: 5000,
      }}
      initialPosition={initialPosition}
      flagOverridePlugin={flagOverridePlugin}
      eventInterceptionPlugin={eventInterceptionPlugin}
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

  const createMockDebugPlugin = (): IFlagOverridePlugin & {
    getLocalOverrides: () => Promise<Record<string, unknown>>;
    setLocalOverride: (...args: any[]) => void;
    clearLocalOverride: (...args: any[]) => void;
    clearAllLocalOverrides: () => void;
  } => ({
    getLocalOverrides: vi.fn().mockResolvedValue({}),
    setLocalOverride: vi.fn(),
    clearLocalOverride: vi.fn(),
    clearAllLocalOverrides: vi.fn(),
    setOverride: vi.fn(),
    removeOverride: vi.fn(),
    clearAllOverrides: vi.fn(),
    getAllOverrides: vi.fn().mockResolvedValue({}),
    getClient: vi.fn(),
  });

  const createMockEventInterceptionPlugin = (): IEventInterceptionPlugin => ({
    getEvents: vi.fn().mockReturnValue([]),
    subscribe: vi.fn().mockReturnValue(() => {}),
    clearEvents: vi.fn(),
  });

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

<<<<<<< HEAD
      // AND: Client-side features like events are not available in dev-server mode
      expect(screen.queryByRole('tab', { name: /events/i })).not.toBeInTheDocument();
=======
      // AND: Client-side override functionality is not cluttering the interface
      expect(screen.queryByText('flag-sdk')).not.toBeInTheDocument();
>>>>>>> origin/toolbar-plugin-poc-react-sdk

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
<<<<<<< HEAD
    test('developer with debug plugin explores client-side override capabilities', () => {
      // GIVEN: Developer has a debug plugin and event interception configured
      const mockDebugPlugin = createMockDebugPlugin();
      const mockEventInterceptionPlugin = createMockEventInterceptionPlugin();
=======
    test('developer with flag override plugin explores client-side override capabilities', () => {
      // GIVEN: Developer has a flag override plugin configured and expands the toolbar
      const mockDebugPlugin = {
        getFlagSdkOverride: vi.fn().mockResolvedValue({}),
        setFlagSdkOverride: vi.fn(),
        clearFlagSdkOverride: vi.fn(),
        clearAllFlagSdkOverride: vi.fn(),
        setOverride: vi.fn(),
        removeOverride: vi.fn(),
        clearAllOverrides: vi.fn(),
        getAllOverrides: vi.fn().mockResolvedValue({}),
        getClient: vi.fn(),
      };
>>>>>>> origin/toolbar-plugin-poc-react-sdk

      render(
        <TestWrapper flagOverridePlugin={mockDebugPlugin} eventInterceptionPlugin={mockEventInterceptionPlugin}>
          <ExpandedToolbarContent {...defaultProps} mode="sdk" />
        </TestWrapper>,
      );

      // WHEN: They examine available functionality
      // THEN: They see client-side override capabilities and events
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument(); // Local overrides (labeled as "Flags")
      expect(screen.getByRole('tab', { name: /events/i })).toBeInTheDocument(); // Events monitoring
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: Settings are contextual to SDK mode
      expect(screen.getByTestId('settings-tab-content')).toHaveTextContent('Settings Tab Content - sdk');
    });

    test('developer works with local flag overrides', () => {
      // GIVEN: Developer wants to override flags locally for testing
<<<<<<< HEAD
      const mockDebugPlugin = createMockDebugPlugin();
      const mockEventInterceptionPlugin = createMockEventInterceptionPlugin();

      render(
        <TestWrapper flagOverridePlugin={mockDebugPlugin} eventInterceptionPlugin={mockEventInterceptionPlugin}>
          <ExpandedToolbarContent {...defaultProps} activeTab="local-overrides" mode="sdk" />
=======
      const mockDebugPlugin = {
        getFlagSdkOverride: vi.fn().mockResolvedValue({}),
        setFlagSdkOverride: vi.fn(),
        clearFlagSdkOverride: vi.fn(),
        clearAllFlagSdkOverride: vi.fn(),
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
>>>>>>> origin/toolbar-plugin-poc-react-sdk
        </TestWrapper>,
      );

      // WHEN: They navigate to the local overrides tab
      // THEN: They see the client-side override interface
      expect(screen.getByTestId('flag-sdk-tab-content')).toBeInTheDocument();
    });

    test('developer monitors events in SDK mode', () => {
      // GIVEN: Developer wants to monitor LaunchDarkly events
      const mockDebugPlugin = createMockDebugPlugin();
      const mockEventInterceptionPlugin = createMockEventInterceptionPlugin();

      render(
        <TestWrapper flagOverridePlugin={mockDebugPlugin} eventInterceptionPlugin={mockEventInterceptionPlugin}>
          <ExpandedToolbarContent {...defaultProps} activeTab="events" mode="sdk" />
        </TestWrapper>,
      );

      // WHEN: They navigate to the events tab
      // THEN: They see the events monitoring interface
      expect(screen.getByTestId('events-tab-content')).toBeInTheDocument();
    });

    test('developer without debug plugin has limited functionality', () => {
      // GIVEN: Developer is using the toolbar without debug capabilities
      render(
        <TestWrapper>
          <ExpandedToolbarContent {...defaultProps} mode="sdk" />
        </TestWrapper>,
      );

      // WHEN: They explore the available functionality
      // THEN: They only see basic settings (no flag override or events capabilities)
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /flags/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /events/i })).not.toBeInTheDocument();

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
<<<<<<< HEAD
      expect(screen.queryByTestId('flag-tab-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('local-overrides-tab-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('events-tab-content')).not.toBeInTheDocument();
=======
      expect(screen.queryByTestId('flag-dev-server-tab-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('flag-sdk-tab-content')).not.toBeInTheDocument();
>>>>>>> origin/toolbar-plugin-poc-react-sdk
    });
  });
});
