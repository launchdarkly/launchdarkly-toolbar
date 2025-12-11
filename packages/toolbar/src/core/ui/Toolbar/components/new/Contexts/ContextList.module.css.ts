import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
});

export const statsHeader = style({
  padding: '8px 20px',
  borderBottom: '1px solid var(--lp-color-gray-700)',
  backgroundColor: 'var(--lp-color-gray-900)',
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
});

export const statsText = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontWeight: 500,
});

export const addButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 12px',
  fontSize: '12px',
  fontWeight: 500,
  backgroundColor: 'var(--lp-color-brand-cyan-base)',
  border: 'none',
  borderRadius: '6px',
  color: 'var(--lp-color-gray-900)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  flexShrink: 0,

  ':hover': {
    backgroundColor: 'var(--lp-color-brand-cyan-600)',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-brand-cyan-base)',
    outlineOffset: '2px',
  },
});

export const scrollContainer = style({
  paddingTop: '8px',
  paddingBottom: '20px',
  flex: 1,
  width: '100%',
  overflow: 'auto',
  position: 'relative',
});

export const virtualInner = style({
  width: '100%',
  position: 'relative',
});

export const loadingMore = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 20px',
});

export const loadingMoreText = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontStyle: 'italic',
});
