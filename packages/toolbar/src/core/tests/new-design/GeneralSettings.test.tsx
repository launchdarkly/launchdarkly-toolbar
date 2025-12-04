import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeneralSettings } from '../../ui/Toolbar/components/new/Settings/GeneralSettings';
import { AnalyticsProvider } from '../../ui/Toolbar/context/telemetry/AnalyticsProvider';
import { InternalClientProvider } from '../../ui/Toolbar/context/telemetry/InternalClientProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Control the search term via this variable
let mockSearchTerm = '';

// Mock the TabSearchProvider hook
vi.mock('../../ui/Toolbar/components/new/context/TabSearchProvider', () => ({
  useTabSearchContext: () => ({
    searchTerms: { settings: mockSearchTerm },
    setSearchTerm: vi.fn(),
  }),
  TabSearchProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the ToolbarStateProvider
vi.mock('../../ui/Toolbar/context/state/ToolbarStateProvider', () => ({
  useToolbarState: () => ({
    isAutoCollapseEnabled: false,
    reloadOnFlagChangeIsEnabled: true,
    mode: 'dev-server',
    handleToggleAutoCollapse: vi.fn(),
    handleToggleReloadOnFlagChange: vi.fn(),
  }),
}));

// Mock the DevServerProvider
vi.mock('../../ui/Toolbar/context/DevServerProvider', () => ({
  useDevServerContext: () => ({
    state: {
      sourceEnvironmentKey: 'production',
      connectionStatus: 'connected',
      flags: {},
      lastSyncTime: Date.now(),
      isLoading: false,
      error: null,
    },
  }),
}));

// Mock the ToolbarUIProvider
vi.mock('../../ui/Toolbar/context/state/ToolbarUIProvider', () => ({
  useToolbarUIContext: () => ({
    position: 'bottom-right',
    handlePositionChange: vi.fn(),
  }),
}));

// Mock child components
vi.mock('../../ui/Toolbar/components/new/Settings/ProjectSelector', () => ({
  ProjectSelector: () => <div data-testid="project-selector">Project Selector</div>,
}));

vi.mock('../../ui/Toolbar/components/new/Settings/PositionSelector', () => ({
  PositionSelector: () => <div data-testid="position-selector">Position Selector</div>,
}));

vi.mock('../../ui/Toolbar/components/new/Settings/ConnectionStatus', () => ({
  ConnectionStatus: ({ status }: { status: string }) => <div data-testid="connection-status">Status: {status}</div>,
}));

vi.mock('../../ui/Toolbar/components/new/Settings/LogoutButton', () => ({
  LogoutButton: () => <button data-testid="logout-button">Log out</button>,
}));

// Mock @launchpad-ui/components
vi.mock('@launchpad-ui/components', () => ({
  Switch: ({ isSelected, 'aria-label': ariaLabel }: any) => (
    <div data-testid={`switch-${ariaLabel}`} aria-checked={isSelected}>
      Switch: {isSelected ? 'On' : 'Off'}
    </div>
  ),
}));

// Helper to wrap component with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <InternalClientProvider>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </InternalClientProvider>
  );
}

describe('GeneralSettings - Search Filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchTerm = '';
  });

  describe('Dev Server Mode - No Search', () => {
    it('should display all dev server sections when no search term', () => {
      mockSearchTerm = '';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      // Dev Server Configuration section
      expect(screen.getByText('Dev Server Configuration')).toBeInTheDocument();
      expect(screen.getByTestId('project-selector')).toBeInTheDocument();
      expect(screen.getByText('Environment')).toBeInTheDocument();
      expect(screen.getByText('Connection status')).toBeInTheDocument();

      // Toolbar Settings section
      expect(screen.getByText('Toolbar Settings')).toBeInTheDocument();
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Auto-collapse')).toBeInTheDocument();
      expect(screen.getByText('Reload on flag change')).toBeInTheDocument();

      // Account section
      expect(screen.getByText('Account')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });
  });

  describe('Search Filtering - Exact Matches', () => {
    it('should show only project settings when searching "project"', () => {
      mockSearchTerm = 'project';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      // Should show Dev Server Configuration section with Project
      expect(screen.getByText('Dev Server Configuration')).toBeInTheDocument();
      expect(screen.getByTestId('project-selector')).toBeInTheDocument();

      // Should NOT show other Dev Server items
      expect(screen.queryByText('Environment')).not.toBeInTheDocument();
      expect(screen.queryByText('Connection status')).not.toBeInTheDocument();

      // Should NOT show Toolbar Settings or Account
      expect(screen.queryByText('Toolbar Settings')).not.toBeInTheDocument();
      expect(screen.queryByText('Account')).not.toBeInTheDocument();
    });

    it('should show only position setting when searching "position"', () => {
      mockSearchTerm = 'position';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      // Should show Toolbar Settings section with Position only
      expect(screen.getByText('Toolbar Settings')).toBeInTheDocument();
      expect(screen.getByTestId('position-selector')).toBeInTheDocument();

      // Should NOT show other settings
      expect(screen.queryByText('Auto-collapse')).not.toBeInTheDocument();
      expect(screen.queryByText('Reload on flag change')).not.toBeInTheDocument();
      expect(screen.queryByText('Dev Server Configuration')).not.toBeInTheDocument();
    });

    it('should show auto-collapse setting when searching "auto"', () => {
      mockSearchTerm = 'auto';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByText('Toolbar Settings')).toBeInTheDocument();
      expect(screen.getByText('Auto-collapse')).toBeInTheDocument();

      // Should NOT show other settings
      expect(screen.queryByText('Position')).not.toBeInTheDocument();
      expect(screen.queryByText('Reload on flag change')).not.toBeInTheDocument();
    });

    it('should show reload setting when searching "reload"', () => {
      mockSearchTerm = 'reload';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByText('Toolbar Settings')).toBeInTheDocument();
      expect(screen.getByText('Reload on flag change')).toBeInTheDocument();

      // Should NOT show other settings
      expect(screen.queryByText('Position')).not.toBeInTheDocument();
      expect(screen.queryByText('Auto-collapse')).not.toBeInTheDocument();
    });

    it('should show logout setting when searching "logout"', () => {
      mockSearchTerm = 'logout';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByText('Account')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();

      // Should NOT show other sections
      expect(screen.queryByText('Dev Server Configuration')).not.toBeInTheDocument();
      expect(screen.queryByText('Toolbar Settings')).not.toBeInTheDocument();
    });
  });

  describe('Search Filtering - Case Insensitive', () => {
    it('should match regardless of case', () => {
      mockSearchTerm = 'PROJECT';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByTestId('project-selector')).toBeInTheDocument();
    });

    it('should match mixed case search terms', () => {
      mockSearchTerm = 'PoSiTiOn';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByTestId('position-selector')).toBeInTheDocument();
    });
  });

  describe('Search Filtering - Partial Matches', () => {
    it('should match partial search "env" to Environment', () => {
      mockSearchTerm = 'env';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByText('Environment')).toBeInTheDocument();
    });

    it('should match partial search "con" to Connection status', () => {
      mockSearchTerm = 'con';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByText('Connection status')).toBeInTheDocument();
    });

    it('should match partial search "flag" to Reload on flag change', () => {
      mockSearchTerm = 'flag';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByText('Reload on flag change')).toBeInTheDocument();
    });
  });

  describe('Search Filtering - No Results', () => {
    it('should show "No settings found" message when no matches', () => {
      mockSearchTerm = 'nonexistent';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.getByText('No settings found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search')).toBeInTheDocument();
    });

    it('should not show any settings sections when no matches', () => {
      mockSearchTerm = 'zzzzz';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      expect(screen.queryByText('Dev Server Configuration')).not.toBeInTheDocument();
      expect(screen.queryByText('Toolbar Settings')).not.toBeInTheDocument();
      expect(screen.queryByText('Account')).not.toBeInTheDocument();
    });
  });

  describe('Search Filtering - Multiple Matches', () => {
    it('should show multiple settings when search matches multiple items', () => {
      mockSearchTerm = 'on';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      // Should match: Position, Connection status
      expect(screen.getByText('Position')).toBeInTheDocument();
      expect(screen.getByText('Connection status')).toBeInTheDocument();
    });
  });

  describe('Search Filtering - Empty Sections Hidden', () => {
    it('should hide sections with no matching items', () => {
      mockSearchTerm = 'environment';
      render(
        <TestWrapper>
          <GeneralSettings />
        </TestWrapper>,
      );

      // Should show Dev Server Configuration with Environment
      expect(screen.getByText('Dev Server Configuration')).toBeInTheDocument();
      expect(screen.getByText('Environment')).toBeInTheDocument();

      // Should NOT show empty sections
      expect(screen.queryByText('Toolbar Settings')).not.toBeInTheDocument();
      expect(screen.queryByText('Account')).not.toBeInTheDocument();
    });
  });
});
