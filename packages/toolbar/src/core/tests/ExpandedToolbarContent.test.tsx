import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { ExpandedToolbarContent } from '../ui/Toolbar/components/ExpandedToolbarContent';
import { DevServerProvider } from '../ui/Toolbar/context/DevServerProvider';
import { ToolbarUIProvider } from '../ui/Toolbar/context/ToolbarUIProvider';
import { SearchProvider } from '../ui/Toolbar/context/SearchProvider';
import { AnalyticsProvider } from '../ui/Toolbar/context/AnalyticsProvider';
import { IEventInterceptionPlugin, IFlagOverridePlugin } from '../../types';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Create mock instances that we can access in tests
const mockDevServerClientInstance = {
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
};

const mockFlagStateManagerInstance = {
  getEnhancedFlags: vi.fn().mockResolvedValue({}),
  setOverride: vi.fn(),
  clearOverride: vi.fn(),
  subscribe: vi.fn().mockReturnValue(() => {}),
};

// Mock the DevServerClient and FlagStateManager
vi.mock('../services/DevServerClient', () => {
  function MockDevServerClient() {
    Object.assign(this, mockDevServerClientInstance);
    return this;
  }

  return {
    DevServerClient: MockDevServerClient,
  };
});

vi.mock('../services/FlagStateManager', () => {
  function MockFlagStateManager() {
    Object.assign(this, mockFlagStateManagerInstance);
    return this;
  }

  return {
    FlagStateManager: MockFlagStateManager,
  };
});

// Mock the AuthProvider to return authenticated state
vi.mock('../ui/Toolbar/context/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuthContext: () => ({
    authenticated: true,
    authenticating: false,
    loading: false,
    setAuthenticating: vi.fn(),
  }),
}));

// Mock the IFrameProvider
vi.mock('../ui/Toolbar/context/IFrameProvider', () => ({
  IFrameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useIFrameContext: () => ({
    ref: { current: null },
    iframeSrc: 'https://integrations.launchdarkly.com',
  }),
}));

// Mock the ProjectProvider
vi.mock('../ui/Toolbar/context/ProjectProvider', () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useProjectContext: () => ({
    projectKey: 'test-project',
    projects: ['test-project'],
    getProjects: vi.fn().mockResolvedValue(['test-project']),
    loading: false,
    error: null,
  }),
}));

// Mock the FlagsProvider
vi.mock('../ui/Toolbar/context/FlagsProvider', () => ({
  FlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useFlagsContext: () => ({
    flags: {},
    getProjectFlags: vi.fn().mockResolvedValue({}),
    loading: false,
    error: null,
  }),
}));

// Mock the tab content components
vi.mock('../ui/Toolbar/TabContent/FlagDevServerTabContent', () => ({
  FlagDevServerTabContent: () => <div data-testid="flag-dev-server-tab-content">Flag Tab Content</div>,
}));

vi.mock('../ui/Toolbar/TabContent/FlagSdkOverrideTabContent', () => ({
  FlagSdkOverrideTabContent: () => <div data-testid="flag-sdk-tab-content">Flag SDK Override Tab Content</div>,
}));

vi.mock('../ui/Toolbar/TabContent/EventsTabContent', () => ({
  EventsTabContent: () => <div data-testid="events-tab-content">Events Tab Content</div>,
}));

vi.mock('../ui/Toolbar/TabContent/SettingsTabContent', () => ({
  SettingsTabContent: ({ mode }: { mode: string }) => (
    <div data-testid="settings-tab-content">Settings Tab Content - {mode}</div>
  ),
}));

// Mock the DevServerProvider to return a controlled state
vi.mock('../ui/Toolbar/context/DevServerProvider', () => ({
  DevServerProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useDevServerContext: () => ({
    state: {
      flags: {},
      connectionStatus: 'connected',
      lastSyncTime: Date.now(),
      isLoading: false,
      error: null,
      sourceEnvironmentKey: 'test-environment',
    },
    setOverride: vi.fn().mockResolvedValue(undefined),
    clearOverride: vi.fn().mockResolvedValue(undefined),
    clearAllOverrides: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn().mockResolvedValue(undefined),
  }),
}));

