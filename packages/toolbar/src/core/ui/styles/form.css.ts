import { style, StyleRule } from '@vanilla-extract/css';
import { flexColumn } from './mixins.css';

/**
 * Shared form field styles for inputs, labels, and form groups.
 */

// =============================================================================
// INPUT FIELD RULES
// =============================================================================

/**
 * Base input field styling - shared across text inputs, textareas, etc.
 */
export const inputBaseRules: StyleRule = {
  padding: '8px 12px',
  fontSize: '14px',
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-100)',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',

  ':focus': {
    borderColor: 'var(--lp-color-brand-cyan-base)',
    boxShadow: '0 0 0 3px rgba(from var(--lp-color-brand-cyan-base) r g b / 0.1)',
  },

  '::placeholder': {
    color: 'var(--lp-color-gray-500)',
  },

  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

/**
 * Monospace input field for code/keys.
 */
export const inputMonospaceRules: StyleRule = {
  ...inputBaseRules,
  fontSize: '13px',
  fontFamily: 'var(--lp-font-family-monospace)',
};

/**
 * Compact input field (smaller padding).
 */
export const inputCompactRules: StyleRule = {
  ...inputBaseRules,
  padding: '6px 10px',
  fontSize: '13px',
};

/**
 * Dark input variant (gray-800 background).
 */
export const inputDarkRules: StyleRule = {
  ...inputBaseRules,
  backgroundColor: 'var(--lp-color-gray-800)',
};

// =============================================================================
// LABEL RULES
// =============================================================================

/**
 * Standard form label.
 */
export const labelRules: StyleRule = {
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-400)',
};

/**
 * Large label for prominent fields.
 */
export const labelLargeRules: StyleRule = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-200)',
};

/**
 * Required field indicator (red asterisk).
 */
export const requiredIndicatorRules: StyleRule = {
  color: 'var(--lp-color-red-400)',
};

// =============================================================================
// FORM GROUP RULES
// =============================================================================

/**
 * Form field container with label and input.
 */
export const fieldGroupRules: StyleRule = {
  ...flexColumn,
  gap: '6px',
};

/**
 * Form field container with more spacing.
 */
export const fieldGroupSpacedRules: StyleRule = {
  ...flexColumn,
  gap: '8px',
};

// =============================================================================
// COMPOSED STYLES (ready-to-use)
// =============================================================================

export const inputBase = style(inputBaseRules);
export const inputMonospace = style(inputMonospaceRules);
export const inputCompact = style(inputCompactRules);
export const inputDark = style(inputDarkRules);
export const label = style(labelRules);
export const labelLarge = style(labelLargeRules);
export const requiredIndicator = style(requiredIndicatorRules);
export const fieldGroup = style(fieldGroupRules);
export const fieldGroupSpaced = style(fieldGroupSpacedRules);

// =============================================================================
// HELPER TEXT RULES
// =============================================================================

/**
 * Helper/hint text below inputs.
 */
export const helperTextRules: StyleRule = {
  fontSize: '12px',
  color: 'var(--lp-color-gray-500)',
  marginTop: '4px',
};

/**
 * Error text below inputs.
 */
export const errorTextRules: StyleRule = {
  fontSize: '12px',
  color: 'var(--lp-color-red-400)',
  marginTop: '4px',
};

export const helperText = style(helperTextRules);
export const errorText = style(errorTextRules);
