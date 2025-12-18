import { style } from '@vanilla-extract/css';
import { flexColumn, flexRow, flexCenter, textEllipsis, buttonReset } from '../../../../styles/mixins.css';
import { codeRules, codeEllipsisRules } from '../../../../styles/typography.css';
import { fieldGroupRules, labelRules } from '../../../../styles/form.css';
import { badgeRules } from '../../../../styles/card.css';

export const container = style({
  ...flexColumn,
  gap: '20px',
  padding: '12px',
});

export const elementDetails = style({
  ...flexColumn,
  backgroundColor: 'var(--lp-color-gray-900)',
  borderRadius: '8px',
  overflow: 'hidden',
});

export const detailsHeader = style({
  ...buttonReset,
  ...flexRow,
  justifyContent: 'space-between',
  padding: '12px 14px',
  color: 'var(--lp-color-gray-200)',
  transition: 'background-color 0.15s',

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-800)',
    },
  },
});

export const primaryIdentifier = style({
  ...textEllipsis,
  fontSize: '14px',
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-green-400)',
  fontWeight: 500,
});

export const chevron = style({
  ...flexCenter,
  color: 'var(--lp-color-gray-500)',
  transition: 'transform 0.2s',
});

export const chevronExpanded = style({
  transform: 'rotate(180deg)',
});

export const detailsContent = style({
  ...flexColumn,
  gap: '12px',
  padding: '0 14px 14px',
});

export const detailRow = style({
  ...fieldGroupRules,
});

export const label = style({
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-500)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const value = style({
  ...codeRules,
  wordBreak: 'break-all',
  lineHeight: 1.4,
});

export const classesList = style({
  ...flexRow,
  flexWrap: 'wrap',
  gap: '4px',
});

export const classTag = style({
  ...badgeRules,
  fontSize: '11px',
  fontFamily: 'var(--lp-font-family-monospace)',
  backgroundColor: 'var(--lp-color-gray-800)',
  color: 'var(--lp-color-gray-300)',
});

export const attributesList = style({
  ...flexColumn,
  gap: '4px',
});

export const attributeRow = style({
  ...flexRow,
  alignItems: 'baseline',
  gap: '8px',
});

export const attributeName = style({
  fontSize: '11px',
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-blue-400)',
  fontWeight: 500,
  flexShrink: 0,
});

export const attributeValue = style({
  ...codeEllipsisRules,
  fontSize: '11px',
});

export const textPreview = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-300)',
  lineHeight: 1.4,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

export const dimensionsRow = style({
  ...flexRow,
  gap: '8px',
  fontSize: '11px',
  color: 'var(--lp-color-gray-500)',
});

export const dimValue = style({
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-gray-400)',
});

// Workflows container
export const workflowsContainer = style({
  ...flexColumn,
  gap: '20px',
});

export const title = style({
  ...labelRules,
  fontSize: '11px',
  color: 'var(--lp-color-gray-500)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: 0,
});
