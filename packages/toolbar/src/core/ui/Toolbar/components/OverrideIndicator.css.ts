import { style } from '@vanilla-extract/css';

export const overrideIndicator = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  backgroundColor: 'rgba(from var(--lp-color-brand-cyan-base) r g b / 0.1)',
  border: '1px solid rgba(from var(--lp-color-brand-cyan-base) r g b / 0.3)',
  borderRadius: '12px',
  padding: '8px 8px',
  maxWidth: '85px',
});

export const interactive = style({
  cursor: 'pointer',

  ':hover': {
    backgroundColor: 'rgba(from var(--lp-color-red-500) r g b / 0.1)',
    borderColor: 'rgba(from var(--lp-color-red-500) r g b / 0.3)',
  },
});

export const overrideDot = style({
  width: '6px',
  height: '6px',
  backgroundColor: 'var(--lp-color-brand-cyan-base)',
  borderRadius: '50%',
  flexShrink: 0,
});

export const overrideTextContainer = style({
  width: '50px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
});

export const overrideText = style({
  fontSize: '10px',
  fontWeight: 500,
  color: 'var(--lp-color-brand-cyan-base)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  textAlign: 'center',
  position: 'absolute',
  width: '100%',
});
