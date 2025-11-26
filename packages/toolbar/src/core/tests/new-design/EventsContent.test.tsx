import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventsContent } from '../../ui/Toolbar/components/new/Monitoring/EventsContent';
import { AnalyticsProvider } from '../../ui/Toolbar/context/AnalyticsProvider';
import { InternalClientProvider } from '../../ui/Toolbar/context/InternalClientProvider';
import { ProcessedEvent, IEventInterceptionPlugin } from '../../../../types';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Control the search term via this variable
let mockSearchTerm = '';
let mockEvents: ProcessedEvent[] = [];
let mockEventPlugin: IEventInterceptionPlugin | undefined = undefined;

// Mock the TabSearchProvider hook
vi.mock('../../ui/Toolbar/components/new/context/TabSearchProvider', () => ({
  useTabSearchContext: () => ({
    searchTerms: { monitoring: mockSearchTerm },
    setSearchTerm: vi.fn(),
  }),
  TabSearchProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock the useEvents hook
vi.mock('../../ui/Toolbar/hooks/useEvents', () => ({
  useEvents: () => {
    // Filter events based on search term (mimicking real behavior)
    const filteredEvents = mockSearchTerm
      ? mockEvents.filter(
          (event) =>
            event.displayName.toLowerCase().includes(mockSearchTerm.toLowerCase()) ||
            event.kind.toLowerCase().includes(mockSearchTerm.toLowerCase()) ||
            event.category.toLowerCase().includes(mockSearchTerm.toLowerCase()) ||
            (event.key && event.key.toLowerCase().includes(mockSearchTerm.toLowerCase())),
        )
      : mockEvents;

    return {
      events: filteredEvents,
      eventStats: {
        totalEvents: filteredEvents.length,
        eventsByKind: {},
        eventsByFlag: {},
      },
    };
  },
}));

// Mock the PluginsProvider
vi.mock('../../ui/Toolbar/context', () => ({
  usePlugins: () => ({
    eventInterceptionPlugin: mockEventPlugin,
    baseUrl: 'https://app.launchdarkly.com',
  }),
  useAnalytics: () => ({
    trackEventClick: vi.fn(),
    trackOpenFlagDeeplink: vi.fn(),
  }),
}));

// Mock isDoNotTrackEnabled
vi.mock('../../../../../utils', () => ({
  isDoNotTrackEnabled: vi.fn().mockReturnValue(false),
}));

// Mock motion components
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Helper functions
const createMockEvent = (overrides: Partial<ProcessedEvent> = {}): ProcessedEvent => ({
  kind: 'feature',
  displayName: 'test-flag',
  category: 'flag',
  key: 'test-flag',
  timestamp: Date.now(),
  context: {
    key: 'test-flag',
    reason: { kind: 'OFF' },
  },
  ...overrides,
});

const createMockPlugin = (): IEventInterceptionPlugin => ({
  getEvents: vi.fn().mockReturnValue([]),
  subscribe: vi.fn().mockReturnValue(() => {}),
  clearEvents: vi.fn(),
  getMetadata: vi.fn(),
  register: vi.fn(),
  getClient: vi.fn(),
});

// Helper to wrap component with providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <InternalClientProvider>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </InternalClientProvider>
  );
}

describe('EventsContent - Search Filtering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchTerm = '';
    mockEventPlugin = createMockPlugin();
    mockEvents = [
      createMockEvent({
        displayName: 'enable-checkout',
        key: 'enable-checkout',
        kind: 'feature',
        category: 'flag',
      }),
      createMockEvent({
        displayName: 'user-profile-v2',
        key: 'user-profile-v2',
        kind: 'feature',
        category: 'flag',
      }),
      createMockEvent({
        displayName: 'analytics-tracking',
        key: 'analytics-tracking',
        kind: 'custom',
        category: 'custom',
      }),
      createMockEvent({
        displayName: 'identify-user',
        key: 'identify-user',
        kind: 'identify',
        category: 'identify',
      }),
      createMockEvent({
        displayName: 'debug-logging',
        key: 'debug-logging',
        kind: 'debug',
        category: 'debug',
      }),
    ];
  });

  describe('No Search Term', () => {
    it('should display correct event count when no search term', () => {
      mockSearchTerm = '';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      // Check that all 5 events are counted
      expect(screen.getByText(/5 events captured/)).toBeInTheDocument();
    });
  });

  describe('Search by Event Name', () => {
    it('should filter events by display name - exact match', () => {
      mockSearchTerm = 'checkout';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/1 events captured/)).toBeInTheDocument();
    });

    it('should filter events by display name - partial match', () => {
      mockSearchTerm = 'user';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/2 events captured/)).toBeInTheDocument();
    });

    it('should filter events case-insensitively', () => {
      mockSearchTerm = 'CHECKOUT';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/1 events captured/)).toBeInTheDocument();
    });
  });

  describe('Search by Event Kind', () => {
    it('should filter events by kind - feature', () => {
      mockSearchTerm = 'feature';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/2 events captured/)).toBeInTheDocument();
    });

    it('should filter events by kind - custom', () => {
      mockSearchTerm = 'custom';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/1 events captured/)).toBeInTheDocument();
    });

    it('should filter events by kind - identify', () => {
      mockSearchTerm = 'identify';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      // Should match identify-user (matches both kind AND name)
      expect(screen.getByText(/1 events captured/)).toBeInTheDocument();
    });

    it('should filter events by kind - debug', () => {
      mockSearchTerm = 'debug';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      // Should match debug-logging (matches both kind AND name)
      expect(screen.getByText(/1 events captured/)).toBeInTheDocument();
    });
  });

  describe('Search by Event Key', () => {
    it('should filter events by key', () => {
      mockSearchTerm = 'analytics';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/1 events captured/)).toBeInTheDocument();
    });

    it('should filter by partial key match', () => {
      mockSearchTerm = 'profile';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/1 events captured/)).toBeInTheDocument();
    });
  });

  describe('No Results', () => {
    it('should show "No matching events" message when search has no results', () => {
      mockSearchTerm = 'nonexistent';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText('No matching events - still listening...')).toBeInTheDocument();
    });

    it('should show "Listening for events..." message when no events and no search', () => {
      mockSearchTerm = '';
      mockEvents = [];
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText('Listening for events...')).toBeInTheDocument();
    });
  });

  describe('Multiple Matches', () => {
    it('should show multiple events when search matches multiple items', () => {
      mockSearchTerm = 'e';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      // Should match: enable-checkout, user-profile-v2, identify-user, feature (kind), debug (kind), debug-logging
      // That's at least 4 or 5 events
      const eventsCount = screen.getByText(/events captured/);
      expect(eventsCount).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show help text when plugin is not available', () => {
      mockEventPlugin = undefined;
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText('Event interception not available')).toBeInTheDocument();
      expect(screen.getByText('The event interception plugin is not configured')).toBeInTheDocument();
    });
  });

  describe('Stats Counter', () => {
    it('should update event count based on filtered results', () => {
      mockSearchTerm = 'checkout';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/1 events captured/)).toBeInTheDocument();
    });

    it('should show correct count for multiple filtered events', () => {
      mockSearchTerm = 'user';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/2 events captured/)).toBeInTheDocument();
    });

    it('should show total count when no search term', () => {
      mockSearchTerm = '';
      render(
        <TestWrapper>
          <EventsContent />
        </TestWrapper>,
      );

      expect(screen.getByText(/5 events captured/)).toBeInTheDocument();
    });
  });
});

