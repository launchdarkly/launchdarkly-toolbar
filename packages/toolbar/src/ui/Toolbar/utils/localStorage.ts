import { ToolbarPosition, TOOLBAR_POSITIONS } from '../types/toolbar';

export const TOOLBAR_STORAGE_KEYS = {
  LD_BASE_URL: 'ld-base-url',
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
    return position && TOOLBAR_POSITIONS.includes(position as ToolbarPosition) ? (position as ToolbarPosition) : null;
  } catch (error) {
    console.warn('Failed to load toolbar position from localStorage:', error);
    return null;
  }
}

export function saveBaseUrl(url: string): void {
  try {
    localStorage.setItem(TOOLBAR_STORAGE_KEYS.LD_BASE_URL, url);
  } catch (error) {
    console.warn('Failed to save LaunchDarkly base URL to localStorage:', error);
  }
}

export function loadBaseUrl(): string | null {
  try {
    return localStorage.getItem(TOOLBAR_STORAGE_KEYS.LD_BASE_URL);
  } catch (error) {
    console.warn('Failed to load LaunchDarkly base URL from localStorage:', error);
    return null;
  }
}
