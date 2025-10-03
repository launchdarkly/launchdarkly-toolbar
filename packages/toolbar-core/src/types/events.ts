export interface LDEvaluationReason {
  readonly kind?: string;
  readonly errorKind?: string;
}

export interface SyntheticEventContext {
  readonly kind: EventKind;
  readonly key?: string;
  readonly context?: object;
  readonly creationDate: number;
  readonly data?: unknown;
  readonly metricValue?: number;
  readonly url?: string;
  readonly value?: any;
  readonly variation?: number | null;
  readonly default?: any;
  readonly reason?: LDEvaluationReason;
  readonly version?: number;
  readonly trackEvents?: boolean;
  readonly debugEventsUntilDate?: number;
  readonly contextKind?: string;
}

/**
 * Valid event kinds that can be emitted by the LaunchDarkly SDK
 */
const VALID_EVENT_KINDS = ['identify', 'feature', 'custom', 'debug', 'summary', 'diagnostic'] as const;

/**
 * Valid event categories used for organizing events
 */
const VALID_EVENT_CATEGORIES = ['flag', 'custom', 'identify', 'debug'] as const;

/**
 * Strict typing for event kinds based on LaunchDarkly's event system
 */
export type EventKind = (typeof VALID_EVENT_KINDS)[number];

/**
 * Event categories for UI organization
 */
export type EventCategory = (typeof VALID_EVENT_CATEGORIES)[number];

/**
 * Enhanced processed event
 */
export interface ProcessedEvent {
  readonly id: string;
  readonly kind: EventKind;
  readonly key?: string;
  readonly timestamp: number;
  readonly context: SyntheticEventContext;
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
  return VALID_EVENT_KINDS.includes(kind as EventKind);
}

export function isValidEventCategory(category: string): category is EventCategory {
  return VALID_EVENT_CATEGORIES.includes(category as EventCategory);
}
