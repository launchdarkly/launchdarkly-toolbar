import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentRenderer } from '../../ui/Toolbar/components/new/ContentRenderer';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock state for context values
let mockActiveTab: any = 'flags';
let mockActiveSubtab: any = 'flags';

// Mock the context providers - mock the state index which exports ActiveTabProvider
vi.mock('../../ui/Toolbar/context/state', () => ({
  useActiveTabContext: () => ({
    activeTab: mockActiveTab,
    setActiveTab: vi.fn(),
  }),
}));

// Also mock the main context index since ContentRenderer imports from there
vi.mock('../../ui/Toolbar/context', () => ({
  useActiveTabContext: () => ({
    activeTab: mockActiveTab,
    setActiveTab: vi.fn(),
  }),
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

vi.mock('../../ui/Toolbar/components/new/context/ActiveSubtabProvider', () => ({
  useActiveSubtabContext: () => ({
    activeSubtab: mockActiveSubtab,
    setActiveSubtab: vi.fn(),
  }),
}));

// Mock the content components
vi.mock('../../ui/Toolbar/components/new/Settings/GeneralSettings', () => ({
  GeneralSettings: () => <div data-testid="settings-content">Settings Content</div>,
}));

vi.mock('../../ui/Toolbar/components/new/Settings/Privacy/PrivacySettings', () => ({
  PrivacySettings: () => <div data-testid="privacy-settings-content">Privacy Settings Content</div>,
}));

vi.mock('../../ui/Toolbar/components/new/FeatureFlags/FlagListContent', () => ({
  FlagListContent: () => <div data-testid="flag-list-content">Flag List Content</div>,
}));

vi.mock('../../ui/Toolbar/components/new/Monitoring/EventsContent', () => ({
  EventsContent: () => <div data-testid="events-content">Events Content</div>,
}));

vi.mock('../../ui/Toolbar/components/new/Interactive', () => ({
  InteractiveContent: () => <div data-testid="interactive-content">Interactive Content</div>,
}));

vi.mock('../../ui/Toolbar/components/new/Contexts/ContextListContent', () => ({
  ContextListContent: () => <div data-testid="context-list-content">Context List Content</div>,
}));

describe('ContentRenderer', () => {
  beforeEach(() => {
    mockActiveTab = 'flags';
    mockActiveSubtab = 'flags';
  });

  it('should render FlagListContent for flags tab', () => {
    mockActiveTab = 'flags';
    mockActiveSubtab = 'flags';
    render(<ContentRenderer />);

    expect(screen.getByTestId('flag-list-content')).toBeInTheDocument();
  });

  it('should render ContextListContent for flags tab with contexts subtab', () => {
    mockActiveTab = 'flags';
    mockActiveSubtab = 'contexts';
    render(<ContentRenderer />);

    expect(screen.getByTestId('context-list-content')).toBeInTheDocument();
  });

  it('should render FlagListContent as default for flags tab with undefined subtab', () => {
    mockActiveTab = 'flags';
    mockActiveSubtab = undefined;
    render(<ContentRenderer />);

    expect(screen.getByTestId('flag-list-content')).toBeInTheDocument();
  });

  it('should render EventsContent for monitoring tab', () => {
    mockActiveTab = 'monitoring';
    mockActiveSubtab = 'events';
    render(<ContentRenderer />);

    expect(screen.getByTestId('events-content')).toBeInTheDocument();
  });

  it('should render EventsContent as default for monitoring tab with undefined subtab', () => {
    mockActiveTab = 'monitoring';
    mockActiveSubtab = undefined;
    render(<ContentRenderer />);

    expect(screen.getByTestId('events-content')).toBeInTheDocument();
  });

  it('should render SettingsContent for settings tab', () => {
    mockActiveTab = 'settings';
    mockActiveSubtab = undefined;
    render(<ContentRenderer />);

    expect(screen.getByTestId('settings-content')).toBeInTheDocument();
  });

  it('should render interactive content for interactive tab', () => {
    mockActiveTab = 'interactive';
    mockActiveSubtab = undefined;
    render(<ContentRenderer />);

    expect(screen.getByTestId('interactive-content')).toBeInTheDocument();
  });

  it('should render fallback content for undefined active tab', () => {
    mockActiveTab = undefined;
    mockActiveSubtab = undefined;
    render(<ContentRenderer />);

    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('should render fallback content for unknown active tab', () => {
    mockActiveTab = 'unknown';
    mockActiveSubtab = undefined;
    render(<ContentRenderer />);

    expect(screen.getByText('No content available')).toBeInTheDocument();
  });
});
