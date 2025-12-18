import type { LDContext, LDMultiKindContext, LDSingleKindContext } from 'launchdarkly-js-client-sdk';

/**
 * Simple hash function (djb2 algorithm) for generating deterministic IDs
 */
function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Convert to unsigned 32-bit integer and then to base36 for shorter string
  return (hash >>> 0).toString(36);
}

/**
 * Recursively sorts object keys at all levels for deterministic serialization.
 * Also sorts arrays of primitives to ensure consistent ordering.
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    // First, recursively process each element
    const processedArray = obj.map(sortObjectKeys);

    // Sort arrays of primitives (strings, numbers, booleans) for consistent ordering
    // Don't sort arrays of objects as their order may be semantically meaningful
    if (processedArray.length > 0 && processedArray.every((item) => typeof item !== 'object' || item === null)) {
      return [...processedArray].sort((a, b) => {
        // Handle different types - convert to string for comparison
        const aStr = String(a);
        const bStr = String(b);
        return aStr.localeCompare(bStr);
      });
    }

    return processedArray;
  }

  const sortedObj: Record<string, unknown> = {};
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  for (const key of keys) {
    sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
  }
  return sortedObj;
}

// Cache for context ID lookups - uses WeakMap for object references
// and a separate Map for string-based lookups (for contexts that are recreated)
const contextIdCache = new WeakMap<object, string>();
const contextStringCache = new Map<string, string>();
const MAX_STRING_CACHE_SIZE = 100;

/**
 * Deprecated context kinds that should be excluded from hash generation
 * for multi-kind contexts. The 'user' kind is often a legacy duplicate
 * that causes false negative comparisons.
 */
const DEPRECATED_MULTI_CONTEXT_KINDS = ['user'];

/**
 * Prepares a context for hash generation by removing deprecated kinds
 * from multi-kind contexts. This prevents duplicate detection issues
 * caused by the legacy 'user' kind which often duplicates other context data.
 */
function prepareContextForHashing(context: LDContext): LDContext {
  // Only filter for multi-kind contexts
  if (!('kind' in context) || context.kind !== 'multi') {
    return context;
  }

  // Create a filtered copy excluding deprecated kinds
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(context)) {
    if (!DEPRECATED_MULTI_CONTEXT_KINDS.includes(key)) {
      filtered[key] = value;
    }
  }

  return filtered as LDContext;
}

/**
 * Generates a deterministic ID for a context based on its properties.
 * The same context object will always produce the same ID.
 * This is used to compare contexts for equality.
 *
 * For multi-kind contexts, the deprecated 'user' kind is excluded from
 * hash generation to prevent false duplicate detection.
 *
 * Results are cached to minimize computation during React renders.
 */
export function generateContextId(context?: LDContext | null): string {
  if (!context) {
    // Fallback for cases where no context is provided
    return `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // Check WeakMap cache first (fast path for same object reference)
  const cachedById = contextIdCache.get(context);
  if (cachedById) {
    return cachedById;
  }

  // Prepare context for hashing (removes deprecated kinds from multi-context)
  const contextForHashing = prepareContextForHashing(context);

  // Create a stable string representation of the context
  // Recursively sort keys at all levels for consistent ordering
  const sortedContext = sortObjectKeys(contextForHashing);
  const contextString = JSON.stringify(sortedContext);

  // Check string-based cache (for contexts that are recreated but have same content)
  const cachedByString = contextStringCache.get(contextString);
  if (cachedByString) {
    // Also store in WeakMap for faster future lookups with this object
    contextIdCache.set(context, cachedByString);
    return cachedByString;
  }

  // Compute hash and cache it
  const hash = hashString(contextString);
  const contextId = `ctx_${hash}`;

  // Store in both caches
  contextIdCache.set(context, contextId);

  // Limit string cache size to prevent memory leaks
  if (contextStringCache.size >= MAX_STRING_CACHE_SIZE) {
    // Remove oldest entry (first key)
    const firstKey = contextStringCache.keys().next().value;
    if (firstKey) {
      contextStringCache.delete(firstKey);
    }
  }
  contextStringCache.set(contextString, contextId);

  return contextId;
}

/**
 * Check if two contexts are the same using their generated IDs
 */
export function areContextsEqual(a: LDContext | null | undefined, b: LDContext | null | undefined): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return generateContextId(a) === generateContextId(b);
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
