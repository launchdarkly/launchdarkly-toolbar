export const Z_INDEX = {
  /** Base z-index for the toolbar */
  TOOLBAR: 2147400100,

  /** Z-index for popover elements (select dropdowns, tooltips) */
  POPOVER: 2147400110,
} as const;

export type ZIndexLevel = keyof typeof Z_INDEX;
