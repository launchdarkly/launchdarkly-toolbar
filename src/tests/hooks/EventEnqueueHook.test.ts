import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventEnqueueHook, type EventEnqueueHookConfig } from '../../hooks/EventEnqueueHook';
import type { EventEnqueueContext } from 'launchdarkly-js-sdk-common';
import type { ProcessedEvent, EventFilter } from '../../types/events';

// Mock console methods to avoid noise in test output
const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('EventEnqueueHook', () => {
  let hook: EventEnqueueHook;
  let mockOnNewEvent: ReturnType<typeof vi.fn>;
  let mockFeatureContext: EventEnqueueContext;
  let mockCustomContext: EventEnqueueContext;
  let mockIdentifyContext: EventEnqueueContext;

  beforeEach(() => {
    mockOnNewEvent = vi.fn();
    consoleSpy.mockClear();
    consoleLogSpy.mockClear();

    mockFeatureContext = {
      kind: 'feature',
      key: 'test-flag',
      context: { kind: 'user', key: 'test-user' },
      value: true,
      default: false,
      version: 1,
      variation: 0,
      creationDate: Date.now(),
      trackEvents: true,
      reason: { kind: 'FALLTHROUGH' },
    };

    mockCustomContext = {
      kind: 'custom',
      key: 'button-click',
      context: { kind: 'user', key: 'test-user' },
      data: { buttonId: 'submit-btn', page: '/checkout' },
      metricValue: 1.5,
      creationDate: Date.now(),
      url: 'https://example.com/checkout',
    };

    mockIdentifyContext = {
      kind: 'identify',
      context: { kind: 'user', key: 'user-123', name: 'John Doe' },
      creationDate: Date.now(),
      contextKind: 'user',
    };
  });

  describe('constructor', () => {
    it('should create an instance with default config', () => {
      hook = new EventEnqueueHook();
      expect(hook).toBeInstanceOf(EventEnqueueHook);
    });

    it('should create an instance with provided config', () => {
      const config: EventEnqueueHookConfig = {
        onNewEvent: mockOnNewEvent,
        filter: {
          includeFeature: true,
          includeCustom: false,
          includeIdentify: true,
        },
      };

      hook = new EventEnqueueHook(config);
      expect(hook).toBeInstanceOf(EventEnqueueHook);
    });

    it('should merge provided filter with defaults', () => {
      const config: EventEnqueueHookConfig = {
        filter: {
          includeCustom: false,
          excludeDebugEvents: true,
        },
      };

      hook = new EventEnqueueHook(config);

      // Test that the filter is applied by processing events
      hook.afterEventEnqueue(mockCustomContext);
      hook.afterEventEnqueue(mockFeatureContext);

      // Custom event should be filtered out, feature event should be processed
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '🎯 EventEnqueueHook triggered:',
        expect.objectContaining({
          eventKind: 'feature',
        }),
      );
    });
  });

  describe('getMetadata', () => {
    beforeEach(() => {
      hook = new EventEnqueueHook();
    });

    it('should return correct hook metadata', () => {
      const metadata = hook.getMetadata();

      expect(metadata).toEqual({
        name: 'EventEnqueueHook',
      });
    });
  });

  describe('afterEventEnqueue', () => {
    beforeEach(() => {
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent });
    });

    it('should process feature events correctly', () => {
      hook.afterEventEnqueue(mockFeatureContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;

      expect(processedEvent).toMatchObject({
        kind: 'feature',
        key: 'test-flag',
        context: mockFeatureContext,
        displayName: 'Flag: test-flag',
        category: 'flag',
        metadata: expect.objectContaining({
          flagVersion: 1,
          variation: 0,
          trackEvents: true,
          reason: { kind: 'FALLTHROUGH' },
        }),
      });
      expect(processedEvent.id).toMatch(/^feature-\d+-\d{6}-[a-z0-9]{6}$/);
      expect(processedEvent.timestamp).toBeGreaterThan(0);
    });

    it('should process custom events correctly', () => {
      hook.afterEventEnqueue(mockCustomContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;

      expect(processedEvent).toMatchObject({
        kind: 'custom',
        key: 'button-click',
        context: mockCustomContext,
        displayName: 'Custom: button-click',
        category: 'custom',
        metadata: expect.objectContaining({
          data: { buttonId: 'submit-btn', page: '/checkout' },
          metricValue: 1.5,
          url: 'https://example.com/checkout',
        }),
      });
      expect(processedEvent.id).toMatch(/^custom-\d+-\d{6}-[a-z0-9]{6}$/);
    });

    it('should process identify events correctly', () => {
      hook.afterEventEnqueue(mockIdentifyContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;

      expect(processedEvent).toMatchObject({
        kind: 'identify',
        key: undefined,
        context: mockIdentifyContext,
        displayName: 'Identify: user-123',
        category: 'identify',
        metadata: expect.objectContaining({
          contextKind: 'user',
        }),
      });
      expect(processedEvent.id).toMatch(/^identify-\d+-\d{6}-[a-z0-9]{6}$/);
    });

    it('should handle debug event kinds', () => {
      const debugContext = {
        ...mockFeatureContext,
        kind: 'debug',
      } as EventEnqueueContext;

      hook.afterEventEnqueue(debugContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;

      expect(processedEvent).toMatchObject({
        kind: 'debug',
        displayName: 'debug: test-flag',
        category: 'debug',
      });
    });

    it('should log processed events', () => {
      hook.afterEventEnqueue(mockFeatureContext);

      expect(consoleLogSpy).toHaveBeenCalledWith('🎯 EventEnqueueHook triggered:', {
        eventKind: 'feature',
        eventKey: 'test-flag',
        category: 'flag',
        displayName: 'Flag: test-flag',
      });
    });

    it('should handle events without onNewEvent callback', () => {
      hook = new EventEnqueueHook(); // No callback provided

      expect(() => hook.afterEventEnqueue(mockFeatureContext)).not.toThrow();
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      hook = new EventEnqueueHook({ onNewEvent: errorCallback });

      hook.afterEventEnqueue(mockFeatureContext);

      expect(consoleSpy).toHaveBeenCalledWith('Event processing error:', expect.any(Error));
      expect(consoleLogSpy).toHaveBeenCalledTimes(1); // Still logs the event
    });
  });

  describe('event filtering', () => {
    it('should filter by event kinds', () => {
      const filter: EventFilter = {
        kinds: ['feature', 'custom'],
      };
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEventEnqueue(mockFeatureContext);
      hook.afterEventEnqueue(mockCustomContext);
      hook.afterEventEnqueue(mockIdentifyContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(2);
      expect(mockOnNewEvent.mock.calls[0][0].kind).toBe('feature');
      expect(mockOnNewEvent.mock.calls[1][0].kind).toBe('custom');
    });

    it('should filter by categories', () => {
      const filter: EventFilter = {
        categories: ['flag', 'identify'],
      };
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEventEnqueue(mockFeatureContext);
      hook.afterEventEnqueue(mockCustomContext);
      hook.afterEventEnqueue(mockIdentifyContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(2);
      expect(mockOnNewEvent.mock.calls[0][0].category).toBe('flag');
      expect(mockOnNewEvent.mock.calls[1][0].category).toBe('identify');
    });

    it('should filter by includeFeature flag', () => {
      hook = new EventEnqueueHook({
        onNewEvent: mockOnNewEvent,
        filter: { includeFeature: false },
      });

      hook.afterEventEnqueue(mockFeatureContext);
      hook.afterEventEnqueue(mockCustomContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      expect(mockOnNewEvent.mock.calls[0][0].kind).toBe('custom');
    });

    it('should filter by includeCustom flag', () => {
      hook = new EventEnqueueHook({
        onNewEvent: mockOnNewEvent,
        filter: { includeCustom: false },
      });

      hook.afterEventEnqueue(mockFeatureContext);
      hook.afterEventEnqueue(mockCustomContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      expect(mockOnNewEvent.mock.calls[0][0].kind).toBe('feature');
    });

    it('should filter by includeIdentify flag', () => {
      hook = new EventEnqueueHook({
        onNewEvent: mockOnNewEvent,
        filter: { includeIdentify: false },
      });

      hook.afterEventEnqueue(mockIdentifyContext);
      hook.afterEventEnqueue(mockCustomContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      expect(mockOnNewEvent.mock.calls[0][0].kind).toBe('custom');
    });

    it('should handle invalid event kinds', () => {
      const invalidContext = {
        ...mockFeatureContext,
        kind: 'invalid-kind',
      } as unknown as EventEnqueueContext;

      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent });
      hook.afterEventEnqueue(invalidContext);

      expect(consoleSpy).toHaveBeenCalledWith('Invalid event kind detected:', 'invalid-kind');
      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should process all events when no filter is provided', () => {
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent });

      hook.afterEventEnqueue(mockFeatureContext);
      hook.afterEventEnqueue(mockCustomContext);
      hook.afterEventEnqueue(mockIdentifyContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(3);
    });
  });

  describe('display name generation', () => {
    beforeEach(() => {
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent });
    });

    it('should generate display name for feature events', () => {
      hook.afterEventEnqueue(mockFeatureContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Flag: test-flag');
    });

    it('should generate display name for custom events', () => {
      hook.afterEventEnqueue(mockCustomContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Custom: button-click');
    });

    it('should generate display name for identify events', () => {
      hook.afterEventEnqueue(mockIdentifyContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Identify: user-123');
    });

    it('should handle missing keys in display names', () => {
      const contextWithoutKey = {
        ...mockFeatureContext,
        key: undefined,
      };

      hook.afterEventEnqueue(contextWithoutKey);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Flag: unknown');
    });

    it('should handle identify events without context key', () => {
      const contextWithoutKey = {
        ...mockIdentifyContext,
        context: { kind: 'user' },
      };

      hook.afterEventEnqueue(contextWithoutKey);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Identify: anonymous');
    });
  });

  describe('event categorization', () => {
    beforeEach(() => {
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent });
    });

    it('should categorize feature events as flag', () => {
      hook.afterEventEnqueue(mockFeatureContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.category).toBe('flag');
    });

    it('should categorize custom events as custom', () => {
      hook.afterEventEnqueue(mockCustomContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.category).toBe('custom');
    });

    it('should categorize identify events as identify', () => {
      hook.afterEventEnqueue(mockIdentifyContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.category).toBe('identify');
    });

    it('should categorize summary events as debug', () => {
      const summaryContext = {
        ...mockFeatureContext,
        kind: 'summary',
      } as unknown as EventEnqueueContext;

      hook.afterEventEnqueue(summaryContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.category).toBe('debug');
    });
  });

  describe('metadata extraction', () => {
    beforeEach(() => {
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent });
    });

    it('should extract feature event metadata', () => {
      hook.afterEventEnqueue(mockFeatureContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata).toEqual({
        flagVersion: 1,
        variation: 0,
        trackEvents: true,
        reason: { kind: 'FALLTHROUGH' },
      });
    });

    it('should extract custom event metadata', () => {
      hook.afterEventEnqueue(mockCustomContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata).toEqual({
        data: { buttonId: 'submit-btn', page: '/checkout' },
        metricValue: 1.5,
        url: 'https://example.com/checkout',
      });
    });

    it('should extract identify event metadata', () => {
      hook.afterEventEnqueue(mockIdentifyContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata).toEqual({
        contextKind: 'user',
      });
    });

    it('should handle missing metadata fields gracefully', () => {
      const minimalContext: EventEnqueueContext = {
        kind: 'feature',
        key: 'minimal-flag',
        context: { kind: 'user', key: 'test-user' },
        creationDate: Date.now(),
      };

      hook.afterEventEnqueue(minimalContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata).toEqual({
        flagVersion: undefined,
        variation: undefined,
        trackEvents: undefined,
        reason: undefined,
      });
    });
  });

  describe('unique ID generation', () => {
    beforeEach(() => {
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent });
    });

    it('should generate unique IDs for multiple events', () => {
      hook.afterEventEnqueue(mockFeatureContext);
      hook.afterEventEnqueue(mockFeatureContext);
      hook.afterEventEnqueue(mockFeatureContext);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(3);

      const ids = mockOnNewEvent.mock.calls.map((call) => call[0].id);
      expect(new Set(ids).size).toBe(3); // All IDs should be unique
    });

    it('should include event kind in ID format', () => {
      hook.afterEventEnqueue(mockFeatureContext);
      hook.afterEventEnqueue(mockCustomContext);
      hook.afterEventEnqueue(mockIdentifyContext);

      const featureId = mockOnNewEvent.mock.calls[0][0].id;
      const customId = mockOnNewEvent.mock.calls[1][0].id;
      const identifyId = mockOnNewEvent.mock.calls[2][0].id;

      expect(featureId).toMatch(/^feature-/);
      expect(customId).toMatch(/^custom-/);
      expect(identifyId).toMatch(/^identify-/);
    });
  });

  describe('edge cases and performance', () => {
    beforeEach(() => {
      hook = new EventEnqueueHook({ onNewEvent: mockOnNewEvent });
    });

    it('should handle rapid event processing', () => {
      const startTime = performance.now();

      // Process 100 events rapidly
      for (let i = 0; i < 100; i++) {
        hook.afterEventEnqueue({
          ...mockFeatureContext,
          key: `flag-${i}`,
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100); // Should complete quickly
      expect(mockOnNewEvent).toHaveBeenCalledTimes(100);

      // All events should have unique IDs
      const ids = mockOnNewEvent.mock.calls.map((call) => call[0].id);
      expect(new Set(ids).size).toBe(100);
    });

    it('should handle events with null/undefined values', () => {
      const contextWithNulls: EventEnqueueContext = {
        kind: 'feature',
        key: null as any,
        context: { kind: 'user', key: 'test-user' },
        value: null,
        default: undefined,
        version: undefined,
        variation: null as any,
        creationDate: Date.now(),
        trackEvents: undefined,
        reason: undefined,
      };

      expect(() => hook.afterEventEnqueue(contextWithNulls)).not.toThrow();
      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Flag: unknown');
      expect(processedEvent.metadata).toEqual({
        flagVersion: undefined,
        variation: null,
        trackEvents: undefined,
        reason: undefined,
      });
    });

    it('should handle complex nested metadata', () => {
      const complexContext: EventEnqueueContext = {
        kind: 'custom',
        key: 'complex-event',
        context: { kind: 'user', key: 'test-user' },
        data: {
          nested: {
            deeply: {
              nested: {
                value: 'test',
                array: [1, 2, 3],
                boolean: true,
              },
            },
          },
          nullValue: null,
          undefinedValue: undefined,
        },
        creationDate: Date.now(),
      };

      hook.afterEventEnqueue(complexContext);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.data).toEqual(complexContext.data);
    });
  });
});
