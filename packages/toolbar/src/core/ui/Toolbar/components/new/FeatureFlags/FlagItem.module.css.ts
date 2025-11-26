import { style } from '@vanilla-extract/css';

export const container = style({
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-800)',
  marginBottom: '8px',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  transition: 'all 0.2s ease',
  justifyContent: 'space-between',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-700)',
  },
});

export const containerBlock = style({
  backgroundColor: 'var(--lp-color-gray-850)',
  border: '1px solid var(--lp-color-gray-800)',
  marginBottom: '8px',
  borderRadius: '8px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  transition: 'all 0.2s ease',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    borderColor: 'var(--lp-color-gray-700)',
  },
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  justifyContent: 'space-between',
});

export const info = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  minWidth: 0, // Allow flex item to shrink
  maxWidth: '200px',
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

export const overrideDot = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '8px',
  height: '8px',
  flexShrink: 0,
  cursor: 'pointer',
});

export const overrideDotInner = style({
  width: '8px',
  height: '8px',
  backgroundColor: 'var(--lp-color-brand-cyan-base)',
  borderRadius: '50%',
  transition: 'background-color 0.2s ease',
});

export const control = style({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0, // Don't shrink the control
});

export const readOnlyValue = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '12px',
});

export const objectLabel = style({
  color: 'var(--lp-color-gray-400)',
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '10px',
  letterSpacing: '0.5px',
});

export const objectValue = style({
  color: 'var(--lp-color-gray-300)',
  fontFamily: 'monospace',
  fontSize: '11px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '250px',
});
