import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AfterTrackHook, type AfterTrackHookConfig } from '../../../types/hooks/AfterTrackHook';
import { EventFilter, ProcessedEvent } from '../../../types';

// Mock console methods to avoid noise in test output
const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('AfterTrackHook', () => {
  let hook: AfterTrackHook;
  let mockOnNewEvent: ReturnType<typeof vi.fn>;
  let mockTrackContext: { context: object; key: string; data: object; metricValue: number };

  beforeEach(() => {
    mockOnNewEvent = vi.fn();
    consoleSpy.mockClear();

    mockTrackContext = {
      context: { kind: 'user', key: 'test-user' },
      key: 'button-click',
      data: { buttonId: 'submit-btn', page: '/checkout' },
      metricValue: 1.5,
    };
  });

  describe('constructor', () => {
    it('should create an instance with default config', () => {
      hook = new AfterTrackHook();
      expect(hook).toBeInstanceOf(AfterTrackHook);
    });

    it('should create an instance with provided config', () => {
      const config: AfterTrackHookConfig = {
        onNewEvent: mockOnNewEvent,
        filter: {
          kinds: ['custom'],
        },
      };

      hook = new AfterTrackHook(config);
      expect(hook).toBeInstanceOf(AfterTrackHook);
    });
  });

  describe('getMetadata', () => {
    beforeEach(() => {
      hook = new AfterTrackHook();
    });

    it('should return correct hook metadata', () => {
      const metadata = hook.getMetadata();

      expect(metadata).toEqual({
        name: 'AfterTrackHook',
      });
    });
  });

  describe('afterTrack', () => {
    beforeEach(() => {
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent });
    });

    it('should process track events correctly', () => {
      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;

      expect(processedEvent).toMatchObject({
        kind: 'custom',
        key: 'button-click',
        displayName: 'Custom: button-click',
        category: 'custom',
        metadata: {
          data: { buttonId: 'submit-btn', page: '/checkout' },
          metricValue: 1.5,
          url: expect.any(String), // Will be test environment URL
        },
      });
      expect(processedEvent.id).toMatch(/^custom-\d+-\d{6}-[a-z0-9]{6}$/);
      expect(processedEvent.timestamp).toBeGreaterThan(0);
    });

    it('should handle events without key', () => {
      const contextWithoutKey = { ...mockTrackContext, key: '' };
      hook.afterTrack(contextWithoutKey);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Custom: unknown');
    });

    it('should handle events without onNewEvent callback', () => {
      hook = new AfterTrackHook(); // No callback provided

      expect(() => hook.afterTrack(mockTrackContext)).not.toThrow();
    });

    it('should handle errors gracefully', () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      hook = new AfterTrackHook({ onNewEvent: errorCallback });

      hook.afterTrack(mockTrackContext);

      expect(consoleSpy).toHaveBeenCalledWith('Event processing error in AfterTrackHook:', expect.any(Error));
    });
  });

  describe('event filtering', () => {
    it('should process events when no filter is provided', () => {
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent });

      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should filter by event kinds', () => {
      const filter: EventFilter = {
        kinds: ['feature'], // Exclude custom events
      };
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should allow custom events when kinds filter includes custom', () => {
      const filter: EventFilter = {
        kinds: ['custom', 'feature'],
      };
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should filter by categories', () => {
      const filter: EventFilter = {
        categories: ['flag'], // Exclude custom category
      };
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should allow custom events when categories filter includes custom', () => {
      const filter: EventFilter = {
        categories: ['custom', 'flag'],
      };
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should ignore flagKeys filter for custom events', () => {
      const filter: EventFilter = {
        flagKeys: ['some-flag'], // Should not affect custom events
      };
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should combine multiple filters correctly', () => {
      const filter: EventFilter = {
        kinds: ['custom'],
        categories: ['custom'],
      };
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('metadata extraction', () => {
    beforeEach(() => {
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent });
    });

    it('should extract custom event metadata correctly', () => {
      hook.afterTrack(mockTrackContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata).toEqual({
        data: { buttonId: 'submit-btn', page: '/checkout' },
        metricValue: 1.5,
        url: expect.any(String),
      });
    });

    it('should handle missing data fields', () => {
      const contextWithoutData = {
        ...mockTrackContext,
        data: undefined as any,
        metricValue: undefined as any,
      };
      hook.afterTrack(contextWithoutData);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata).toEqual({
        data: undefined,
        metricValue: undefined,
        url: expect.any(String),
      });
    });
  });

  describe('unique ID generation', () => {
    beforeEach(() => {
      hook = new AfterTrackHook({ onNewEvent: mockOnNewEvent });
    });

    it('should generate unique IDs for multiple events', () => {
      hook.afterTrack(mockTrackContext);
      hook.afterTrack(mockTrackContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(2);
      const event1 = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      const event2 = mockOnNewEvent.mock.calls[1][0] as ProcessedEvent;

      expect(event1.id).not.toBe(event2.id);
      expect(event1.id).toMatch(/^custom-\d+-\d{6}-[a-z0-9]{6}$/);
      expect(event2.id).toMatch(/^custom-\d+-\d{6}-[a-z0-9]{6}$/);
    });
  });
});
