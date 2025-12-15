import type { LDContext } from 'launchdarkly-js-client-sdk';
import { Context } from '../types/ldApi';

/**
 * Generates a unique ID for a context
 */
export function generateContextId(): string {
  return `ctx_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Extracts normalized context info from an LDContext
 * Handles both single-kind and multi-kind contexts
 */
export function extractContextInfo(ldContext: LDContext | undefined): Context | null {
  if (!ldContext) return null;

  // Handle multi-kind context
  if ('kind' in ldContext && ldContext.kind === 'multi') {
    // For multi-kind, we'll return the first context (usually user)
    // In the future, we could return an array of all contexts
    const multiContext = ldContext as Record<string, any>;
    const kinds = Object.keys(multiContext).filter((k) => k !== 'kind');

    const firstKind = kinds[0];
    if (firstKind) {
      const contextData = multiContext[firstKind];
      if (contextData) {
        return {
          id: generateContextId(),
          kind: firstKind,
          key: contextData.key || '',
          name: contextData.name,
          anonymous: contextData.anonymous,
        };
      }
    }
    return null;
  }

  // Handle single-kind context
  if ('kind' in ldContext && typeof ldContext.kind === 'string') {
    return {
      id: generateContextId(),
      kind: ldContext.kind,
      key: (ldContext as any).key || '',
      name: (ldContext as any).name,
      anonymous: (ldContext as any).anonymous,
    };
  }

  // Handle legacy user context (no kind specified means "user")
  if ('key' in ldContext) {
    return {
      id: generateContextId(),
      kind: 'user',
      key: (ldContext as any).key || '',
      name: (ldContext as any).name,
      anonymous: (ldContext as any).anonymous,
    };
  }

  return null;
}

/**
 * Helper function to check if a given context matches the current SDK context
 */
export function isCurrentContext(currentContext: Context | null, contextKind: string, contextKey: string): boolean {
  if (!currentContext) return false;
  return currentContext.kind === contextKind && currentContext.key === contextKey;
}
