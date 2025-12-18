import type { Hook, HookMetadata, EvaluationSeriesData, LDEvaluationDetail, EvaluationSeriesContext } from '@launchdarkly/js-client-sdk';
import type { EventFilter, ProcessedEvent, SyntheticEventContext } from '../events';

export type AfterEvaluationHookConfig = {
  onNewEvent?: (event: ProcessedEvent) => void;
  filter?: EventFilter;
};

export class AfterEvaluationHook implements Hook {
  private config: AfterEvaluationHookConfig;
  private idCounter = 0;

  constructor(config: AfterEvaluationHookConfig = {}) {
    this.config = {
      filter: config.filter,
      onNewEvent: config.onNewEvent,
    };
  }

  getMetadata(): HookMetadata {
    return {
      name: 'AfterEvaluationHook',
    };
  }

  afterEvaluation(
    hookContext: EvaluationSeriesContext,
    data: EvaluationSeriesData,
    detail: LDEvaluationDetail,
  ): EvaluationSeriesData {
    try {
      const syntheticContext: SyntheticEventContext = {
        kind: 'feature',
        key: hookContext.flagKey,
        context: hookContext.context,
        value: detail.value,
        variation: detail.variationIndex,
        default: hookContext.defaultValue,
        reason: detail.reason ?? undefined,
        creationDate: Date.now(),
        // Note: We don't have access to version, trackEvents, or debugEventsUntilDate
        // from the afterEvaluation hook, so these will be undefined
      };

      if (!this.shouldProcessEvent(syntheticContext)) {
        return data;
      }

      const processedEvent = this.processEvent(syntheticContext);

      this.config.onNewEvent?.(processedEvent);
    } catch (error) {
      // Simple error handling - just log and continue
      console.warn('Event processing error in AfterEvaluationHook:', error);
    }

    return data;
  }

  private shouldProcessEvent(context: SyntheticEventContext): boolean {
    const filter = this.config.filter;
    if (!filter) return true;

    // AfterEvaluationHook only handles feature events
    return (
      !(filter.kinds && !filter.kinds.includes('feature')) &&
      !(filter.categories && !filter.categories.includes('flag')) &&
      !(filter.flagKeys && context.key && !filter.flagKeys.includes(context.key))
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
      displayName: `Flag: ${context.key || 'unknown'}`,
      category: 'flag',
      metadata: this.extractMetadata(context),
    };
  }

  private extractMetadata(context: SyntheticEventContext): Record<string, unknown> {
    // AfterEvaluationHook only handles feature events
    return {
      flagVersion: context.version,
      variation: context.variation,
      trackEvents: context.trackEvents,
      reason: context.reason,
      defaultValue: context.default,
    };
  }
}
