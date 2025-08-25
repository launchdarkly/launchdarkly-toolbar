import { ToolbarPosition } from '../types/toolbar';

export const TOOLBAR_STORAGE_KEYS = {
  POSITION: 'ld-toolbar-position',
  DISABLED: 'ld-toolbar-disabled',
  PROJECT: 'ld-toolbar-project',
} as const;

export function saveToolbarPosition(position: ToolbarPosition): void {
  try {
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.POSITION, position);
  } catch (error) {
    console.warn('Failed to save toolbar position to localStorage:', error);
  }
}

export function loadToolbarPosition(): ToolbarPosition | null {
  try {
    const position = localStorage.getItem(TOOLBAR_STORAGE_KEYS.POSITION);
    return position === 'left' || position === 'right' ? position : null;
  } catch (error) {
    console.warn('Failed to load toolbar position from localStorage:', error);
    return null;
  }
}
