import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContentRenderer } from '../../ui/Toolbar/components/new/ContentRenderer';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock the content components
vi.mock('../../ui/Toolbar/components/new/Settings/SettingsContent', () => ({
  SettingsContent: () => <div data-testid="settings-content">Settings Content</div>,
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

describe('ContentRenderer', () => {
  it('should render FlagListContent for flags tab', () => {
    render(<ContentRenderer activeTab="flags" activeSubtab="flags" />);

    expect(screen.getByTestId('flag-list-content')).toBeInTheDocument();
  });

  it('should render FlagListContent for flags tab with context subtab', () => {
    render(<ContentRenderer activeTab="flags" activeSubtab="context" />);

    // Should render context content, but we mocked it to return a placeholder
    expect(screen.getByText('Context Content')).toBeInTheDocument();
  });

  it('should render FlagListContent as default for flags tab with undefined subtab', () => {
    render(<ContentRenderer activeTab="flags" activeSubtab={undefined} />);

    expect(screen.getByTestId('flag-list-content')).toBeInTheDocument();
  });

  it('should render EventsContent for monitoring tab', () => {
    render(<ContentRenderer activeTab="monitoring" activeSubtab="events" />);

    expect(screen.getByTestId('events-content')).toBeInTheDocument();
  });

  it('should render EventsContent as default for monitoring tab with undefined subtab', () => {
    render(<ContentRenderer activeTab="monitoring" activeSubtab={undefined} />);

    expect(screen.getByTestId('events-content')).toBeInTheDocument();
  });

  it('should render SettingsContent for settings tab', () => {
    render(<ContentRenderer activeTab="settings" activeSubtab={undefined} />);

    expect(screen.getByTestId('settings-content')).toBeInTheDocument();
  });

  it('should render interactive content for interactive tab', () => {
    render(<ContentRenderer activeTab="interactive" activeSubtab={undefined} />);

    expect(screen.getByTestId('interactive-content')).toBeInTheDocument();
  });

  it('should render fallback content for undefined active tab', () => {
    render(<ContentRenderer activeTab={undefined} activeSubtab={undefined} />);

    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('should render fallback content for unknown active tab', () => {
    // @ts-expect-error Testing invalid tab
    render(<ContentRenderer activeTab="unknown" activeSubtab={undefined} />);

    expect(screen.getByText('No content available')).toBeInTheDocument();
  });
});
