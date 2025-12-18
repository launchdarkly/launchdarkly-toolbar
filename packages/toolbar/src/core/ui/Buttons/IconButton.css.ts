import { style, styleVariants, StyleRule } from '@vanilla-extract/css';
import { flexCenter, buttonReset, transitionDefault } from '../styles/mixins.css';

// =============================================================================
// BASE ICON BUTTON STYLE
// =============================================================================

const baseIconButton: StyleRule = {
  ...buttonReset,
  ...flexCenter,
  ...transitionDefault,
  borderRadius: '4px',
  color: 'var(--lp-color-gray-400)',

  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  selectors: {
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: '2px solid var(--lp-color-shadow-interactive-focus)',
      outlineOffset: '-2px',
    },
    '&:hover:disabled': {
      backgroundColor: 'transparent',
      color: 'var(--lp-color-gray-400)',
    },
  },
};

export const iconButton = style(baseIconButton);

// =============================================================================
// SIZE VARIANTS
// =============================================================================

export const sizes = styleVariants({
  xs: {
    width: '24px',
    height: '24px',
    padding: '4px',
  },
  small: {
    width: '30px',
    height: '30px',
    padding: '6px',
  },
  medium: {
    width: '36px',
    height: '36px',
    padding: '8px',
  },
  large: {
    width: '40px',
    height: '40px',
    padding: '8px',
  },
  xl: {
    width: '44px',
    height: '44px',
    padding: '8px',
  },
});

// =============================================================================
// COLOR VARIANTS (hover behavior)
// =============================================================================

export const variants = styleVariants({
  // Default: gray background on hover (most common)
  default: {
    selectors: {
      '&:hover:not(:disabled)': {
        color: 'var(--lp-color-gray-200)',
        backgroundColor: 'var(--lp-color-gray-800)',
      },
      '&:active:not(:disabled)': {
        backgroundColor: 'var(--lp-color-gray-700)',
      },
    },
  },

  // Ghost: no background, only color change on hover
  ghost: {
    selectors: {
      '&:hover:not(:disabled)': {
        color: 'var(--lp-color-gray-200)',
      },
    },
  },

  // Subtle: lighter hover background (gray-700)
  subtle: {
    selectors: {
      '&:hover:not(:disabled)': {
        color: 'var(--lp-color-gray-200)',
        backgroundColor: 'var(--lp-color-gray-700)',
      },
      '&:active:not(:disabled)': {
        backgroundColor: 'var(--lp-color-gray-600)',
      },
    },
  },

  // Danger: red color on hover (for delete/clear actions)
  danger: {
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: 'rgba(from var(--lp-color-red-500) r g b / 0.15)',
        color: 'var(--lp-color-red-400)',
      },
    },
    ':focus-visible': {
      outline: '2px solid var(--lp-color-red-500)',
      outlineOffset: '2px',
    },
  },

  // Primary: cyan color on hover
  primary: {
    selectors: {
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--lp-color-gray-800)',
        color: 'var(--lp-color-brand-cyan-base)',
      },
    },
    ':focus-visible': {
      outline: '2px solid var(--lp-color-brand-cyan-base)',
      outlineOffset: '2px',
    },
  },
});

// =============================================================================
// STATE MODIFIERS (can be combined with variants)
// =============================================================================

// Active/selected state - darker background
export const active = style({
  backgroundColor: 'var(--lp-color-gray-900)',
  color: 'var(--lp-color-gray-200)',
});

// Selected mode (blue) - used for IconBar select mode
export const selected = style({
  backgroundColor: 'var(--lp-color-blue-900)',
  color: 'var(--lp-color-blue-400)',

  ':hover': {
    backgroundColor: 'var(--lp-color-blue-800)',
    color: 'var(--lp-color-blue-300)',
  },
});

// =============================================================================
// BORDER RADIUS VARIANTS
// =============================================================================

export const radii = styleVariants({
  sm: { borderRadius: '4px' },
  md: { borderRadius: '6px' },
  lg: { borderRadius: '8px' },
});

// =============================================================================
// LEGACY EXPORTS (for backwards compatibility)
// =============================================================================

export const small = style([iconButton, sizes.small, variants.default]);
export const medium = style([iconButton, sizes.medium, variants.default]);
export const large = style([iconButton, sizes.large, variants.default]);
