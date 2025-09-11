import { Hook } from 'launchdarkly-js-client-sdk';
import { HookMetadata, EvaluationSeriesData } from 'launchdarkly-js-sdk-common';
import type { EventFilter, ProcessedEvent, EventCategory } from '../types/events';
import { isValidEventKind } from '../types/events';

export type AfterEvaluationHookConfig = {
  onNewEvent?: (event: ProcessedEvent) => void;
  filter?: EventFilter;
};

export class AfterEvaluationHook implements Hook {
  private config: AfterEvaluationHookConfig;
  private idCounter = 0;

  constructor(config: AfterEvaluationHookConfig = {}) {
    this.config = {
      filter: {
        includeIdentify: true,
        includeFeature: true,
        includeCustom: true,
        excludeDebugEvents: false,
        ...config.filter,
      },
      onNewEvent: config.onNewEvent,
    };
  }

  getMetadata(): HookMetadata {
    return {
      name: 'AfterEvaluationHook',
    };
  }

  afterEvaluation(
    hookContext: { flagKey: string; context: object; defaultValue: any },
    data: EvaluationSeriesData,
    result: { value: any; variationIndex?: number; reason?: object },
  ): EvaluationSeriesData {
    try {
      // Create a synthetic EventEnqueueContext-like object from the evaluation parameters
      const syntheticContext = {
        kind: 'feature',
        key: hookContext.flagKey,
        context: hookContext.context,
        value: result.value,
        variation: result.variationIndex,
        default: hookContext.defaultValue,
        reason: result.reason,
        creationDate: Date.now(),
        // Note: We don't have access to version, trackEvents, or debugEventsUntilDate
        // from the afterEvaluation hook, so these will be undefined
      };

      // Event filtering
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

  private shouldProcessEvent(context: any): boolean {
    const filter = this.config.filter;
    if (!filter) return true;

    // Validate event kind
    if (!isValidEventKind(context.kind)) {
      console.warn('Invalid event kind detected:', context.kind);
      return false;
    }

    // Check specific kinds if provided
    if (filter.kinds && !filter.kinds.includes(context.kind)) {
      return false;
    }

    // Check categories if provided
    if (filter.categories) {
      const category = this.categorizeEvent(context);
      if (!filter.categories.includes(category)) {
        return false;
      }
    }

    // Check flag keys if provided
    if (filter.flagKeys && context.key && !filter.flagKeys.includes(context.key)) {
      return false;
    }

    // Check event type filters (backward compatibility)
    switch (context.kind) {
      case 'identify':
        return filter.includeIdentify !== false;
      case 'feature':
        return filter.includeFeature !== false;
      case 'custom':
        return filter.includeCustom !== false;
      default:
        return true;
    }
  }

  private processEvent(context: any): ProcessedEvent {
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
      displayName: this.generateDisplayName(context),
      category: this.categorizeEvent(context),
      metadata: this.extractMetadata(context),
    };
  }

  private generateDisplayName(context: any): string {
    switch (context.kind) {
      case 'feature':
        return `Flag: ${context.key || 'unknown'}`;
      case 'custom':
        return `Custom: ${context.key || 'unknown'}`;
      case 'identify':
        return `Identify: ${context.context?.key || 'anonymous'}`;
      default:
        return `${context.kind}: ${context.key || 'unknown'}`;
    }
  }

  private categorizeEvent(context: any): EventCategory {
    switch (context.kind) {
      case 'feature':
        return 'flag';
      case 'custom':
        return 'custom';
      case 'identify':
        return 'identify';
      default:
        return 'debug';
    }
  }

  private extractMetadata(context: any): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};

    // Add relevant context metadata based on event kind
    switch (context.kind) {
      case 'feature':
        metadata.flagVersion = context.version;
        metadata.variation = context.variation;
        metadata.trackEvents = context.trackEvents;
        metadata.reason = context.reason;
        metadata.defaultValue = context.default;
        break;
      case 'custom':
        metadata.data = context.data;
        metadata.metricValue = context.metricValue;
        metadata.url = context.url;
        break;
      case 'identify':
        metadata.contextKind = context.contextKind;
        break;
    }

    return metadata;
  }
}
