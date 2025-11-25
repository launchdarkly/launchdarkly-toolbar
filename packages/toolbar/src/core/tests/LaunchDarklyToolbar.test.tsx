import React from 'react';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { LaunchDarklyToolbar } from '../ui/Toolbar/LaunchDarklyToolbar';
import '@testing-library/jest-dom/vitest';

// Mock the DevServerClient to avoid actual network calls in tests
vi.mock('../services/DevServerClient', () => {
  function MockDevServerClient() {
    this.getAvailableProjects = vi.fn().mockResolvedValue(['test-project']);
    this.setProjectKey = vi.fn();
    this.getProjectKey = vi.fn().mockReturnValue('test-project');
    this.getProjectData = vi.fn().mockResolvedValue({
      sourceEnvironmentKey: 'test-environment',
      flagsState: {},
      overrides: {},
      availableVariations: {},
      _lastSyncedFromSource: Date.now(),
    });
    this.setOverride = vi.fn();
    this.clearOverride = vi.fn();
  }

  return {
    DevServerClient: MockDevServerClient,
  };
});

// Mock the FlagStateManager
vi.mock('../services/FlagStateManager', () => {
  function MockFlagStateManager() {
    this.getEnhancedFlags = vi.fn().mockResolvedValue({});
    this.setOverride = vi.fn();
    this.clearOverride = vi.fn();
    this.subscribe = vi.fn().mockReturnValue(() => {});
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

describe('LaunchDarklyToolbar - User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dev Server Mode - Developer Flag Management Flow', () => {
    test('developer can explore and manage server-side flags', async () => {
      // GIVEN: Developer has a LaunchDarkly dev server running
      render(<LaunchDarklyToolbar domId="ld-toolbar" devServerUrl="http://localhost:8765" projectKey="my-project" />);

      // WHEN: Developer clicks the toolbar to explore available features
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: They can see server-side flag management and settings tabs
      await waitFor(() => {
        const flagsTab = screen.queryByRole('tab', { name: /flags/i });
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return flagsTab && settingsTab;
      });

      // AND: The toolbar provides the expected functionality for server-side flag management
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: Events functionality is not available without event interception plugin
      expect(screen.queryByRole('tab', { name: /events/i })).not.toBeInTheDocument();
    });
  });

  describe('SDK Mode - Client-Side Override Flow', () => {
    test('developer with flag override plugin can manage client-side flag overrides', async () => {
      // GIVEN: Developer has both flag override and event interception plugins configured
      const mockFlagOverridePlugin = {
        getFlagSdkOverride: vi.fn().mockResolvedValue({}),
        setFlagSdkOverride: vi.fn(),
        clearFlagSdkOverride: vi.fn(),
        clearAllFlagSdkOverride: vi.fn(),
        setOverride: vi.fn(),
        removeOverride: vi.fn(),
        clearAllOverrides: vi.fn(),
        getAllOverrides: vi.fn().mockResolvedValue({}),
        getClient: vi.fn(),
        getMetadata: vi.fn(),
        register: vi.fn(),
      };

      const mockEventInterceptionPlugin = {
        getEvents: vi.fn().mockReturnValue([]),
        subscribe: vi.fn().mockReturnValue(() => {}),
        clearEvents: vi.fn(),
        getMetadata: vi.fn(),
        register: vi.fn(),
        getClient: vi.fn(),
      };

      // WHEN: They load the toolbar with both plugins
      render(
        <LaunchDarklyToolbar
          domId="ld-toolbar"
          flagOverridePlugin={mockFlagOverridePlugin}
          eventInterceptionPlugin={mockEventInterceptionPlugin}
        />,
      );

      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: They can access client-side flag overrides, events, and settings
      await waitFor(() => {
        const flagsTab = screen.queryByRole('tab', { name: /flags/i });
        const eventsTab = screen.queryByRole('tab', { name: /events/i });
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return flagsTab && eventsTab && settingsTab;
      });

      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument(); // Local overrides tab (labeled "Flags")
      expect(screen.getByRole('tab', { name: /events/i })).toBeInTheDocument(); // Events tab
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
    });

    test('developer without flag override plugin can only access basic settings', async () => {
      // GIVEN: Developer is using the toolbar without any flag override plugins
      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // WHEN: They click the toolbar logo
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: They only see settings (no flag management capabilities)
      await waitFor(() => {
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return settingsTab;
      });

      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: No flag management or events features are available
      expect(screen.queryByRole('tab', { name: /flags/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /events/i })).not.toBeInTheDocument();
    });
  });

  describe('Toolbar Positioning Flow', () => {
    test('developer can use toolbar in their preferred screen position', () => {
      // GIVEN: Developer prefers toolbar on the left side of screen
      render(<LaunchDarklyToolbar domId="ld-toolbar" position="bottom-left" />);

      // WHEN: The toolbar renders
      const toolbar = screen.getByTestId('launchdarkly-toolbar');

      // THEN: It appears positioned on the left side
      expect(toolbar.className).toMatch(/positionBottomLeft/);
    });

    test('toolbar defaults to right position when no preference specified', () => {
      // GIVEN: Developer hasn't specified a position preference
      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // WHEN: The toolbar renders
      const toolbar = screen.getByTestId('launchdarkly-toolbar');

      // THEN: It defaults to the right side
      expect(toolbar.className).toMatch(/positionBottomRight/);
    });
  });

  test.skip('preserves selected tab when toolbar is collapsed and expanded', async () => {
    // TODO: This test has timing issues with tab switching after animations
    // Needs investigation into animation timing in test environment
    // GIVEN: Developer has the toolbar expanded with default tab (flag-dev-server for dev-server mode)
    render(<LaunchDarklyToolbar domId="ld-toolbar" devServerUrl="http://localhost:8765" />);

    const logo = screen.getByRole('img', { name: /launchdarkly/i });
    fireEvent.click(logo);

    // Wait until tabs are present
    expect(await screen.findByRole('tab', { name: /flags/i })).toBeInTheDocument();
    expect(await screen.findByRole('tab', { name: /settings/i })).toBeInTheDocument();

    // Wait for expand animations to complete so tab changes aren't ignored
    await new Promise((resolve) => setTimeout(resolve, 500));

    // WHEN: They select the settings tab (different from default)
    const settingsTab = screen.getByRole('tab', { name: /settings/i });
    await act(async () => {
      fireEvent.click(settingsTab);
      // Give time for state update
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    // Verify settings tab is now selected (wait for state update)
    await waitFor(
      () => {
        expect(screen.getByRole('tab', { name: /settings/i })).toHaveAttribute('aria-selected', 'true');
      },
      { timeout: 2000 },
    );

    // AND: They enable auto-collapse
    const autoCollapseToggle = screen.getByTestId('auto-collapse-toggle');
    fireEvent.click(autoCollapseToggle);

    // AND: They collapse the toolbar by clicking outside (if auto-collapse is enabled)
    fireEvent.mouseDown(document.body);

    // Wait for collapse (settings tab removed)
    await waitForElementToBeRemoved(() => screen.queryByRole('tab', { name: /settings/i }));

    // AND: They expand it again (re-query the logo since the DOM was re-rendered)
    const logoAfterCollapse = screen.getByRole('img', { name: /launchdarkly/i });
    fireEvent.click(logoAfterCollapse);

    // Wait until settings tab returns
    expect(await screen.findByRole('tab', { name: /settings/i })).toBeInTheDocument();

    // THEN: The settings tab should still be selected (preserved, not reverted to default)
    expect(screen.getByRole('tab', { name: /settings/i })).toHaveAttribute('aria-selected', 'true');
  });

  describe('Error Handling and Edge Cases', () => {
    test('SDK mode without flag override plugin shows limited functionality gracefully', async () => {
      // GIVEN: Developer is using SDK mode but forgot to provide flag override plugin
      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // WHEN: They expand the toolbar to see available features
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: They get a clear indication of limited functionality
      await waitFor(() => {
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return settingsTab;
      });

      // AND: Only basic settings are available (no flag management or events)
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /flags/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /events/i })).not.toBeInTheDocument();

      // AND: The interface doesn't break or show confusing empty states
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
    });

    test('invalid devServerUrl is handled gracefully', async () => {
      // GIVEN: Developer provides an invalid or malformed URL
      render(<LaunchDarklyToolbar domId="ld-toolbar" devServerUrl="not-a-valid-url" projectKey="test" />);

      // WHEN: The toolbar tries to connect
      const toolbar = screen.getByTestId('launchdarkly-toolbar');

      // THEN: The toolbar still renders and doesn't crash the application
      expect(toolbar).toBeInTheDocument();

      // AND: Mode detection still works correctly despite invalid URL
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      await waitFor(() => {
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return settingsTab;
      });

      // Should still show dev-server mode tabs (the URL format doesn't affect mode detection)
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument(); // Server-side flags
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /events/i })).not.toBeInTheDocument(); // Events is SDK-mode only
    });

    test('empty devServerUrl is treated as SDK mode', async () => {
      // GIVEN: Developer accidentally passes empty string for devServerUrl
      render(<LaunchDarklyToolbar domId="ld-toolbar" devServerUrl="" />);

      // WHEN: The toolbar renders
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: It behaves as SDK mode (not dev-server mode)
      await waitFor(() => {
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return settingsTab;
      });

      // AND: Shows only SDK mode tabs (no flag override plugin = settings only)
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: Does NOT show dev-server mode tabs (flags = server-side flags)
      expect(screen.queryByRole('tab', { name: /flags/i })).not.toBeInTheDocument();

      // AND: Does NOT show flag-sdk tab (no flag override plugin provided)
      expect(screen.queryByText('flag-sdk')).not.toBeInTheDocument();

      // AND: Only has one tab total (settings only - typical SDK mode without plugin)
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
    });
  });
});
