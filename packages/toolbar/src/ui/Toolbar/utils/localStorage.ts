import { ToolbarPosition, TOOLBAR_POSITIONS } from '../types/toolbar';

export const TOOLBAR_STORAGE_KEYS = {
  POSITION: 'ld-toolbar-position',
  DISABLED: 'ld-toolbar-disabled',
  PROJECT: 'ld-toolbar-project',
} as const;

export const LD_BASE_URL_KEY = 'ld-base-url';

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

export function saveLDBaseUrl(url: string): void {
  try {
    localStorage.setItem(LD_BASE_URL_KEY, url);
  } catch (error) {
    console.warn('Failed to save LaunchDarkly base URL to localStorage:', error);
  }
}

export function loadLDBaseUrl(): string | null {
  try {
    return localStorage.getItem(LD_BASE_URL_KEY);
  } catch (error) {
    console.warn('Failed to load LaunchDarkly base URL from localStorage:', error);
    return null;
  }
}
