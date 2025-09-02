/**
 * Enhanced TypeScript types for event processing
 */

import type { EventEnqueueContext } from 'launchdarkly-js-sdk-common';

/**
 * Strict typing for event kinds based on LaunchDarkly's event system
 */
export type EventKind = 'identify' | 'feature' | 'custom' | 'debug' | 'summary' | 'diagnostic';

/**
 * Event categories for UI organization
 */
export type EventCategory = 'flag' | 'custom' | 'identify' | 'debug';

/**
 * Enhanced processed event
 */
export interface ProcessedEvent {
  readonly id: string;
  readonly kind: EventKind;
  readonly key?: string;
  readonly timestamp: number;
  readonly context: EventEnqueueContext;
  readonly displayName: string;
  readonly category: EventCategory;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

/**
 * Event filter configuration
 */
export interface EventFilter {
  readonly kinds?: ReadonlyArray<EventKind>;
  readonly categories?: ReadonlyArray<EventCategory>;
  readonly includeIdentify?: boolean;
  readonly includeFeature?: boolean;
  readonly includeCustom?: boolean;
  readonly excludeDebugEvents?: boolean;
  readonly flagKeys?: ReadonlyArray<string>;
  readonly timeRange?: {
    readonly start: number;
    readonly end: number;
  };
}

/**
 * Type guards for event validation
 */
export function isValidEventKind(kind: string): kind is EventKind {
  return ['identify', 'feature', 'custom', 'debug', 'summary', 'diagnostic'].includes(kind);
}

export function isValidEventCategory(category: string): category is EventCategory {
  return ['flag', 'custom', 'identify', 'debug'].includes(category);
}
