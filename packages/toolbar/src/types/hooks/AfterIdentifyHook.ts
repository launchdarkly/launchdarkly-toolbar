import type { Hook, HookMetadata,
  IdentifySeriesContext,
  IdentifySeriesData,
  IdentifySeriesResult,
  LDContext, } from '@launchdarkly/js-client-sdk';

import type { EventFilter, ProcessedEvent, SyntheticEventContext } from '../events';

export type AfterIdentifyHookConfig = {
  onNewEvent?: (event: ProcessedEvent) => void;
  filter?: EventFilter;
};

export class AfterIdentifyHook implements Hook {
  private config: AfterIdentifyHookConfig;
  private idCounter = 0;

  constructor(config: AfterIdentifyHookConfig = {}) {
    this.config = {
      filter: config.filter,
      onNewEvent: config.onNewEvent,
    };
  }

  getMetadata(): HookMetadata {
    return {
      name: 'AfterIdentifyHook',
    };
  }

  afterIdentify(
    hookContext: IdentifySeriesContext,
    data: IdentifySeriesData,
    result: IdentifySeriesResult,
  ): IdentifySeriesData {
    try {
      // Only process successful identify operations
      if (result.status !== 'completed') {
        return data;
      }

      const syntheticContext: SyntheticEventContext = {
        kind: 'identify',
        context: hookContext.context,
        creationDate: Date.now(),
        contextKind: this.determineContextKind(hookContext.context),
      };

      if (!this.shouldProcessEvent()) {
        return data;
      }

      const processedEvent = this.processEvent(syntheticContext);

      this.config.onNewEvent?.(processedEvent);
    } catch (error) {
      // Simple error handling - just log and continue
      console.warn('Event processing error in AfterIdentifyHook:', error);
    }

    return data;
  }

  private determineContextKind(context: LDContext): string {
    if (context && typeof context === 'object') {
      if ('kind' in context && context.kind) {
        return context.kind;
      }
      // Legacy user context
      if (context.anonymous) {
        return 'anonymousUser';
      }
      return 'user';
    }
    return 'user';
  }

  private shouldProcessEvent(): boolean {
    const filter = this.config.filter;
    if (!filter) return true;

    // AfterIdentifyHook only handles identify events
    return (
      !(filter.kinds && !filter.kinds.includes('identify')) &&
      !(filter.categories && !filter.categories.includes('identify'))
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
      displayName: `Identify: ${(context.context as any)?.key || 'anonymous'}`,
      category: 'identify',
      metadata: this.extractMetadata(context),
    };
  }

  private extractMetadata(context: SyntheticEventContext): Record<string, unknown> {
    // AfterIdentifyHook only handles identify events
    return {
      contextKind: context.contextKind,
    };
  }
}
