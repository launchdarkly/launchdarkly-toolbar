import { style, keyframes } from '@vanilla-extract/css';

export const statsHeader = style({
  padding: '8px 20px',
  borderBottom: '1px solid var(--lp-color-gray-700)',
  backgroundColor: 'var(--lp-color-gray-800)',
});

export const statsText = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
  fontWeight: 500,
});

export const eventInfo = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minWidth: 0,
  overflow: 'hidden',
  marginRight: '16px',
});

export const eventName = style({
  fontSize: '14px',
  fontWeight: 400,
  color: 'var(--lp-color-gray-200)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

export const eventMeta = style({
  fontSize: '12px',
  color: 'var(--lp-color-gray-400)',
});

export const eventBadge = style({
  fontSize: '11px',
  fontWeight: 500,
  padding: '2px 6px',
  borderRadius: '4px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

export const eventBadgeFeature = style([
  eventBadge,
  {
    backgroundColor: '#065f46', // Subtle green
    color: '#d1fae5', // Light green text
  },
]);

export const eventBadgeIdentify = style([
  eventBadge,
  {
    backgroundColor: '#1e3a8a', // Subtle blue
    color: '#dbeafe', // Light blue text
  },
]);

export const eventBadgeCustom = style([
  eventBadge,
  {
    backgroundColor: '#4b5563', // Gray-600 - subtle and professional
    color: '#f3f4f6', // Light gray text
  },
]);

export const eventBadgeDebug = style([
  eventBadge,
  {
    backgroundColor: '#991b1b', // Subtle red
    color: '#fecaca', // Light red text
  },
]);

export const eventBadgeSummary = style([
  eventBadge,
  {
    backgroundColor: '#581c87', // Subtle purple
    color: '#e9d5ff', // Light purple text
  },
]);

export const eventBadgeDiagnostic = style([
  eventBadge,
  {
    backgroundColor: '#9a3412', // Subtle orange
    color: '#fed7aa', // Light orange text
  },
]);

export const eventBadgeDefault = style([
  eventBadge,
  {
    backgroundColor: '#374151', // Gray-700
    color: '#e5e7eb', // Gray-200
  },
]);

export const virtualContainer = style({
  height: '400px',
  overflow: 'auto',
  scrollbarColor: 'var(--lp-color-gray-800) transparent',
  scrollbarWidth: 'thin',

  ':hover': {
    scrollbarColor: 'var(--lp-color-gray-700) transparent',
  },

  selectors: {
    '&::-webkit-scrollbar': {
      width: '8px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-800)',
      borderRadius: '4px',
    },
    '&:hover::-webkit-scrollbar-thumb': {
      background: 'var(--lp-color-gray-700)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
  },
});

export const virtualInner = style({
  width: '100%',
  position: 'relative',
});

export const virtualItem = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',

  ':hover': {
    backgroundColor: 'var(--lp-color-gray-800)',
    transition: 'background-color 0.2s ease',
  },
});

export const liveTailContainer = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '400px',
  gap: '12px',
  color: 'var(--lp-color-gray-400)',
});

export const liveTailIndicator = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const pulseAnimation = keyframes({
  '0%': {
    opacity: 1,
    transform: 'scale(1)',
  },
  '50%': {
    opacity: 0.3,
    transform: 'scale(1.2)',
  },
  '100%': {
    opacity: 1,
    transform: 'scale(1)',
  },
});

export const liveTailDot = style({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#10b981', // Green color
  animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
});

export const liveTailText = style({
  fontSize: '16px',
  fontWeight: 500,
  color: 'var(--lp-color-gray-300)',
});

export const liveTailSubtext = style({
  fontSize: '14px',
  color: 'var(--lp-color-gray-500)',
  textAlign: 'center',
});

export const eventListItem = style({
  height: '100%',
});
