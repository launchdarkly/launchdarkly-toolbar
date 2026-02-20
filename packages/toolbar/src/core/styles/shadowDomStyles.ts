/**
 * Shadow DOM Style Injection Utilities
 *
 * This module provides utilities for injecting styles directly into Shadow DOM,
 * bypassing document.head entirely to prevent style conflicts with host applications.
 *
 * The approach uses:
 * 1. adoptedStyleSheets (modern browsers) - Styles never touch document.head
 * 2. Synchronous DOM interception (fallback) - Intercepts before styles are visible
 */

import { isToolbarStyleContent, TOOLBAR_STYLE_MARKER } from './constants';

/**
 * Injects CSS directly into a Shadow DOM root using the best available method.
 *
 * @param shadowRoot - The Shadow DOM root to inject styles into
 * @param cssText - The CSS content to inject
 * @returns A cleanup function to remove the styles
 */
export function injectStylesIntoShadowRoot(shadowRoot: ShadowRoot, cssText: string): () => void {
  // Mark the CSS with our identifier for any debugging needs
  const markedCss = `${TOOLBAR_STYLE_MARKER}\n${cssText}`;

  // Use adoptedStyleSheets if available (modern browsers, since 2023)
  if ('adoptedStyleSheets' in shadowRoot) {
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(markedCss);
      shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];

      return () => {
        shadowRoot.adoptedStyleSheets = shadowRoot.adoptedStyleSheets.filter((s) => s !== sheet);
      };
    } catch (error) {
      // Fall through to style element approach
      console.warn('[LaunchDarkly Toolbar] adoptedStyleSheets failed, falling back to style element:', error);
    }
  }

  // Fallback: Create a style element directly in Shadow DOM
  const style = document.createElement('style');
  style.textContent = markedCss;
  style.setAttribute('data-ld-toolbar', 'true');
  shadowRoot.prepend(style);

  return () => {
    style.remove();
  };
}

/**
 * Creates a synchronous interceptor for styles injected into document.head.
 * This prevents toolbar styles from ever being visible in the main document.
 *
 * IMPORTANT: This must be called BEFORE importing any toolbar components
 * to intercept their style injections.
 *
 * @param shadowRoot - The Shadow DOM root to redirect styles to
 * @returns A cleanup function to restore original DOM methods
 */
export function createStyleInterceptor(shadowRoot: ShadowRoot): () => void {
  // Handle case where document.head doesn't exist
  if (!document.head) {
    return () => {}; // No-op cleanup
  }

  // Snapshot existing styles before interception
  const existingStyleHashes = new Set(
    Array.from(document.head.querySelectorAll('style')).map((el) => hashString(el.textContent || '')),
  );

  // Store original methods
  const originalAppendChild = document.head.appendChild.bind(document.head);
  const originalInsertBefore = document.head.insertBefore.bind(document.head);

  // Create style container in shadow root
  const styleContainer = document.createElement('div');
  styleContainer.setAttribute('data-ld-toolbar-styles', 'true');
  shadowRoot.prepend(styleContainer);

  /**
   * Intercepts a node being added and redirects toolbar styles to Shadow DOM.
   * Returns true if the node was intercepted (and should not be added to head).
   */
  const interceptNode = (node: Node): boolean => {
    if (node.nodeType !== Node.ELEMENT_NODE || (node as Element).tagName !== 'STYLE') {
      return false;
    }

    const styleEl = node as HTMLStyleElement;
    const content = styleEl.textContent || '';
    const contentHash = hashString(content);

    // Skip styles we've already processed
    if (existingStyleHashes.has(contentHash)) {
      return false;
    }

    // Check if this is a toolbar style (should be MOVED to shadow DOM)
    if (isToolbarStyleContent(content)) {
      existingStyleHashes.add(contentHash);

      // Cache for HMR support
      cacheToolbarStyle(content);

      // Redirect to Shadow DOM
      if ('adoptedStyleSheets' in shadowRoot) {
        try {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(content);
          shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
          return true; // Don't add to document.head
        } catch {
          // Fall through to clone approach
        }
      }

      // Fallback: Clone to shadow root
      const clone = styleEl.cloneNode(true) as HTMLStyleElement;
      clone.setAttribute('data-ld-toolbar', 'true');
      styleContainer.appendChild(clone);
      return true; // Don't add to document.head
    }

    existingStyleHashes.add(contentHash);
    return false;
  };

  // Override appendChild
  document.head.appendChild = function <T extends Node>(node: T): T {
    if (interceptNode(node)) {
      return node; // Return node without adding to head
    }
    return originalAppendChild(node) as T;
  };

  // Override insertBefore
  document.head.insertBefore = function <T extends Node>(node: T, ref: Node | null): T {
    if (interceptNode(node)) {
      return node; // Return node without adding to head
    }
    return originalInsertBefore(node, ref) as T;
  };

  // Return cleanup function
  return () => {
    document.head.appendChild = originalAppendChild;
    document.head.insertBefore = originalInsertBefore;
  };
}

/**
 * Simple string hash function for deduplication.
 * Uses djb2 algorithm for fast, reasonably distributed hashes.
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return hash;
}

/**
 * Module-level cache for toolbar styles.
 * This persists across HMR cycles since it's outside the component lifecycle.
 * Used to restore styles when the toolbar remounts.
 */
const toolbarStyleCache = new Set<string>();

/**
 * Caches a style for HMR support.
 */
export function cacheToolbarStyle(content: string): void {
  toolbarStyleCache.add(content);
}

/**
 * Gets all cached toolbar styles.
 */
export function getCachedToolbarStyles(): string[] {
  return Array.from(toolbarStyleCache);
}

/**
 * Clears the style cache (useful for testing).
 */
export function clearToolbarStyleCache(): void {
  toolbarStyleCache.clear();
}
