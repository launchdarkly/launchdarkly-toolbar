export const TOOLBAR_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
export type ToolbarPosition = (typeof TOOLBAR_POSITIONS)[number];
