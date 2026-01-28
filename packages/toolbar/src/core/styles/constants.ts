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
 * LaunchPad token prefixes that indicate LaunchDarkly design system styles.
 * These CSS custom properties should only exist within the toolbar's Shadow DOM.
 */
export const LAUNCHPAD_TOKEN_PREFIXES = ['--lp-color-', '--lp-font-', '--lp-spacing-', '--lp-size-'] as const;

/**
 * Checks if CSS content belongs to the toolbar based on known markers.
 * This is used for reliable style interception without false positives.
 *
 * @param content - CSS content to check
 * @returns true if the content is toolbar CSS
 */
export function isToolbarStyleContent(content: string): boolean {
  // Check for explicit marker (most reliable)
  if (content.includes(TOOLBAR_STYLE_MARKER)) {
    return true;
  }

  // Check for toolbar class prefix (vanilla-extract generated)
  if (content.includes(TOOLBAR_CLASS_PREFIX)) {
    return true;
  }

  // Check for LaunchPad tokens (design system variables)
  return LAUNCHPAD_TOKEN_PREFIXES.some((prefix) => content.includes(prefix));
}
