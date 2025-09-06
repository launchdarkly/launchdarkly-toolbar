import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';

import { LaunchDarklyToolbar } from '../ui/Toolbar/LaunchDarklyToolbar';

// Mock the DevServerClient to avoid actual network calls in tests
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

// Mock the FlagStateManager
vi.mock('../services/FlagStateManager', () => ({
  FlagStateManager: vi.fn().mockImplementation(() => ({
    getEnhancedFlags: vi.fn().mockResolvedValue({}),
    setOverride: vi.fn(),
    clearOverride: vi.fn(),
    subscribe: vi.fn().mockReturnValue(() => {}),
  })),
}));

describe('LaunchDarklyToolbar - User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Dev Server Mode - Developer Flag Management Flow', () => {
    test('developer can explore and manage server-side flags', async () => {
      // GIVEN: Developer has a LaunchDarkly dev server running
      render(<LaunchDarklyToolbar devServerUrl="http://localhost:8765" projectKey="my-project" />);

      // WHEN: Developer hovers over the toolbar to explore available features
      const toolbar = screen.getByTestId('launchdarkly-toolbar');
      fireEvent.mouseEnter(toolbar);

      // THEN: They can see server-side flag management and settings tabs
      await waitFor(() => {
        const flagsTab = screen.queryByRole('tab', { name: /flags/i });
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return flagsTab && settingsTab;
      });

      // AND: The toolbar provides the expected functionality for server-side flag management
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: Client-side override functionality is not available (they should use the dev server)
      expect(screen.queryByRole('tab', { name: /local overrides/i })).not.toBeInTheDocument();
    });
  });

  describe('SDK Mode - Client-Side Override Flow', () => {
    test('developer with flag override plugin can manage client-side flag overrides', async () => {
      // GIVEN: Developer has a flag override plugin configured for local overrides
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
      };

      // WHEN: They load the toolbar with their flag override plugin
      render(<LaunchDarklyToolbar flagOverridePlugin={mockFlagOverridePlugin} />);

      const toolbar = screen.getByTestId('launchdarkly-toolbar');
      fireEvent.mouseEnter(toolbar);

      // THEN: They can access client-side flag overrides and settings
      await waitFor(() => {
        const flagsTab = screen.queryByRole('tab', { name: /flags/i });
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return flagsTab && settingsTab;
      });

      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument(); // Local overrides tab
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
    });

    test('developer without flag override plugin can only access basic settings', async () => {
      // GIVEN: Developer is using the toolbar without any flag override plugins
      render(<LaunchDarklyToolbar />);

      // WHEN: They hover over the toolbar
      const toolbar = screen.getByTestId('launchdarkly-toolbar');
      fireEvent.mouseEnter(toolbar);

      // THEN: They only see settings (no flag management capabilities)
      await waitFor(() => {
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return settingsTab;
      });

      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();

      // AND: No flag management features are available
      expect(screen.queryByText('Toggle')).not.toBeInTheDocument();
    });
  });

  describe('Toolbar Positioning Flow', () => {
    test('developer can use toolbar in their preferred screen position', () => {
      // GIVEN: Developer prefers toolbar on the left side of screen
      render(<LaunchDarklyToolbar position="left" />);

      // WHEN: The toolbar renders
      const toolbar = screen.getByTestId('launchdarkly-toolbar');

      // THEN: It appears positioned on the left side
      expect(toolbar.className).toMatch(/positionLeft/);
    });

    test('toolbar defaults to right position when no preference specified', () => {
      // GIVEN: Developer hasn't specified a position preference
      render(<LaunchDarklyToolbar />);

      // WHEN: The toolbar renders
      const toolbar = screen.getByTestId('launchdarkly-toolbar');

      // THEN: It defaults to the right side
      expect(toolbar.className).toMatch(/positionRight/);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('SDK mode without flag override plugin shows limited functionality gracefully', async () => {
      // GIVEN: Developer is using SDK mode but forgot to provide flag override plugin
      render(<LaunchDarklyToolbar />);

      // WHEN: They expand the toolbar to see available features
      const toolbar = screen.getByTestId('launchdarkly-toolbar');
      fireEvent.mouseEnter(toolbar);

      // THEN: They get a clear indication of limited functionality
      await waitFor(() => {
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return settingsTab;
      });

      // AND: Only basic settings are available (no flag management)
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
      expect(screen.queryByRole('tab', { name: /flags/i })).not.toBeInTheDocument();

      // AND: The interface doesn't break or show confusing empty states
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
    });

    test('invalid devServerUrl is handled gracefully', async () => {
      // GIVEN: Developer provides an invalid or malformed URL
      render(<LaunchDarklyToolbar devServerUrl="not-a-valid-url" projectKey="test" />);

      // WHEN: The toolbar tries to connect
      const toolbar = screen.getByTestId('launchdarkly-toolbar');

      // THEN: The toolbar still renders and doesn't crash the application
      expect(toolbar).toBeInTheDocument();

      // AND: Mode detection still works correctly despite invalid URL
      fireEvent.mouseEnter(toolbar);

      await waitFor(() => {
        const settingsTab = screen.queryByRole('tab', { name: /settings/i });
        return settingsTab;
      });

      // Should still show dev-server mode tabs (the URL format doesn't affect mode detection)
      expect(screen.getByRole('tab', { name: /flags/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
    });

    test('empty devServerUrl is treated as SDK mode', async () => {
      // GIVEN: Developer accidentally passes empty string for devServerUrl
      render(<LaunchDarklyToolbar devServerUrl="" />);

      // WHEN: The toolbar renders
      const toolbar = screen.getByTestId('launchdarkly-toolbar');
      fireEvent.mouseEnter(toolbar);

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
