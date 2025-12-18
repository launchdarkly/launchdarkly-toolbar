import { StyleRule } from '@vanilla-extract/css';

/**
 * Shared style mixins for consistent styling across components.
 * These are raw style objects that can be spread into vanilla-extract style() calls.
 *
 * Usage:
 * ```ts
 * import { textEllipsis, flexCenter } from '../../styles/mixins.css';
 *
 * export const myStyle = style({
 *   ...textEllipsis,
 *   ...flexCenter,
 *   // additional styles
 * });
 * ```
 */

// =============================================================================
// TEXT UTILITIES
// =============================================================================

/**
 * Truncate text with ellipsis when it overflows.
 * Common pattern used for names, keys, and labels that may be too long.
 */
export const textEllipsis: StyleRule = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

/**
 * Allow flex item to shrink properly (required for text ellipsis in flex containers)
 */
export const flexShrinkable: StyleRule = {
  minWidth: 0,
  flex: 1,
};

/**
 * Combine ellipsis with flex shrinkability - common pattern for text in flex layouts
 */
export const textEllipsisInFlex: StyleRule = {
  ...textEllipsis,
  ...flexShrinkable,
};

// =============================================================================
// FLEX UTILITIES
// =============================================================================

/**
 * Center content both horizontally and vertically using flexbox.
 */
export const flexCenter: StyleRule = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * Horizontal flex layout with centered vertical alignment.
 */
export const flexRow: StyleRule = {
  display: 'flex',
  alignItems: 'center',
};

/**
 * Vertical flex layout.
 */
export const flexColumn: StyleRule = {
  display: 'flex',
  flexDirection: 'column',
};

/**
 * Space items between with centered vertical alignment.
 */
export const flexBetween: StyleRule = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

// =============================================================================
// TRANSITION UTILITIES
// =============================================================================

/**
 * Standard transition for interactive elements (0.2s).
 */
export const transitionDefault: StyleRule = {
  transition: 'all 0.2s ease',
};

/**
 * Fast transition for micro-interactions (0.15s).
 */
export const transitionFast: StyleRule = {
  transition: 'all 0.15s ease',
};

/**
 * Slow transition for larger state changes (0.3s).
 */
export const transitionSlow: StyleRule = {
  transition: 'all 0.3s ease',
};

// =============================================================================
// FOCUS UTILITIES
// =============================================================================

/**
 * Standard focus-visible outline with offset outside the element.
 * Use for buttons, links, and interactive elements.
 */
export const focusVisible: StyleRule = {
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
  },
};

/**
 * Focus-visible outline with inset (offset inside the element).
 * Use for elements where external outline would be clipped or look odd.
 */
export const focusVisibleInset: StyleRule = {
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '-2px',
  },
};

// =============================================================================
// SCROLLBAR UTILITIES
// =============================================================================

/**
 * Custom thin scrollbar styling for scrollable containers.
 * Uses CSS variables for consistent theming.
 */
export const customScrollbar: StyleRule = {
  scrollbarColor: 'var(--lp-color-gray-700) transparent',
  scrollbarWidth: 'thin',
  selectors: {
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-700)',
      borderRadius: '3px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
};

/**
 * Wider scrollbar variant (8px) for larger containers.
 */
export const customScrollbarWide: StyleRule = {
  scrollbarColor: 'var(--lp-color-gray-800) transparent',
  scrollbarWidth: 'thin',
  ':hover': {
    scrollbarColor: 'var(--lp-color-gray-700) transparent',
  },
  selectors: {
    '&::-webkit-scrollbar': {
      width: '8px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-800)',
      borderRadius: '4px',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-700)',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
};

/**
 * Horizontal scrollbar for containers with horizontal overflow.
 */
export const customScrollbarHorizontal: StyleRule = {
  scrollbarColor: 'var(--lp-color-gray-700) transparent',
  scrollbarWidth: 'thin',
  selectors: {
    '&::-webkit-scrollbar': {
      height: '4px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-700)',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
};

// =============================================================================
// BUTTON RESET
// =============================================================================

/**
 * Reset default button styles for custom button implementations.
 */
export const buttonReset: StyleRule = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
};

/**
 * Base styles for icon buttons (combines reset with common patterns).
 */
export const iconButtonBase: StyleRule = {
  ...buttonReset,
  ...flexCenter,
  borderRadius: '4px',
  color: 'var(--lp-color-gray-400)',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    color: 'var(--lp-color-gray-200)',
  },
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  selectors: {
    '&:hover:disabled': {
      backgroundColor: 'transparent',
      color: 'var(--lp-color-gray-400)',
    },
  },
};

// =============================================================================
// ICON UTILITIES
// =============================================================================

/**
 * Standard icon size (24px).
 */
export const iconDefault: StyleRule = {
  width: '24px',
  height: '24px',
  fill: 'currentColor',
};

/**
 * Small icon size (16px).
 */
export const iconSmall: StyleRule = {
  width: '16px',
  height: '16px',
  fill: 'currentColor',
};

/**
 * Extra small icon size (14px).
 */
export const iconXSmall: StyleRule = {
  width: '14px',
  height: '14px',
  fill: 'currentColor',
};

/**
 * Prevent icon from shrinking in flex containers.
 */
export const iconNoShrink: StyleRule = {
  flexShrink: 0,
};
