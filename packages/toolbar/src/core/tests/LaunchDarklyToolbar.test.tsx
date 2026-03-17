import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach } from 'vitest';
import { LaunchDarklyToolbar } from '../ui/Toolbar/LaunchDarklyToolbar';
import '@testing-library/jest-dom/vitest';

// Control session replay opt-in state for tests
const {
  getMockIsOptedInToSessionReplay,
  setMockIsOptedInToSessionReplay,
  getMockEnableSessionReplay,
  setMockEnableSessionReplay,
} = vi.hoisted(() => {
  let sessionReplayOptIn = false;
  let sessionReplayEnabled = false;

  return {
    getMockIsOptedInToSessionReplay: () => sessionReplayOptIn,
    setMockIsOptedInToSessionReplay: (v: boolean) => {
      sessionReplayOptIn = v;
    },
    getMockEnableSessionReplay: () => sessionReplayEnabled,
    setMockEnableSessionReplay: (v: boolean) => {
      sessionReplayEnabled = v;
    },
  };
});

// Import LDObserve and LDRecord after mocking to get the mocked versions
import { LDObserve } from '@launchdarkly/observability';
import { LDRecord } from '@launchdarkly/session-replay';

// Mock observability and session replay
vi.mock('@launchdarkly/observability', () => ({
  LDObserve: {
    start: vi.fn(),
    stop: vi.fn(),
  },
}));

vi.mock('@launchdarkly/session-replay', () => ({
  LDRecord: {
    start: vi.fn(),
    stop: vi.fn(),
  },
}));

// Mock the toolbar flags module
vi.mock('../../flags/toolbarFlags', () => ({
  enableSessionReplay: () => getMockEnableSessionReplay(),
  enableAiIcon: () => false,
  enableInteractiveIcon: () => false,
  enableOptimizeIcon: () => false,
}));

// Override the global AnalyticsPreferencesProvider mock with dynamic control for session replay
vi.mock('../ui/Toolbar/context/telemetry/AnalyticsPreferencesProvider', async () => {
  const { createDynamicAnalyticsPreferencesProviderMock } = await import('./mocks/providers');
  return createDynamicAnalyticsPreferencesProviderMock({
    getIsOptedInToSessionReplay: getMockIsOptedInToSessionReplay,
  });
});

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
vi.mock('../ui/Toolbar/context/api/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuthContext: () => ({
    authenticated: true,
    authenticating: false,
    loading: false,
    setAuthenticating: vi.fn(),
  }),
}));

// Mock the InternalClientProvider to return ready state
vi.mock('../ui/Toolbar/context/telemetry/InternalClientProvider', () => ({
  InternalClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useInternalClient: () => ({
    client: {
      variation: vi.fn().mockReturnValue(false),
      on: vi.fn(),
      off: vi.fn(),
      track: vi.fn(),
      identify: vi.fn(),
      flush: vi.fn(),
      close: vi.fn(),
      waitForInitialization: vi.fn().mockResolvedValue(undefined),
      allFlags: vi.fn().mockReturnValue({}),
    },
    loading: false,
    error: null,
    updateContext: vi.fn(),
  }),
  useInternalClientInstance: () => ({
    variation: vi.fn().mockReturnValue(false),
    on: vi.fn(),
    off: vi.fn(),
    track: vi.fn(),
    identify: vi.fn(),
    flush: vi.fn(),
    close: vi.fn(),
    waitForInitialization: vi.fn().mockResolvedValue(undefined),
    allFlags: vi.fn().mockReturnValue({}),
  }),
}));

// Mock the IFrameProvider
vi.mock('../ui/Toolbar/context/api/IFrameProvider', () => ({
  IFrameProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useIFrameContext: () => ({
    ref: { current: null },
    iframeSrc: 'https://integrations.launchdarkly.com',
  }),
}));