// Helper component to wrap ExpandedToolbarContent with necessary providers
function TestWrapper({
  children,
  initialPosition = 'bottom-right',
}: {
  children: React.ReactNode;
  devServerUrl?: string;
  initialPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}) {
  return (
    <ToolbarUIProvider initialPosition={initialPosition}>
      <AnalyticsProvider>
        <SearchProvider>{children}</SearchProvider>
      </AnalyticsProvider>
    </ToolbarUIProvider>
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
    reloadOnFlagChangeIsEnabled: false,
    onToggleReloadOnFlagChange: vi.fn(),
    onToggleAutoCollapse: vi.fn(),
    isAutoCollapseEnabled: false,
    onTabChange: vi.fn(),
    setSearchIsExpanded: vi.fn(),
    defaultActiveTab: 'settings' as const,
    optInToNewFeatures: false,
    onToggleOptInToNewFeatures: vi.fn(),
  };

  const createMockFlagOverridePlugin = (): IFlagOverridePlugin & {
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
    getMetadata: vi.fn(),
    register: vi.fn(),
  });

  const createMockEventInterceptionPlugin = (): IEventInterceptionPlugin => ({
    getEvents: vi.fn().mockReturnValue([]),
    subscribe: vi.fn().mockReturnValue(() => {}),
    clearEvents: vi.fn(),
    getMetadata: vi.fn(),
    register: vi.fn(),
    getClient: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock instances to default state
    mockDevServerClientInstance.getAvailableProjects.mockResolvedValue(['test-project']);
    mockDevServerClientInstance.setProjectKey.mockClear();
    mockDevServerClientInstance.getProjectKey.mockReturnValue('test-project');
    mockDevServerClientInstance.getProjectData.mockResolvedValue({
      sourceEnvironmentKey: 'test-environment',
      flagsState: {},
      overrides: {},
      availableVariations: {},
      _lastSyncedFromSource: Date.now(),
    });

    mockFlagStateManagerInstance.getEnhancedFlags.mockResolvedValue({});
    mockFlagStateManagerInstance.subscribe.mockReturnValue(() => {});
  });

  describe('Dev Server Mode - Server-Side Flag Management Flow', () => {
    test('developer explores server-side flag management interface', () => {
      // GIVEN: Developer has expanded the toolbar in dev server mode with event plugin
      render(
        <TestWrapper devServerUrl="http://localhost:8765">
          <ExpandedToolbarContent
            
            baseUrl="http://localhost:3002"
            {...defaultProps}
            mode="dev-server"
            reloadOnFlagChangeIsEnabled={false}
          />
        </TestWrapper>,
      );

      // WHEN: They look at the available tabs
      // THEN: They see server-side focused functionality
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument(); // Server-side flags
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument(); // Configuration

      // AND: Client-side features are not available in dev-server mode
      expect(screen.queryByRole('tab', { name: /events/i })).not.toBeInTheDocument(); // Events are SDK-only
      expect(screen.queryByText('flag-sdk')).not.toBeInTheDocument();

      // AND: The settings are contextual to dev-server mode
      expect(screen.getByTestId('settings-tab-content')).toHaveTextContent('Settings Tab Content - dev-server');
    });

    test('developer navigates to server-side flags view', async () => {
      // GIVEN: Developer wants to work with server-side flags
      render(
        <TestWrapper devServerUrl="http://localhost:8765">
          <ExpandedToolbarContent
            baseUrl="http://localhost:3002"
            {...defaultProps}
            activeTab="flag-dev-server"
            mode="dev-server"
          />
        </TestWrapper>,
      );

      // WHEN: They select the flags tab
      // THEN: They see the server-side flag management interface
      await waitFor(() => {
        expect(screen.getByTestId('flag-dev-server-tab-content')).toBeInTheDocument();
      });
    });

    test('developer with event interception plugin can access events tab in dev-server mode', () => {
      // GIVEN: Developer has expanded the toolbar in dev server mode WITH event plugin
      const mockEventPlugin = createMockEventInterceptionPlugin();
      render(
        <TestWrapper devServerUrl="http://localhost:8765">
          <ExpandedToolbarContent
            baseUrl="http://localhost:3002"
            {...defaultProps}
            mode="dev-server"
            eventInterceptionPlugin={mockEventPlugin}
          />
        </TestWrapper>,
      );

      // WHEN: They look at the available tabs
      // THEN: They see the events tab alongside server-side flags
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /events/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: The events tab is available for event monitoring in dev-server mode
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3); // flags, events, settings
    });
  });

  describe('SDK Mode - Client-Side Override Flow', () => {
    test('developer with flag override plugin explores client-side override capabilities', () => {
      // GIVEN: Developer has a flag override plugin and event interception configured
      const mockFlagOverridePlugin = createMockFlagOverridePlugin();
      const mockEventInterceptionPlugin = createMockEventInterceptionPlugin();

      render(
        <TestWrapper>
          <ExpandedToolbarContent
            baseUrl="http://localhost:3002"
            {...defaultProps}
            mode="sdk"
            flagOverridePlugin={mockFlagOverridePlugin}
            eventInterceptionPlugin={mockEventInterceptionPlugin}
          />
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
      const mockFlagOverridePlugin = createMockFlagOverridePlugin();
      const mockEventInterceptionPlugin = createMockEventInterceptionPlugin();

      render(
        <TestWrapper>
          <ExpandedToolbarContent
            baseUrl="http://localhost:3002"
            {...defaultProps}
            activeTab="flag-sdk"
            mode="sdk"
            flagOverridePlugin={mockFlagOverridePlugin}
            eventInterceptionPlugin={mockEventInterceptionPlugin}
          />
        </TestWrapper>,
      );

      // WHEN: They navigate to the local overrides tab
      // THEN: They see the client-side override interface
      expect(screen.getByTestId('flag-sdk-tab-content')).toBeInTheDocument();
    });

    test('developer monitors events in SDK mode', () => {
      // GIVEN: Developer wants to monitor LaunchDarkly events
      const mockEventInterceptionPlugin = createMockEventInterceptionPlugin();

      render(
        <TestWrapper>
          <ExpandedToolbarContent
            baseUrl="http://localhost:3002"
            {...defaultProps}
            activeTab="events"
            mode="sdk"
            eventInterceptionPlugin={mockEventInterceptionPlugin}
          />
        </TestWrapper>,
      );

      // WHEN: They navigate to the events tab
      // THEN: They see the events monitoring interface
      expect(screen.getByTestId('events-tab-content')).toBeInTheDocument();
    });

    test('developer without flag override plugin has limited functionality', () => {
      // GIVEN: Developer is using the toolbar without debug capabilities
      render(
        <TestWrapper>
          <ExpandedToolbarContent baseUrl="http://localhost:3002" {...defaultProps} mode="sdk" />
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
            baseUrl="http://localhost:3002"
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
          <ExpandedToolbarContent
            baseUrl="http://localhost:3002"
            {...defaultProps}
            activeTab={undefined}
            mode="dev-server"
          />
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
      expect(screen.queryByTestId('events-tab-content')).not.toBeInTheDocument();
    });
  });
});
