import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventStore } from '../../../../toolbar-types/src/types/hooks/EventStore';
import { ProcessedEvent } from '@launchdarkly/toolbar-types';

// Mock console methods to avoid noise in test output
const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('EventStore', () => {
  let eventStore: EventStore;
  let mockEvent: ProcessedEvent;

  beforeEach(() => {
    eventStore = new EventStore();
    consoleSpy.mockClear();

    mockEvent = {
      id: 'test-event-1',
      kind: 'feature',
      key: 'test-flag',
      timestamp: Date.now(),
      context: {
        kind: 'feature',
        key: 'test-flag',
        context: { kind: 'user', key: 'test-user' },
        value: true,
        default: false,
        version: 1,
        variation: 0,
        creationDate: Date.now(),
      },
      displayName: 'Test Flag',
      category: 'flag',
      metadata: {
        value: true,
        variation: 0,
      },
    };
  });

  describe('addEvent', () => {
    it('should add a single event', () => {
      eventStore.addEvent(mockEvent);

      const events = eventStore.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual(mockEvent);
    });

    it('should add multiple events in order', () => {
      const event2: ProcessedEvent = {
        ...mockEvent,
        id: 'test-event-2',
        timestamp: mockEvent.timestamp + 1000,
      };

      eventStore.addEvent(mockEvent);
      eventStore.addEvent(event2);

      const events = eventStore.getEvents();
      expect(events).toHaveLength(2);
      expect(events[0]).toEqual(mockEvent);
      expect(events[1]).toEqual(event2);
    });

    it('should maintain maximum of 100 events', () => {
      // Add 105 events to test the limit
      for (let i = 0; i < 105; i++) {
        const event: ProcessedEvent = {
          ...mockEvent,
          id: `test-event-${i}`,
          timestamp: mockEvent.timestamp + i,
        };
        eventStore.addEvent(event);
      }

      const events = eventStore.getEvents();
      expect(events).toHaveLength(100);

      // Verify oldest events were removed (should start from event-5)
      expect(events[0].id).toBe('test-event-5');
      expect(events[99].id).toBe('test-event-104');
    });

    it('should handle errors gracefully during listener notification', () => {
      // Create a listener that throws an error only after the initial call
      let callCount = 0;
      const errorListener = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount > 1) {
          throw new Error('Listener error');
        }
      });
      const normalListener = vi.fn();

      eventStore.subscribe(errorListener);
      eventStore.subscribe(normalListener);

      // Clear initial calls
      errorListener.mockClear();
      normalListener.mockClear();
      consoleSpy.mockClear();

      // Adding an event should trigger listener error handling
      eventStore.addEvent(mockEvent);

      // Should log the listener error
      expect(consoleSpy).toHaveBeenCalledWith('Listener error:', expect.any(Error));

      // Normal listener should still be called despite error in other listener
      expect(normalListener).toHaveBeenCalledTimes(1);

      // Event should still be added successfully
      expect(eventStore.getEvents()).toHaveLength(1);
    });

    it('should notify listeners when event is added', () => {
      const listener = vi.fn();
      eventStore.subscribe(listener);

      // Clear initial notification call
      listener.mockClear();

      eventStore.addEvent(mockEvent);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEvents', () => {
    it('should return empty array initially', () => {
      expect(eventStore.getEvents()).toEqual([]);
    });

    it('should return all events after adding them', () => {
      const events = [mockEvent, { ...mockEvent, id: 'test-event-2' }];

      events.forEach((event) => eventStore.addEvent(event));

      expect(eventStore.getEvents()).toEqual(events);
    });

    it('should return a copy of events array', () => {
      eventStore.addEvent(mockEvent);

      const events1 = eventStore.getEvents();
      const events2 = eventStore.getEvents();

      expect(events1).not.toBe(events2);
      expect(events1).toEqual(events2);
    });
  });

  describe('subscribe', () => {
    it('should call listener immediately upon subscription', () => {
      const listener = vi.fn();

      eventStore.subscribe(listener);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should call listener when events are added', () => {
      const listener = vi.fn();
      eventStore.subscribe(listener);

      // Clear initial call
      listener.mockClear();

      eventStore.addEvent(mockEvent);
      expect(listener).toHaveBeenCalledTimes(1);

      eventStore.addEvent({ ...mockEvent, id: 'test-event-2' });
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('should call listener when events are cleared', () => {
      const listener = vi.fn();
      eventStore.addEvent(mockEvent);
      eventStore.subscribe(listener);

      // Clear initial call
      listener.mockClear();

      eventStore.clear();
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = eventStore.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');

      // Clear initial call
      listener.mockClear();

      // Unsubscribe and verify listener is not called
      unsubscribe();
      eventStore.addEvent(mockEvent);

      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      eventStore.subscribe(listener1);
      eventStore.subscribe(listener2);

      // Clear initial calls
      listener1.mockClear();
      listener2.mockClear();

      eventStore.addEvent(mockEvent);

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear', () => {
    it('should remove all events', () => {
      eventStore.addEvent(mockEvent);
      eventStore.addEvent({ ...mockEvent, id: 'test-event-2' });

      expect(eventStore.getEvents()).toHaveLength(2);

      eventStore.clear();

      expect(eventStore.getEvents()).toHaveLength(0);
    });

    it('should notify listeners when cleared', () => {
      const listener = vi.fn();
      eventStore.addEvent(mockEvent);
      eventStore.subscribe(listener);

      // Clear initial call
      listener.mockClear();

      eventStore.clear();

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should work when store is already empty', () => {
      const listener = vi.fn();
      eventStore.subscribe(listener);

      // Clear initial call
      listener.mockClear();

      eventStore.clear();

      expect(eventStore.getEvents()).toHaveLength(0);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('destroy', () => {
    it('should clear all events', () => {
      eventStore.addEvent(mockEvent);
      eventStore.addEvent({ ...mockEvent, id: 'test-event-2' });

      eventStore.destroy();

      expect(eventStore.getEvents()).toHaveLength(0);
    });

    it('should remove all listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      eventStore.subscribe(listener1);
      eventStore.subscribe(listener2);

      eventStore.destroy();

      // Clear previous calls
      listener1.mockClear();
      listener2.mockClear();

      // Add event after destroy - listeners should not be called
      eventStore.addEvent(mockEvent);

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('should be safe to call multiple times', () => {
      eventStore.addEvent(mockEvent);

      eventStore.destroy();
      eventStore.destroy();

      expect(eventStore.getEvents()).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle events with identical timestamps', () => {
      const timestamp = Date.now();
      const event1: ProcessedEvent = { ...mockEvent, id: 'event-1', timestamp };
      const event2: ProcessedEvent = { ...mockEvent, id: 'event-2', timestamp };

      eventStore.addEvent(event1);
      eventStore.addEvent(event2);

      const events = eventStore.getEvents();
      expect(events).toHaveLength(2);
      expect(events[0].id).toBe('event-1');
      expect(events[1].id).toBe('event-2');
    });

    it('should handle events with minimal required properties', () => {
      const minimalEvent: ProcessedEvent = {
        id: 'minimal-event',
        kind: 'custom',
        timestamp: Date.now(),
        context: {
          kind: 'custom',
          key: 'custom-event',
          context: { kind: 'user', key: 'test-user' },
          creationDate: Date.now(),
          data: { action: 'test' },
        },
        displayName: 'Custom Event',
        category: 'custom',
      };

      eventStore.addEvent(minimalEvent);

      const events = eventStore.getEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toEqual(minimalEvent);
    });

    it('should handle events with complex metadata', () => {
      const complexEvent: ProcessedEvent = {
        ...mockEvent,
        metadata: {
          nestedObject: {
            property: 'value',
            number: 42,
            array: [1, 2, 3],
          },
          nullValue: null,
          undefinedValue: undefined,
          booleanValue: false,
        },
      };

      eventStore.addEvent(complexEvent);

      const events = eventStore.getEvents();
      expect(events[0].metadata).toEqual(complexEvent.metadata);
    });
  });

  describe('performance', () => {
    it('should handle rapid event addition efficiently', () => {
      const startTime = performance.now();

      // Add 1000 events rapidly
      for (let i = 0; i < 1000; i++) {
        eventStore.addEvent({
          ...mockEvent,
          id: `perf-event-${i}`,
          timestamp: mockEvent.timestamp + i,
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (adjust threshold as needed)
      expect(duration).toBeLessThan(100);
      expect(eventStore.getEvents()).toHaveLength(100); // Should be limited to MAX_EVENTS
    });

    it('should handle many listeners efficiently', () => {
      const listeners: Array<() => void> = [];

      // Add 100 listeners
      for (let i = 0; i < 100; i++) {
        const listener = vi.fn();
        listeners.push(listener);
        eventStore.subscribe(listener);
      }

      // Clear initial calls
      listeners.forEach((listener) => (listener as any).mockClear());

      const startTime = performance.now();
      eventStore.addEvent(mockEvent);
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(50);

      // All listeners should have been called
      listeners.forEach((listener) => {
        // oxlint-disable-next-line no-standalone-expect
        expect(listener).toHaveBeenCalledTimes(1);
      });
    });
  });
});
