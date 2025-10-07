import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  AfterEvaluationHook,
  type AfterEvaluationHookConfig,
} from '../../../../toolbar-types/src/types/hooks/AfterEvaluationHook';
import type { EvaluationSeriesData, EvaluationSeriesContext, LDEvaluationDetail } from 'launchdarkly-js-sdk-common';
import { EventFilter, ProcessedEvent } from '@launchdarkly/toolbar-types';

// Mock console methods to avoid noise in test output
const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('AfterEvaluationHook', () => {
  let hook: AfterEvaluationHook;
  let mockOnNewEvent: ReturnType<typeof vi.fn>;
  let mockEvaluationContext: EvaluationSeriesContext;
  let mockData: EvaluationSeriesData;
  let mockResult: LDEvaluationDetail;

  beforeEach(() => {
    mockOnNewEvent = vi.fn();
    consoleSpy.mockClear();

    mockEvaluationContext = {
      flagKey: 'test-flag',
      context: { kind: 'user', key: 'test-user' },
      defaultValue: false,
    };

    mockData = {};
    mockResult = {
      value: true,
      variationIndex: 1,
      reason: { kind: 'FALLTHROUGH' },
    };
  });

  describe('constructor', () => {
    it('should create an instance with default config', () => {
      hook = new AfterEvaluationHook();
      expect(hook).toBeInstanceOf(AfterEvaluationHook);
    });

    it('should create an instance with provided config', () => {
      const config: AfterEvaluationHookConfig = {
        onNewEvent: mockOnNewEvent,
        filter: {
          kinds: ['feature'],
        },
      };

      hook = new AfterEvaluationHook(config);
      expect(hook).toBeInstanceOf(AfterEvaluationHook);
    });
  });

  describe('getMetadata', () => {
    beforeEach(() => {
      hook = new AfterEvaluationHook();
    });

    it('should return correct hook metadata', () => {
      const metadata = hook.getMetadata();

      expect(metadata).toEqual({
        name: 'AfterEvaluationHook',
      });
    });
  });

  describe('afterEvaluation', () => {
    beforeEach(() => {
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent });
    });

    it('should process evaluation events correctly', () => {
      const result = hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(result).toBe(mockData); // Should return the data passed in
      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;

      expect(processedEvent).toMatchObject({
        kind: 'feature',
        key: 'test-flag',
        displayName: 'Flag: test-flag',
        category: 'flag',
        metadata: {
          flagVersion: undefined, // Not available from afterEvaluation hook
          variation: 1,
          trackEvents: undefined,
          reason: { kind: 'FALLTHROUGH' },
          defaultValue: false,
        },
      });
      expect(processedEvent.id).toMatch(/^feature-\d+-\d{6}-[a-z0-9]{6}$/);
      expect(processedEvent.timestamp).toBeGreaterThan(0);
    });

    it('should handle evaluations without variation index', () => {
      const resultWithoutVariation = {
        value: 'default-value',
        reason: { kind: 'OFF' },
      };
      hook.afterEvaluation(mockEvaluationContext, mockData, resultWithoutVariation);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.variation).toBeUndefined();
    });

    it('should handle evaluations without reason', () => {
      const resultWithoutReason = {
        value: true,
        variationIndex: 0,
      };
      hook.afterEvaluation(mockEvaluationContext, mockData, resultWithoutReason);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata?.reason).toBeUndefined();
    });

    it('should handle flags without key', () => {
      const contextWithoutKey = { ...mockEvaluationContext, flagKey: '' };
      hook.afterEvaluation(contextWithoutKey, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.displayName).toBe('Flag: unknown');
    });

    it('should handle complex flag values', () => {
      const complexResult = {
        value: { feature: 'enabled', config: { timeout: 5000 } },
        variationIndex: 2,
        reason: { kind: 'RULE_MATCH', ruleIndex: 0 },
      };
      hook.afterEvaluation(mockEvaluationContext, mockData, complexResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.context.value).toEqual({ feature: 'enabled', config: { timeout: 5000 } });
    });

    it('should handle events without onNewEvent callback', () => {
      hook = new AfterEvaluationHook(); // No callback provided

      const result = hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);
      expect(result).toBe(mockData);
    });

    it('should handle errors gracefully', () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error('Callback error');
      });
      hook = new AfterEvaluationHook({ onNewEvent: errorCallback });

      const result = hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(result).toBe(mockData);
      expect(consoleSpy).toHaveBeenCalledWith('Event processing error in AfterEvaluationHook:', expect.any(Error));
    });
  });

  describe('event filtering', () => {
    it('should process events when no filter is provided', () => {
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should filter by event kinds', () => {
      const filter: EventFilter = {
        kinds: ['custom'], // Exclude feature events
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should allow feature events when kinds filter includes feature', () => {
      const filter: EventFilter = {
        kinds: ['feature', 'custom'],
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should filter by categories', () => {
      const filter: EventFilter = {
        categories: ['custom'], // Exclude flag category
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should allow feature events when categories filter includes flag', () => {
      const filter: EventFilter = {
        categories: ['flag', 'custom'],
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should filter by flag keys', () => {
      const filter: EventFilter = {
        flagKeys: ['other-flag'], // Exclude test-flag
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });

    it('should allow events when flagKeys filter includes the flag', () => {
      const filter: EventFilter = {
        flagKeys: ['test-flag', 'another-flag'],
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should handle missing flag key in filter', () => {
      const contextWithoutKey = { ...mockEvaluationContext, flagKey: '' };
      const filter: EventFilter = {
        flagKeys: ['test-flag'],
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(contextWithoutKey, mockData, mockResult);

      // Should be allowed since context.key is empty
      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should combine multiple filters correctly', () => {
      const filter: EventFilter = {
        kinds: ['feature'],
        categories: ['flag'],
        flagKeys: ['test-flag'],
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(1);
    });

    it('should reject when any filter condition fails', () => {
      const filter: EventFilter = {
        kinds: ['feature'], // Allow
        categories: ['flag'], // Allow
        flagKeys: ['other-flag'], // Reject
      };
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent, filter });

      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).not.toHaveBeenCalled();
    });
  });

  describe('metadata extraction', () => {
    beforeEach(() => {
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent });
    });

    it('should extract feature event metadata correctly', () => {
      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata).toEqual({
        flagVersion: undefined, // Not available from afterEvaluation
        variation: 1,
        trackEvents: undefined, // Not available from afterEvaluation
        reason: { kind: 'FALLTHROUGH' },
        defaultValue: false,
      });
    });

    it('should handle missing metadata fields gracefully', () => {
      const minimalResult = { value: 'simple-value' };
      hook.afterEvaluation(mockEvaluationContext, mockData, minimalResult);

      const processedEvent = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      expect(processedEvent.metadata).toEqual({
        flagVersion: undefined,
        variation: undefined,
        trackEvents: undefined,
        reason: undefined,
        defaultValue: false,
      });
    });
  });

  describe('unique ID generation', () => {
    beforeEach(() => {
      hook = new AfterEvaluationHook({ onNewEvent: mockOnNewEvent });
    });

    it('should generate unique IDs for multiple events', () => {
      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);
      hook.afterEvaluation(mockEvaluationContext, mockData, mockResult);

      expect(mockOnNewEvent).toHaveBeenCalledTimes(2);
      const event1 = mockOnNewEvent.mock.calls[0][0] as ProcessedEvent;
      const event2 = mockOnNewEvent.mock.calls[1][0] as ProcessedEvent;

      expect(event1.id).not.toBe(event2.id);
      expect(event1.id).toMatch(/^feature-\d+-\d{6}-[a-z0-9]{6}$/);
      expect(event2.id).toMatch(/^feature-\d+-\d{6}-[a-z0-9]{6}$/);
    });
  });
});
