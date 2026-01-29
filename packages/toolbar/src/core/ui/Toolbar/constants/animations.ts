export const EASING = {
  bounce: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  elastic: [0.22, 1, 0.36, 1] as const,
} as const;

export const ANIMATION_CONFIG = {
  // Main toolbar container animations - expanding (smooth)
  containerExpand: {
    width: { duration: 0.25, ease: EASING.smooth },
    height: { duration: 0.25, ease: EASING.smooth },
    borderRadius: { duration: 0.2, ease: EASING.smooth },
    boxShadow: { duration: 0.2, ease: 'easeInOut' as const },
  },
  // Main toolbar container animations - collapsing (bounce)
  containerCollapse: {
    width: { duration: 0.35, ease: EASING.elastic },
    height: { duration: 0.35, ease: EASING.elastic },
    borderRadius: { duration: 0.25, ease: EASING.smooth },
    boxShadow: { duration: 0.25, ease: 'easeInOut' as const },
  },
  // Instant animations for reduced motion preference (accessibility)
  containerInstant: {
    width: { duration: 0.01 },
    height: { duration: 0.01 },
    borderRadius: { duration: 0.01 },
    boxShadow: { duration: 0.01 },
  },
  // Backward compatibility - default to expand
  container: {
    width: { duration: 0.25, ease: EASING.smooth },
    height: { duration: 0.25, ease: EASING.smooth },
    borderRadius: { duration: 0.2, ease: EASING.smooth },
    boxShadow: { duration: 0.2, ease: 'easeInOut' as const },
  },
  // Circle logo animations
  circleLogo: {
    opacity: { duration: 0.15, ease: 'easeOut' as const },
    scale: { duration: 0.2, ease: EASING.smooth },
    rotate: { duration: 0.2, ease: EASING.smooth },
  },
  // Toolbar content animations
  toolbarContent: {
    opacity: { duration: 0.2, ease: EASING.smooth },
    y: { duration: 0.25, ease: EASING.smooth },
    scale: { duration: 0.25, ease: EASING.smooth },
  },
  // Content area animations
  contentArea: {
    opacity: { duration: 0.2, ease: 'easeInOut' as const, delay: 0.1 },
    y: { duration: 0.25, ease: EASING.smooth, delay: 0.1 },
  },
  // Tab content transitions
  tabContent: {
    duration: 0.3,
    ease: EASING.smooth,
  },
  // Tabs container animations
  tabsContainer: {
    opacity: { duration: 0.2, ease: EASING.smooth },
    y: { duration: 0.2, ease: EASING.smooth },
    delay: 0.05,
  },
  // Event list animations
  eventList: {
    liveTail: {
      dot: {
        scale: [1, 1.2, 1] as number[],
        opacity: [0.5, 1, 0.5] as number[],
        transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const },
      },
      container: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: EASING.smooth },
      },
    },
  },
} as const;

export const DIMENSIONS = {
  collapsed: { width: 48, height: 48, borderRadius: 24 },
  expanded: { width: 400, borderRadius: 12 },
  scale: { expanded: 1, collapsed: 1 },
  slideDistance: 30,
} as const;

export const SHADOWS = {
  expanded: '0 12px 48px rgba(0, 0, 0, 0.5)',
  hoveredCollapsed: '0 8px 40px rgba(0, 0, 0, 0.4)',
  collapsed: '0 4px 16px rgba(0, 0, 0, 0.3)',
} as const;

// Drag and interaction constants
export const DRAG_CONSTANTS = {
  THRESHOLD_PIXELS: 3, // Minimum pixels to move before considering it a drag
  CLICK_RESET_DELAY_MS: 50, // Delay before resetting drag state to allow click detection
} as const;
