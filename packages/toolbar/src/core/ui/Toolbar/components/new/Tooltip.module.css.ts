import { style } from '@vanilla-extract/css';
import { Z_INDEX } from '../../../constants/zIndex';

export const container = style({
  position: 'relative',
  display: 'inline-flex',
  flexShrink: 0,
});

export const tooltip = style({
  position: 'fixed',
  backgroundColor: 'var(--lp-color-gray-700)',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  zIndex: Z_INDEX.TOOLTIP,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  transformOrigin: 'center center',

  '::after': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--lp-color-gray-700)',
  },
});
