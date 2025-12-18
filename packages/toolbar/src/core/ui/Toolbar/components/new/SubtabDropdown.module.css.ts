import { style } from '@vanilla-extract/css';
import {
  popoverContainerRules,
  popoverTriggerRules,
  popoverTriggerOpenRules,
  popoverPanelRules,
  popoverMenuItemRules,
  popoverMenuItemActiveRules,
} from '../../../styles/popover.css';
import { flexCenter, iconSmall } from '../../../styles/mixins.css';

export const container = style(popoverContainerRules);

export const trigger = style({
  ...popoverTriggerRules,
  minWidth: '120px',
});

export const triggerOpen = style(popoverTriggerOpenRules);

export const filterIcon = style(iconSmall);

export const label = style({
  flex: 1,
  textAlign: 'left',
  whiteSpace: 'nowrap',
});

export const chevron = style({
  ...flexCenter,
  flexShrink: 0,
});

export const chevronIcon = style(iconSmall);

export const menu = style({
  ...popoverPanelRules,
  top: 'calc(100% + 4px)',
  left: 0,
  minWidth: '100%',
  backgroundColor: 'var(--lp-color-gray-800)', // Slightly different from default
  borderRadius: '6px',
  pointerEvents: 'auto',
});

export const menuItem = style({
  ...popoverMenuItemRules,
  pointerEvents: 'auto',
  userSelect: 'none',
});

export const menuItemActive = style(popoverMenuItemActiveRules);
