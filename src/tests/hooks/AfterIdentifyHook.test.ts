import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AfterIdentifyHook, type AfterIdentifyHookConfig } from '../../hooks/AfterIdentifyHook';
import type { ProcessedEvent, EventFilter } from '../../types/events';
import type { IdentifySeriesData } from 'launchdarkly-js-sdk-common';

// Mock console methods to avoid noise in test output
const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('AfterIdentifyHook', () => {
  let hook: AfterIdentifyHook;
  let mockOnNewEvent: ReturnType<typeof vi.fn>;
  let mockIdentifyContext: { context: object; timeout?: number };
  let mockData: IdentifySeriesData;
  let mockResult: { status: string };

  beforeEach(() => {
    mockOnNewEvent = vi.fn();
    consoleSpy.mockClear();

    mockIdentifyContext = {
      context: { kind: 'user', key: 'user-123', name: 'John Doe' },
      timeout: 5000,
    };

    mockData = {};
    mockResult = { status: 'completed' };
  });

  describe('constructor', () => {
    it('should create an instance with default config', () => {
      hook = new AfterIdentifyHook();
      expect(hook).toBeInstanceOf(AfterIdentifyHook);
    });

    it('should create an instance with provided config', () => {
      const config: AfterIdentifyHookConfig = {
        onNewEvent: mockOnNewEvent,
        filter: {
          kinds: ['identify'],
        },
      };

      hook = new AfterIdentifyHook(config);
      expect(hook).toBeInstanceOf(AfterIdentifyHook);
    });
  });

  describe('getMetadata', () => {
    beforeEach(() => {
      hook = new AfterIdentifyHook();
    });

    it('should return correct hook metadata', () => {
      const metadata = hook.getMetadata();

      expect(metadata).toEqual({
        name: 'AfterIdentifyHook',
      });
    });
  });

  describe('afterIdentify', () => {
    beforeEach(() => {
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent });
    });

    it('should process identify events correctly', () => {
      const result = hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(result).toBe(mockData); // Should return the data passed in
      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;

      expect(processedEvent).toMatchObject({
        kind: 'identify',
        key: undefined, // Identify events don't have keys
        displayName: 'Identify: user-123',
        category: 'identify',
        metadata: {
          contextKind: 'user',
        },
      });
      expect(processedEvent.id).toMatch(/^identify-\d+-\d{6}-[a-z0-9]{6}$/);
      expect(processedEvent.timestamp).toBeGreaterThan(0);
    });

    it('should not process failed identify operations', () => {
      const failedResult = { status: 'error' };
      const result = hook.afterIdentify(mockIdentifyContext, mockData, failedResult);

      expect(result).toBe(mockData);
      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should handle anonymous users correctly', () => {
      const anonymousContext = {
        context: { key: 'anon-user', anonymous: true }, // No 'kind' property, so should check 'anonymous'
      };
      hook.afterIdentify(anonymousContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Identify: anon-user');
      expect(processedEvent.metadata?.contextKind).toBe('anonymousUser');
    });

    it('should handle contexts without key', () => {
      const contextWithoutKey = {
        context: { kind: 'user', name: 'No Key User' },
      };
      hook.afterIdentify(contextWithoutKey, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Identify: anonymous');
    });

    it('should handle legacy user contexts', () => {
      const legacyContext = {
        context: { key: 'legacy-user', name: 'Legacy User' }, // No 'kind' property
      };
      hook.afterIdentify(legacyContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.contextKind).toBe('user');
    });

    it('should handle multi-kind contexts', () => {
      const multiKindContext = {
        context: { kind: 'organization', key: 'org-123' },
      };
      hook.afterIdentify(multiKindContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.contextKind).toBe('organization');
    });

    it('should handle events without onNewEvent callback', () => {
      hook = new AfterIdentifyHook(); // No callback provided

      const result = hook.afterIdentify(mockIdentifyContext, mockData, mockResult);
      expect(result).toBe(mockData);
    });

    it('should handle errors gracefully', () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      hook = new AfterIdentifyHook({ onNewEvent: errorCallback });

      const result = hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(result).toBe(mockData);
      expect(consoleSpy).toHaveBeenCalledWith('Event processing error in AfterIdentifyHook:', expect.any(Error));
    });
  });

  describe('event filtering', () => {
    it('should process events when no filter is provided', () => {
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent });

      hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should filter by event kinds', () => {
      const filter: EventFilter = {
        kinds: ['custom'], // Exclude identify events
      };
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should allow identify events when kinds filter includes identify', () => {
      const filter: EventFilter = {
        kinds: ['identify', 'custom'],
      };
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should filter by categories', () => {
      const filter: EventFilter = {
        categories: ['flag'], // Exclude identify category
      };
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should allow identify events when categories filter includes identify', () => {
      const filter: EventFilter = {
        categories: ['identify', 'custom'],
      };
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should ignore flagKeys filter for identify events', () => {
      const filter: EventFilter = {
        flagKeys: ['some-flag'], // Should not affect identify events
      };
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe('context kind determination', () => {
    beforeEach(() => {
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent });
    });

    it('should determine context kind from kind property', () => {
      const contextWithKind = {
        context: { kind: 'organization', key: 'org-123' },
      };
      hook.afterIdentify(contextWithKind, mockData, mockResult);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.contextKind).toBe('organization');
    });

    it('should determine anonymous user from anonymous property', () => {
      const anonymousContext = {
        context: { key: 'anon-123', anonymous: true },
      };
      hook.afterIdentify(anonymousContext, mockData, mockResult);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.contextKind).toBe('anonymousUser');
    });

    it('should default to user for legacy contexts', () => {
      const legacyContext = {
        context: { key: 'user-123', name: 'User' },
      };
      hook.afterIdentify(legacyContext, mockData, mockResult);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.contextKind).toBe('user');
    });

    it('should default to user for invalid contexts', () => {
      const invalidContext = {
        context: {} as object,
      };
      hook.afterIdentify(invalidContext, mockData, mockResult);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.contextKind).toBe('user');
    });
  });

  describe('unique ID generation', () => {
    beforeEach(() => {
      hook = new AfterIdentifyHook({ onNewEvent: mockOnNewEvent });
    });

    it('should generate unique IDs for multiple events', () => {
      hook.afterIdentify(mockIdentifyContext, mockData, mockResult);
      hook.afterIdentify(mockIdentifyContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(2);
      const event1 = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      const event2 = mockOnNewEvent.mock.calls[1][0] as ProcessedEvent;

      expect(event1.id).not.toBe(event2.id);
      expect(event1.id).toMatch(/^identify-\d+-\d{6}-[a-z0-9]{6}$/);
      expect(event2.id).toMatch(/^identify-\d+-\d{6}-[a-z0-9]{6}$/);
    });
  });
});
