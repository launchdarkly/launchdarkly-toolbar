const TOOLBAR_Z_INDEX = 2147400100;

export const Z_INDEX = {
  TOOLBAR: TOOLBAR_Z_INDEX, // Base toolbar layer
  POPOVER: TOOLBAR_Z_INDEX + 10, // Select dropdowns, tooltips. Should be greater than the toolbar z-index.
} as const;