describe('LaunchDarklyToolbar - User Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset session replay mocks to default (disabled) state
    setMockIsOptedInToSessionReplay(false);
    setMockEnableSessionReplay(false);
  });

  describe('Dev Server Mode - Developer Flag Management Flow', () => {
    test('developer can explore and manage server-side flags', async () => {
      // GIVEN: Developer has a LaunchDarkly dev server running
      render(<LaunchDarklyToolbar domId="ld-toolbar" devServerUrl="http://localhost:8765" projectKey="my-project" />);

      // WHEN: Developer clicks the toolbar to explore available features
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: They can see the IconBar with Flags, Analytics, and Settings navigation
      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Flags' });
      });

      expect(screen.getByRole('button', { name: 'Flags' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
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

      // THEN: They can access flags, analytics, and settings via the IconBar
      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Flags' });
      });

      expect(screen.getByRole('button', { name: 'Flags' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    });

    test('developer without flag override plugin sees full navigation', async () => {
      // GIVEN: Developer is using the toolbar without any flag override plugins
      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // WHEN: They click the toolbar logo
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: The full IconBar navigation is still available
      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Settings' });
      });

      expect(screen.getByRole('button', { name: 'Flags' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
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

  describe('Error Handling and Edge Cases', () => {
    test('SDK mode without plugins still shows full navigation', async () => {
      // GIVEN: Developer is using SDK mode without any plugins
      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // WHEN: They expand the toolbar
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: The full IconBar navigation is available
      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Settings' });
      });

      expect(screen.getByRole('button', { name: 'Flags' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    });

    test('invalid devServerUrl is handled gracefully', async () => {
      // GIVEN: Developer provides an invalid or malformed URL
      render(<LaunchDarklyToolbar domId="ld-toolbar" devServerUrl="not-a-valid-url" projectKey="test" />);

      // WHEN: The toolbar tries to connect
      const toolbar = screen.getByTestId('launchdarkly-toolbar');

      // THEN: The toolbar still renders and doesn't crash the application
      expect(toolbar).toBeInTheDocument();

      // AND: The full IconBar navigation is available despite invalid URL
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Flags' });
      });

      expect(screen.getByRole('button', { name: 'Flags' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    });

    test('empty devServerUrl is treated as SDK mode', async () => {
      // GIVEN: Developer accidentally passes empty string for devServerUrl
      render(<LaunchDarklyToolbar domId="ld-toolbar" devServerUrl="" />);

      // WHEN: The toolbar renders and is expanded
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // THEN: The full IconBar navigation is available
      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Settings' });
      });

      expect(screen.getByRole('button', { name: 'Flags' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Analytics' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
    });
  });

  describe('Session Replay - User Privacy Flow', () => {
    test('session replay starts when toolbar is expanded and user has opted in', async () => {
      // GIVEN: Session replay feature flag is enabled AND user has opted in
      setMockEnableSessionReplay(true);
      setMockIsOptedInToSessionReplay(true);

      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // WHEN: User expands the toolbar
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // Wait for toolbar to expand
      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Settings' });
      });

      // THEN: Session replay should start
      await waitFor(() => {
        expect(LDObserve.start).toHaveBeenCalled();
        expect(LDRecord.start).toHaveBeenCalledWith({ forceNew: false, silent: false });
      });
    });

    test('session replay does NOT start when user has NOT opted in', async () => {
      // GIVEN: Session replay feature flag is enabled BUT user has NOT opted in
      setMockEnableSessionReplay(true);
      setMockIsOptedInToSessionReplay(false);

      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // WHEN: User expands the toolbar
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // Wait for toolbar to expand
      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Settings' });
      });

      // Wait a bit to ensure no async calls happen
      await new Promise((resolve) => setTimeout(resolve, 100));

      // THEN: Session replay should NOT start (respecting user privacy preference)
      expect(LDObserve.start).not.toHaveBeenCalled();
      expect(LDRecord.start).not.toHaveBeenCalled();
    });

    test('session replay does NOT start when feature flag is disabled', async () => {
      // GIVEN: Session replay feature flag is DISABLED but user would opt in
      setMockEnableSessionReplay(false);
      setMockIsOptedInToSessionReplay(true);

      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // WHEN: User expands the toolbar
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // Wait for toolbar to expand
      await waitFor(() => {
        return screen.queryByRole('button', { name: 'Settings' });
      });

      // Wait a bit to ensure no async calls happen
      await new Promise((resolve) => setTimeout(resolve, 100));

      // THEN: Session replay should NOT start (feature is disabled)
      expect(LDObserve.start).not.toHaveBeenCalled();
      expect(LDRecord.start).not.toHaveBeenCalled();
    });

    test('session replay stops when toolbar is collapsed', async () => {
      // GIVEN: Session replay is running (toolbar expanded, user opted in, flag enabled)
      setMockEnableSessionReplay(true);
      setMockIsOptedInToSessionReplay(true);

      render(<LaunchDarklyToolbar domId="ld-toolbar" />);

      // Expand the toolbar to start session replay
      const logo = screen.getByRole('img', { name: /launchdarkly/i });
      fireEvent.click(logo);

      // Wait for toolbar to expand and session replay to start
      await waitFor(() => {
        expect(LDObserve.start).toHaveBeenCalled();
      });

      // Clear mocks to track new calls
      vi.clearAllMocks();

      // WHEN: User collapses the toolbar by clicking the collapse button
      const collapseButton = screen.getByRole('button', { name: /collapse toolbar/i });
      fireEvent.click(collapseButton);

      // THEN: Session replay should stop
      await waitFor(() => {
        expect(LDObserve.stop).toHaveBeenCalled();
        expect(LDRecord.stop).toHaveBeenCalled();
      });
    });
  });
});
