import { style, StyleRule } from '@vanilla-extract/css';
import { textEllipsis } from './mixins.css';

/**
 * Shared typography styles for consistent text styling across the toolbar.
 */

// =============================================================================
// HEADING RULES
// =============================================================================

/**
 * Large title (16px, bold).
 */
export const titleLargeRules: StyleRule = {
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-200)',
  margin: 0,
};

/**
 * Standard title (14px, semi-bold).
 */
export const titleRules: StyleRule = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-100)',
  margin: 0,
};

/**
 * Small title (13px, semi-bold).
 */
export const titleSmallRules: StyleRule = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-100)',
  margin: 0,
};

// =============================================================================
// BODY TEXT RULES
// =============================================================================

/**
 * Standard body text (14px).
 */
export const bodyRules: StyleRule = {
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--lp-color-gray-200)',
  lineHeight: 1.5,
};

/**
 * Small body text (13px).
 */
export const bodySmallRules: StyleRule = {
  fontSize: '13px',
  fontWeight: 400,
  color: 'var(--lp-color-gray-300)',
  lineHeight: 1.4,
};

/**
 * Description/subtitle text (muted).
 */
export const descriptionRules: StyleRule = {
  fontSize: '13px',
  color: 'var(--lp-color-gray-400)',
  margin: 0,
  lineHeight: 1.4,
};

/**
 * Smaller description text.
 */
export const descriptionSmallRules: StyleRule = {
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  margin: 0,
};

// =============================================================================
// METADATA TEXT RULES
// =============================================================================

/**
 * Meta text (timestamps, counts, etc.).
 */
export const metaRules: StyleRule = {
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
};

/**
 * Muted meta text.
 */
export const metaMutedRules: StyleRule = {
  fontSize: '12px',
  color: 'var(--lp-color-gray-500)',
};

// =============================================================================
// CODE/MONOSPACE RULES
// =============================================================================

/**
 * Code/key text (monospace).
 */
export const codeRules: StyleRule = {
  fontSize: '12px',
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-gray-400)',
};

/**
 * Code with ellipsis for long strings.
 */
export const codeEllipsisRules: StyleRule = {
  ...codeRules,
  ...textEllipsis,
};

// =============================================================================
// LINK RULES
// =============================================================================

/**
 * Text link styling.
 */
export const linkRules: StyleRule = {
  color: 'var(--lp-color-brand-cyan-base)',
  textDecoration: 'none',
  transition: 'color 0.15s',

  ':hover': {
    color: 'var(--lp-color-brand-cyan-light)',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
    borderRadius: '2px',
  },
};

/**
 * Muted link (gray, turns primary on hover).
 */
export const linkMutedRules: StyleRule = {
  color: 'var(--lp-color-gray-400)',
  textDecoration: 'none',
  transition: 'color 0.15s',

  ':hover': {
    color: 'var(--lp-color-brand-cyan-base)',
  },
};

// =============================================================================
// COMPOSED STYLES (ready-to-use)
// =============================================================================

export const titleLarge = style(titleLargeRules);
export const title = style(titleRules);
export const titleSmall = style(titleSmallRules);
export const body = style(bodyRules);
export const bodySmall = style(bodySmallRules);
export const description = style(descriptionRules);
export const descriptionSmall = style(descriptionSmallRules);
export const meta = style(metaRules);
export const metaMuted = style(metaMutedRules);
export const code = style(codeRules);
export const codeEllipsis = style(codeEllipsisRules);
export const link = style(linkRules);
export const linkMuted = style(linkMutedRules);
