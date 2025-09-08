import type { LDClient, LDPlugin } from 'launchdarkly-js-client-sdk';
import { EventEnqueueHook, EventStore } from '../hooks';
import { EventFilter, ProcessedEvent } from '../types/events';

/**
 * Configuration options for the EventInterceptionPlugin
 */
export interface EventInterceptionPluginConfig {
  /** Configuration for event filtering */
  filter?: EventFilter;
  /** Enable console logging for debugging */
  enableLogging?: boolean;
}

/**
 * Plugin dedicated to intercepting and processing LaunchDarkly events
 */
export class EventInterceptionPlugin implements LDPlugin {
  private eventEnqueueHook: EventEnqueueHook;
  private eventStore: EventStore;
  private config: EventInterceptionPluginConfig;

  constructor(config: EventInterceptionPluginConfig = {}) {
    this.config = {
      enableLogging: true,
      ...config,
    };

    this.eventStore = new EventStore();

    this.eventEnqueueHook = new EventEnqueueHook({
      filter: config.filter,
      onNewEvent: (event: ProcessedEvent) => {
        if (this.config.enableLogging) {
          console.log('🎯 Event intercepted:', {
            kind: event.kind,
            key: event.key,
            category: event.category,
            displayName: event.displayName,
          });
        }

        this.eventStore.addEvent(event);
      },
    });
  }

  getMetadata() {
    return {
      name: 'EventInterceptionPlugin',
    };
  }

  getHooks() {
    return [this.eventEnqueueHook];
  }

  register(_client: LDClient): void {}

  getEvents(): ProcessedEvent[] {
    return this.eventStore.getEvents();
  }

  subscribe(listener: () => void): () => void {
    return this.eventStore.subscribe(listener);
  }

  clearEvents(): void {
    this.eventStore.clear();
  }

  destroy(): void {
    this.eventStore.destroy();
  }
}
