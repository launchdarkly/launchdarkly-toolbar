import { style } from '@vanilla-extract/css';
import { Z_INDEX } from '../../constants/zIndex';

/**
 * Reusable popover styles for consistent z-index management
 */
export const basePopover = style({
  zIndex: `${Z_INDEX.POPOVER} !important`,
});

export const popover = style([
  basePopover,
  {
    // Additional dark theme styles can be added here if needed
  },
]);
