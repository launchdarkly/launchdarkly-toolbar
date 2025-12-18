import type { Hook, HookMetadata, TrackSeriesContext } from '@launchdarkly/js-client-sdk';
import type { EventFilter, ProcessedEvent, SyntheticEventContext } from '../events';

export type AfterTrackHookConfig = {
  onNewEvent?: (event: ProcessedEvent) => void;
  filter?: EventFilter;
};

export class AfterTrackHook implements Hook {
  private config: AfterTrackHookConfig;
  private idCounter = 0;

  constructor(config: AfterTrackHookConfig = {}) {
    this.config = {
      filter: config.filter,
      onNewEvent: config.onNewEvent,
    };
  }

  getMetadata(): HookMetadata {
    return {
      name: 'AfterTrackHook',
    };
  }

  afterTrack(hookContext: TrackSeriesContext): void {
    try {
      const syntheticContext: SyntheticEventContext = {
        kind: 'custom',
        key: hookContext.key,
        context: hookContext.context,
        data: hookContext.data,
        metricValue: hookContext.metricValue,
        creationDate: Date.now(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      };

      if (!this.shouldProcessEvent()) {
        return;
      }

      const processedEvent = this.processEvent(syntheticContext);

      this.config.onNewEvent?.(processedEvent);
    } catch (error) {
      // Simple error handling - just log and continue
      console.warn('Event processing error in AfterTrackHook:', error);
    }
  }

  private shouldProcessEvent(): boolean {
    const filter = this.config.filter;
    if (!filter) return true;

    // AfterTrackHook only handles custom events
    return (
      !(filter.kinds && !filter.kinds.includes('custom')) &&
      !(filter.categories && !filter.categories.includes('custom'))
    );
  }

  private processEvent(context: SyntheticEventContext): ProcessedEvent {
    const timestamp = Date.now();
    // Create a guaranteed unique ID using timestamp + counter + random
    this.idCounter = (this.idCounter + 1) % 999999; // Reset counter at 999999
    const randomPart = Math.random().toString(36).substring(2, 8);
    const id = `${context.kind}-${timestamp}-${this.idCounter.toString().padStart(6, '0')}-${randomPart}`;

    return {
      id,
      kind: context.kind,
      key: context.key,
      timestamp,
      context,
      displayName: `Custom: ${context.key || 'unknown'}`,
      category: 'custom',
      metadata: this.extractMetadata(context),
    };
  }

  private extractMetadata(context: SyntheticEventContext): Record<string, unknown> {
    // AfterTrackHook only handles custom events
    return {
      data: context.data,
      metricValue: context.metricValue,
      url: context.url,
    };
  }
}
