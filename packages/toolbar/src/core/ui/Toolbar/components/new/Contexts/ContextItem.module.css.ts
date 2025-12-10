import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-700)',
  margin: '12px',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-600)',
  },
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const containerActive = style({
  backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.08)',
  border: '1px solid rgba(from var(--lp-color-brand-cyan-base) r g b / 0.3)',

  ':hover': {
    backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.12)',
    borderColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.4)',
  },
});

export const iconContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  backgroundColor: 'var(--lp-color-gray-800)',
  flexShrink: 0,
});

export const info = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0,
});

export const nameRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0,
});

export const name = style({
  fontSize: '14px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-200)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flex: 1,
});

export const keyRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
});

export const key = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontFamily: 'monospace',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const kindBadge = style({
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
});

export const anonymousBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 6px',
  fontSize: '10px',
  fontWeight: 500,
  borderRadius: '4px',
  backgroundColor: 'rgba(from var(--lp-color-yellow-500) r g b / 0.15)',
  color: 'var(--lp-color-yellow-400)',
  flexShrink: 0,
});

export const activeBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 8px',
  fontSize: '10px',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderRadius: '4px',
  backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.2)',
  color: 'var(--lp-color-brand-cyan-base)',
  flexShrink: 0,
});

export const activeDot = style({
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: 'var(--lp-color-brand-cyan-base)',
});

export const actions = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
});

export const expandButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  color: 'var(--lp-color-gray-400)',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    color: 'var(--lp-color-gray-300)',
  },

  ':focus-visible': {
    outline: '2px solid var(--lp-color-brand-cyan-base)',
    outlineOffset: '2px',
  },
});

export const chevron = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--lp-color-gray-500)',
  transition: 'transform 0.2s',
  width: '20px',
  height: '20px',
});

export const chevronExpanded = style({
  transform: 'rotate(180deg)',
});
