export const EASING = {
  bounce: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  elastic: [0.22, 1, 0.36, 1] as const,
} as const;

export const ANIMATION_CONFIG = {
  // Main toolbar container animations
  container: {
    width: { duration: 0.5, ease: EASING.bounce },
    height: { duration: 0.5, ease: EASING.bounce },
    borderRadius: { duration: 0.4, ease: EASING.smooth },
    boxShadow: { duration: 0.3, ease: 'easeInOut' as const },
  },
  // Circle logo animations
  circleLogo: {
    opacity: { duration: 0.25, ease: 'easeOut' as const },
    scale: { duration: 0.3, ease: EASING.smooth },
    rotate: { duration: 0.3, ease: EASING.smooth },
  },
  // Toolbar content animations
  toolbarContent: {
    opacity: { duration: 0.4, ease: EASING.smooth },
    y: { duration: 0.5, ease: EASING.bounce },
    scale: { duration: 0.5, ease: EASING.bounce },
  },
  // Content area animations
  contentArea: {
    opacity: { duration: 0.4, ease: 'easeInOut' as const },
    maxHeight: { duration: 0.5, ease: EASING.elastic },
  },
  // Tab content transitions
  tabContent: {
    duration: 0.3,
    ease: EASING.smooth,
  },
  // Tabs container animations
  tabsContainer: {
    opacity: { duration: 0.5, ease: EASING.bounce },
    y: { duration: 0.5, ease: EASING.bounce },
    delay: 0.3,
  },
} as const;

export const DIMENSIONS = {
  collapsed: { width: 60, height: 60, borderRadius: 30 },
  expanded: { width: 400, borderRadius: 12 },
  scale: { expanded: 1.02, collapsed: 1 },
  slideDistance: 30,
} as const;

export const SHADOWS = {
  expanded: '0 12px 48px rgba(0, 0, 0, 0.5)',
  hoveredCollapsed: '0 8px 40px rgba(0, 0, 0, 0.4)',
  collapsed: '0 4px 16px rgba(0, 0, 0, 0.3)',
} as const;
