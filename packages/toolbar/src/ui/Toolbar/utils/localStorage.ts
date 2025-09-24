import { ToolbarPosition, TOOLBAR_POSITIONS } from '../types/toolbar';

export const TOOLBAR_STORAGE_KEYS = {
  POSITION: 'ld-toolbar-position',
  DISABLED: 'ld-toolbar-disabled',
  PROJECT: 'ld-toolbar-project',
  PINNED: 'ld-toolbar-pinned',
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
    return position && TOOLBAR_POSITIONS.includes(position as ToolbarPosition) ? (position as ToolbarPosition) : null;
  } catch (error) {
    console.warn('Failed to load toolbar position from localStorage:', error);
    return null;
  }
}

export function saveToolbarPinned(isPinned: boolean): void {
  try {
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.PINNED, JSON.stringify(isPinned));
  } catch (error) {
    console.warn('Failed to save toolbar pinned state to localStorage:', error);
  }
}

export function loadToolbarPinned(): boolean {
  try {
    const pinned = localStorage.getItem(TOOLBAR_STORAGE_KEYS.PINNED);
    return JSON.parse(pinned ?? 'false');
  } catch (error) {
    console.warn('Failed to load toolbar pinned state from localStorage:', error);
    return false;
  }
}
