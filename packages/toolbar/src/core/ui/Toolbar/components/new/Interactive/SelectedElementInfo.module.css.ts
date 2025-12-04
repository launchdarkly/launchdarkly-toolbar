import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '12px',
});

export const elementDetails = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--lp-color-gray-900)',
  borderRadius: '8px',
  overflow: 'hidden',
});

export const detailsHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 14px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--lp-color-gray-200)',
  transition: 'background-color 0.15s',

  selectors: {
    '&:hover': {
      backgroundColor: 'var(--lp-color-gray-800)',
    },
  },
});

export const primaryIdentifier = style({
  fontSize: '14px',
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-green-400)',
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const chevron = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--lp-color-gray-500)',
  transition: 'transform 0.2s',
});

export const chevronExpanded = style({
  transform: 'rotate(180deg)',
});

export const detailsContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  padding: '0 14px 14px',
});

export const detailRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const label = style({
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-500)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const value = style({
  fontSize: '12px',
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-gray-300)',
  wordBreak: 'break-all',
  lineHeight: 1.4,
});

export const classesList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '4px',
});

export const classTag = style({
  padding: '2px 6px',
  backgroundColor: 'var(--lp-color-gray-800)',
  borderRadius: '4px',
  fontSize: '11px',
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-gray-300)',
});

export const attributesList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const attributeRow = style({
  display: 'flex',
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
  fontSize: '11px',
  fontFamily: 'var(--lp-font-family-monospace)',
  color: 'var(--lp-color-gray-300)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
  display: 'flex',
  alignItems: 'center',
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
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
});

export const title = style({
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--lp-color-gray-500)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  margin: 0,
});