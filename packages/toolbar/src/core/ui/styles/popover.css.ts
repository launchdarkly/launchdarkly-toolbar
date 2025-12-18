import { style, StyleRule } from '@vanilla-extract/css';
import { Z_INDEX } from '../constants/zIndex';
import { transitionFast, flexBetween, buttonReset } from './mixins.css';

/**
 * Shared popover/dropdown styles for consistent styling across components.
 */

// =============================================================================
// POPOVER CONTAINER RULES
// =============================================================================

/**
 * Base popover container rules - position relative for absolute positioning of content.
 */
export const popoverContainerRules: StyleRule = {
  position: 'relative',
  display: 'inline-block',
};

/**
 * Popover content panel rules - the floating panel that appears.
 */
export const popoverPanelRules: StyleRule = {
  position: 'absolute',
  backgroundColor: 'var(--lp-color-gray-900)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '8px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  zIndex: Z_INDEX.POPOVER,
  overflow: 'hidden',
};

/**
 * Backdrop for modal-style popovers.
 */
export const popoverBackdropRules: StyleRule = {
  position: 'fixed',
  inset: 0,
  zIndex: Z_INDEX.POPOVER - 1,
};

// =============================================================================
// POPOVER MENU ITEM RULES
// =============================================================================

/**
 * Base menu item rules for dropdown items.
 */
export const popoverMenuItemRules: StyleRule = {
  ...buttonReset,
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  color: 'var(--lp-color-gray-300)',
  fontSize: '14px',
  fontWeight: 400,
  textAlign: 'left',
  ...transitionFast,

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-750)',
    color: 'var(--lp-color-gray-100)',
  },

  ':focus': {
    outline: 'none',
    backgroundColor: 'var(--lp-color-gray-750)',
  },

  ':active': {
    backgroundColor: 'var(--lp-color-gray-700)',
  },
};

/**
 * Active/selected menu item rules.
 */
export const popoverMenuItemActiveRules: StyleRule = {
  backgroundColor: 'var(--lp-color-gray-750)',
  color: 'var(--lp-color-gray-100)',
  fontWeight: 500,
};

// =============================================================================
// POPOVER HEADER RULES
// =============================================================================

/**
 * Popover header rules - title and actions row.
 */
export const popoverHeaderRules: StyleRule = {
  ...flexBetween,
  padding: '12px 16px',
  borderBottom: '1px solid var(--lp-color-gray-700)',
};

/**
 * Popover title rules.
 */
export const popoverTitleRules: StyleRule = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-200)',
  margin: 0,
};

// =============================================================================
// TRIGGER BUTTON RULES
// =============================================================================

/**
 * Popover trigger button rules (dropdown button style).
 */
export const popoverTriggerRules: StyleRule = {
  ...buttonReset,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: 'var(--lp-color-gray-950)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-200)',
  fontSize: '14px',
  fontWeight: 500,
  padding: '8px 12px',
  ...transitionFast,

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-600)',
  },

  ':focus': {
    outline: 'none',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-shadow-interactive-focus)',
    outlineOffset: '2px',
  },
};

/**
 * Open state for trigger button.
 */
export const popoverTriggerOpenRules: StyleRule = {
  backgroundColor: 'var(--lp-color-gray-800)',
  borderColor: 'var(--lp-color-gray-600)',
};

// =============================================================================
// COMPOSED STYLES (ready-to-use)
// =============================================================================

export const popoverContainer = style(popoverContainerRules);
export const popoverPanel = style(popoverPanelRules);
export const popoverBackdrop = style(popoverBackdropRules);
export const popoverMenuItem = style(popoverMenuItemRules);
export const popoverMenuItemActive = style(popoverMenuItemActiveRules);
export const popoverHeader = style(popoverHeaderRules);
export const popoverTitle = style(popoverTitleRules);
export const popoverTrigger = style(popoverTriggerRules);
export const popoverTriggerOpen = style(popoverTriggerOpenRules);

// =============================================================================
// POSITION HELPERS
// =============================================================================

/**
 * Position below trigger, aligned to start.
 */
export const positionBottomStart = style({
  top: 'calc(100% + 4px)',
  left: 0,
});

/**
 * Position below trigger, aligned to end.
 */
export const positionBottomEnd = style({
  top: 'calc(100% + 4px)',
  right: 0,
});

/**
 * Position below trigger, centered.
 */
export const positionBottomCenter = style({
  top: 'calc(100% + 4px)',
  left: '50%',
  transform: 'translateX(-50%)',
});

