/**
 * Style isolation constants for Shadow DOM.
 *
 * This module provides unique identifiers and detection patterns for toolbar styles,
 * enabling reliable isolation from host application stylesheets.
 */

/**
 * Unique prefix for all toolbar vanilla-extract class names.
 * This is configured in rslib.config.ts and rslib.config.cdn.ts
 */
export const TOOLBAR_CLASS_PREFIX = 'ldtb_';

/**
 * CSS comment marker injected into toolbar stylesheets.
 * Used to identify toolbar styles during runtime interception.
 */
export const TOOLBAR_STYLE_MARKER = '/* LD_TOOLBAR_STYLES */';

/**
 * CSS variable prefixes used by LaunchDarkly design systems.
 * NOTE: This is used only for copying tokens INTO the Shadow DOM (not for interception).
 * We intentionally do NOT intercept styles just because they contain --lp- tokens,
 * as host applications may also use LaunchPad and their styles must not be affected.
 */
export const LAUNCHPAD_TOKEN_PREFIXES = [
  '--lp-', // LaunchPad design system tokens
] as const;

/**
 * Checks if CSS content belongs to the toolbar based on known markers.
 * This is used for reliable style interception without false positives.
 *
 * IMPORTANT: This function intentionally does NOT check for --lp- tokens.
 * Host applications that also use LaunchPad would have their styles incorrectly
 * intercepted if we matched on --lp- prefix, breaking components like react-select.
 *
 * @param content - CSS content to check
 * @returns true if the content is toolbar CSS that should be MOVED to Shadow DOM
 */
export function isToolbarStyleContent(content: string): boolean {
  // Check for explicit marker (most reliable)
  if (content.includes(TOOLBAR_STYLE_MARKER)) {
    return true;
  }

  // Check for toolbar class prefix (vanilla-extract generated)
  // All toolbar component styles have class names prefixed with 'ldtb_'
  if (content.includes(TOOLBAR_CLASS_PREFIX)) {
    return true;
  }

  // NOTE: We do NOT check for --lp- tokens here. While the toolbar uses LaunchPad
  // design tokens, so might the host application. Intercepting based on --lp-
  // would incorrectly capture host app styles and break their components.
  // LaunchPad token styles are handled via shouldCopyToShadowDom() instead.

  return false;
}

/**
 * Checks if CSS content contains LaunchPad design tokens that the toolbar needs.
 * These styles should be COPIED to Shadow DOM but NOT removed from document.head,
 * because host applications may also use these tokens.
 *
 * @param content - CSS content to check
 * @returns true if the content should be copied (but not moved) to Shadow DOM
 */
export function shouldCopyToShadowDom(content: string): boolean {
  // Don't copy if it's already a toolbar style (will be moved, not copied)
  if (isToolbarStyleContent(content)) {
    return false;
  }

  // Copy styles that contain LaunchPad tokens
  return LAUNCHPAD_TOKEN_PREFIXES.some((prefix) => content.includes(prefix));
}
