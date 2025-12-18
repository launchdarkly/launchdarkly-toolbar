import { style, StyleRule } from '@vanilla-extract/css';
import { transitionDefault, flexBetween, flexColumn } from './mixins.css';

/**
 * Shared card styles for list items and content containers.
 * These provide consistent styling for cards throughout the toolbar.
 */

// =============================================================================
// BASE CARD STYLE RULES (for spreading into other styles)
// =============================================================================

/**
 * Base card styling rules - spread into custom styles when needed.
 */
export const cardBaseRules: StyleRule = {
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-700)',
  borderRadius: '8px',
  padding: '16px',
  ...transitionDefault,
  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-600)',
  },
};

/**
 * Card styling rules with standard margin for list layouts.
 */
export const cardBaseWithMarginRules: StyleRule = {
  ...cardBaseRules,
  margin: '12px',
};

/**
 * Active/selected state rules for cards (cyan highlight).
 */
export const cardActiveRules: StyleRule = {
  backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.08)',
  border: '1px solid rgba(from var(--lp-color-brand-cyan-base) r g b / 0.2)',
  ':hover': {
    backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.12)',
    borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.3)',
  },
};

/**
 * Clickable card state rules (adds lift effect on hover).
 */
export const cardClickableRules: StyleRule = {
  cursor: 'pointer',
  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-600)',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  ':active': {
    transform: 'translateY(0)',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
};

// =============================================================================
// COMPOSED CARD STYLES (ready-to-use vanilla-extract styles)
// =============================================================================

/**
 * Base card container - standard card with hover effect.
 */
export const cardBase = style(cardBaseRules);

/**
 * Card with standard margin for list layouts.
 */
export const cardWithMargin = style(cardBaseWithMarginRules);

/**
 * Active/selected card state (cyan highlight) - apply as additional class.
 */
export const cardActive = style(cardActiveRules);

/**
 * Clickable card modifier - apply as additional class for interactive cards.
 */
export const cardClickable = style(cardClickableRules);

/**
 * Horizontal card layout (flex row with items centered between).
 */
export const cardRow = style({
  ...cardBaseWithMarginRules,
  ...flexBetween,
  gap: '16px',
});

/**
 * Vertical card layout (flex column).
 */
export const cardColumn = style({
  ...cardBaseWithMarginRules,
  ...flexColumn,
  gap: '16px',
});

/**
 * Compact horizontal card (less padding on left).
 */
export const cardRowCompact = style({
  ...cardBaseWithMarginRules,
  ...flexBetween,
  paddingLeft: '8px',
  gap: '4px',
});

// =============================================================================
// CARD CONTENT STYLE RULES (for spreading into other styles)
// =============================================================================

/**
 * Card header row rules.
 */
export const cardHeaderRules: StyleRule = {
  ...flexBetween,
  gap: '12px',
};

/**
 * Card info section rules.
 */
export const cardInfoRules: StyleRule = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0, // Allow flex item to shrink for text ellipsis
};

/**
 * Card name/title row rules.
 */
export const cardNameRowRules: StyleRule = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0,
};

/**
 * Card actions container rules.
 */
export const cardActionsRules: StyleRule = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
};

// =============================================================================
// CARD CONTENT STYLES (ready-to-use)
// =============================================================================

/**
 * Card header row - typically contains icon, title, and actions.
 */
export const cardHeader = style(cardHeaderRules);

/**
 * Card info section - typically contains name and subtitle.
 */
export const cardInfo = style(cardInfoRules);

/**
 * Card name/title row.
 */
export const cardNameRow = style(cardNameRowRules);

/**
 * Card actions container.
 */
export const cardActions = style(cardActionsRules);

// =============================================================================
// STATUS DOT STYLE RULES
// =============================================================================

/**
 * Base status dot rules (8px circle).
 */
export const statusDotRules: StyleRule = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  flexShrink: 0,
};

/**
 * Active status dot rules (cyan color).
 */
export const statusDotActiveRules: StyleRule = {
  backgroundColor: 'var(--lp-color-brand-cyan-base)',
};

/**
 * Override status dot rules (cyan, often animated).
 */
export const statusDotOverrideRules: StyleRule = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'var(--lp-color-brand-cyan-base)',
  transition: 'background-color 0.2s ease',
};

// =============================================================================
// STATUS DOT STYLES (ready-to-use)
// =============================================================================

/**
 * Base status dot (8px circle).
 */
export const statusDot = style(statusDotRules);

/**
 * Active status dot (cyan color).
 */
export const statusDotActive = style(statusDotActiveRules);

/**
 * Override status dot (cyan, often animated).
 */
export const statusDotOverride = style(statusDotOverrideRules);

// =============================================================================
// BADGE STYLE RULES
// =============================================================================

/**
 * Base badge styling rules.
 */
export const badgeRules: StyleRule = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderRadius: '4px',
  backgroundColor: 'var(--lp-color-gray-800)',
  color: 'var(--lp-color-gray-300)',
  flexShrink: 0,
};

/**
 * Warning badge rules (yellow).
 */
export const badgeWarningRules: StyleRule = {
  backgroundColor: 'rgba(from var(--lp-color-yellow-500) r g b / 0.15)',
  color: 'var(--lp-color-yellow-400)',
};

/**
 * Muted badge rules for secondary information.
 */
export const badgeMutedRules: StyleRule = {
  fontWeight: 500,
  color: 'var(--lp-color-gray-500)',
};

// =============================================================================
// BADGE STYLES (ready-to-use)
// =============================================================================

export const badge = style(badgeRules);
export const badgeWarning = style(badgeWarningRules);
export const badgeMuted = style(badgeMutedRules);
