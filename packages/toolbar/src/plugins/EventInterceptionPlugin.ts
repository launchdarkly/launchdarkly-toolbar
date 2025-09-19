import type { Hook, LDClient, LDPluginEnvironmentMetadata, LDPluginMetadata } from 'launchdarkly-js-client-sdk';
import { AfterTrackHook, AfterIdentifyHook, AfterEvaluationHook, EventStore } from '../hooks';
import type { EventFilter, ProcessedEvent } from '../types/events';
import type { IEventInterceptionPlugin } from '../types/plugin';
import { telemetry } from '../services';

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
export class EventInterceptionPlugin implements IEventInterceptionPlugin {
  private afterTrackHook: AfterTrackHook;
  private afterIdentifyHook: AfterIdentifyHook;
  private afterEvaluationHook: AfterEvaluationHook;
  private eventStore: EventStore;
  private config: EventInterceptionPluginConfig;

  constructor(config: EventInterceptionPluginConfig = {}) {
    this.config = {
      enableLogging: false,
      ...config,
    };

    this.eventStore = new EventStore();

    const onNewEvent = (event: ProcessedEvent) => {
      if (this.config.enableLogging) {
        console.log('🎯 Event intercepted:', {
          kind: event.kind,
          key: event.key,
          category: event.category,
          displayName: event.displayName,
        });
      }

      this.eventStore.addEvent(event);
    };

    this.afterTrackHook = new AfterTrackHook({
      filter: config.filter,
      onNewEvent,
    });

    this.afterIdentifyHook = new AfterIdentifyHook({
      filter: config.filter,
      onNewEvent,
    });

    this.afterEvaluationHook = new AfterEvaluationHook({
      filter: config.filter,
      onNewEvent,
    });
  }

  getMetadata(): LDPluginMetadata {
    return {
      name: 'EventInterceptionPlugin',
    };
  }

  getHooks(metadata: LDPluginEnvironmentMetadata): Hook[] {
    try {
      const clientSideId = metadata.clientSideId;
      telemetry.setIdentity({ clientSideId });
    } catch {
      // no-op
    }
    return [this.afterTrackHook, this.afterIdentifyHook, this.afterEvaluationHook];
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
