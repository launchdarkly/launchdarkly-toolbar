import type { LDContext, LDMultiKindContext, LDSingleKindContext } from '@launchdarkly/js-client-sdk';

/**
 * Check if two contexts are the same using their stable IDs (kind+key)
 * @deprecated Prefer comparing getStableContextId(a) === getStableContextId(b) directly
 */
export function areContextsEqual(a: LDContext | null | undefined, b: LDContext | null | undefined): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return getStableContextId(a) === getStableContextId(b);
}

/**
 * Gets the kind of an LDContext (handles multi-kind and single-kind)
 */
export function getContextKind(context: LDContext | null | undefined): string {
  if (!context) return '';

  if ('kind' in context && context.kind === 'multi') {
    return 'multi';
  }

  if ('kind' in context && typeof context.kind === 'string') {
    return context.kind;
  }

  // Legacy user context (no kind specified means "user")
  if ('key' in context) {
    return 'user';
  }

  return '';
}

/**
 * Gets the key of an LDContext
 * For multi-kind contexts, returns the key of the first nested context
 */
export function getContextKey(context: LDContext | null | undefined): string {
  if (!context) return '';

  // Handle multi-kind context
  if ('kind' in context && context.kind === 'multi') {
    const multiContext = context as LDMultiKindContext;
    const kinds = Object.keys(multiContext).filter((k) => k !== 'kind');
    const firstKind = kinds[0];
    if (firstKind) {
      const nestedContext = multiContext[firstKind] as LDSingleKindContext | undefined;
      return nestedContext?.key || '';
    }
    return '';
  }

  // Handle single-kind context
  if ('key' in context) {
    return (context as LDSingleKindContext).key || '';
  }

  return '';
}

/**
 * Gets a display name for an LDContext
 * Uses name if available, otherwise falls back to key
 */
export function getContextDisplayName(context: LDContext | null | undefined): string {
  if (!context) return '';

  // Handle multi-kind context
  if ('kind' in context && context.kind === 'multi') {
    const multiContext = context as LDMultiKindContext;
    const kinds = Object.keys(multiContext).filter((k) => k !== 'kind');
    const firstKind = kinds[0];
    if (firstKind) {
      const nestedContext = multiContext[firstKind] as LDSingleKindContext | undefined;
      return nestedContext?.name || nestedContext?.key || '';
    }
    return 'multi-kind';
  }

  // Handle single-kind context
  const singleContext = context as LDSingleKindContext;
  return singleContext.name || singleContext.key || '';
}

/**
 * Check if a context is anonymous
 */
export function isContextAnonymous(context: LDContext | null | undefined): boolean {
  if (!context) return false;

  // Handle multi-kind context - check if any nested context is anonymous
  if ('kind' in context && context.kind === 'multi') {
    const multiContext = context as LDMultiKindContext;
    const kinds = Object.keys(multiContext).filter((k) => k !== 'kind');
    return kinds.some((kind) => {
      const nestedContext = multiContext[kind] as LDSingleKindContext | undefined;
      return nestedContext?.anonymous === true;
    });
  }

  // Handle single-kind context
  return (context as LDSingleKindContext).anonymous === true;
}

/**
 * Generates a stable identifier for a context based on kind+key.
 * This identifier remains the same even if other properties change,
 * allowing contexts to be updated rather than duplicated.
 *
 * For single-kind contexts: "kind:key"
 * For multi-kind contexts: "multi:kind1:key1:kind2:key2" (sorted by kind name)
 */
export function getStableContextId(context: LDContext | null | undefined): string {
  if (!context) return '';

  // Handle multi-kind context
  if ('kind' in context && context.kind === 'multi') {
    const multiContext = context as LDMultiKindContext;
    const kinds = Object.keys(multiContext)
      .filter((k) => k !== 'kind')
      .sort();
    const parts = ['multi'];
    for (const kind of kinds) {
      const nestedContext = multiContext[kind] as LDSingleKindContext | undefined;
      if (nestedContext?.key) {
        parts.push(kind, nestedContext.key);
      }
    }
    return parts.join(':');
  }

  // Handle single-kind context
  const kind = getContextKind(context);
  const key = getContextKey(context);
  return `${kind}:${key}`;
}
