import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ANALYTICS_EVENT_PREFIX } from '../../utils/analytics';
import { EventInterceptionPlugin } from '@launchdarkly/toolbar-types';

describe('EventInterceptionPlugin', () => {
  let plugin: EventInterceptionPlugin;

  beforeEach(() => {
    vi.clearAllMocks();
    plugin = new EventInterceptionPlugin({ eventCapacity: 10 });
    plugin.clearEvents();
  });

  test(`does not add ${ANALYTICS_EVENT_PREFIX} events to the event store`, () => {
    const hooks = plugin.getHooks({} as any);

    const afterTrack = hooks.find((h) => (h as any).getMetadata?.()?.name === 'AfterTrackHook') as any;

    // Simulate a custom (track) event with a toolbar-prefixed key
    afterTrack.afterTrack({
      key: `${ANALYTICS_EVENT_PREFIX}.customEvent`,
      context: { key: 'user-1' },
      data: { some: 'data' },
      metricValue: undefined,
    });

    const events = plugin.getEvents();
    expect(events).toHaveLength(0);
  });

  test('adds non-toolbar events to the event store', () => {
    plugin.clearEvents();
    const hooks = plugin.getHooks({} as any);
    const afterTrack = hooks.find((h) => (h as any).getMetadata?.()?.name === 'AfterTrackHook') as any;

    afterTrack.afterTrack({
      key: 'my.custom.event',
      context: { key: 'user-1' },
      data: { foo: 'bar' },
      metricValue: 42,
    });

    const events = plugin.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].key).toBe('my.custom.event');
    expect(events[0].kind).toBe('custom');
    expect(events[0].category).toBe('custom');
    expect(events[0].metadata).toHaveProperty('metricValue', 42);
  });
});
