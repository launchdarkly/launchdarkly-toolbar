const TOOLBAR_Z_INDEX = 2147400090;

export const Z_INDEX = {
  TOOLBAR: TOOLBAR_Z_INDEX, // Base toolbar layer
  POPOVER: TOOLBAR_Z_INDEX + 10, // Select dropdowns, tooltips. Should be greater than the toolbar z-index.
  MODAL: TOOLBAR_Z_INDEX + 50, // Modal overlays and popups. Should be above all other UI elements, aside from tooltips.
  TOOLTIP: TOOLBAR_Z_INDEX + 100, // Tooltips should be greater than the toolbar z-index. (e.g. JSON editor tooltips, popover tooltips)
} as const;
