import type { LDClient } from 'launchdarkly-js-client-sdk';
import type { FeedbackSentiment } from '../../types/analytics';
import { isDoNotTrackEnabled } from './browser';
import { ToolbarMode } from '../ui/Toolbar/types';

export const ANALYTICS_EVENT_PREFIX = 'ld.toolbar';

const EVENTS = {
  INITIALIZED: 'initialized',
  POSITION_CHANGED: 'position.changed',
  AUTO_COLLAPSE_TOGGLED: 'auto.collapse.toggled',
  TAB_CHANGED: 'tab.changed',
  SUBTAB_CHANGED: 'subtab.changed',
  SEARCH: 'search',
  TOGGLE: 'toggle',
  TOGGLE_FLAG: 'toggle.flag',
  OPEN_FLAG_DEEPLINK: 'open.flag.deeplink',
  CLEAR_EVENTS: 'clear.events',
  EVENT_CLICK: 'event.click',
  RELOAD_ON_FLAG_CHANGE_TOGGLE: 'reload.on.flag.change.toggle',
  STAR_FLAG: 'star.flag',
  FILTER_CHANGED: 'filter.changed',
  LOGIN_SUCCESS: 'login.success',
  LOGIN_CANCELLED: 'login.cancelled',
  LOGOUT: 'logout',
  AUTH_ERROR: 'auth.error',
  API_ERROR: 'api.error',
  COPY_FLAG_KEY: 'copy.flag.key',
  PROJECT_SWITCHED: 'project.switched',
  REFRESH: 'refresh',
  FEEDBACK_SUBMITTED: 'feedback.submitted',
  CONTEXT_ADDED: 'context.added',
  CONTEXT_REMOVED: 'context.removed',
  CONTEXT_UPDATED: 'context.updated',
  CONTEXT_SELECTED: 'context.selected',
  CONTEXT_EDIT_STARTED: 'context.edit.started',
  CONTEXT_EDIT_CANCELLED: 'context.edit.cancelled',
  CONTEXT_KEY_COPIED: 'context.key.copied',
} as const;

/**
 * Analytics utility for tracking toolbar usage events
 */
export class ToolbarAnalytics {
  private ldClient: LDClient | null = null;
  private mode: ToolbarMode | null = null;
  private isOptedInToAnalytics: boolean = false;
  // Timer id for debouncing search tracking
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(ldClient?: LDClient | null, mode?: ToolbarMode, isOptedInToAnalytics?: boolean) {
    this.ldClient = ldClient || null;
    this.mode = mode || null;
    this.isOptedInToAnalytics = isOptedInToAnalytics || false;
  }

  /**
   * Internal method to send tracking events
   */
  private track(eventName: string, properties: Record<string, unknown>): void {
    const fullEventName = `${ANALYTICS_EVENT_PREFIX}.${eventName}`;

    if (!this.ldClient) {
      console.debug('ToolbarAnalytics: LDClient not available, skipping track event:', fullEventName);
      return;
    }

    if (isDoNotTrackEnabled() || !this.isOptedInToAnalytics) {
      return;
    }

    // Include these properties in all tracked events
    const enrichedProperties = {
      ...properties,
      mode: this.mode,
    };

    try {
      this.ldClient.track(fullEventName, enrichedProperties);
    } catch (error) {
      console.error('ToolbarAnalytics: Failed to track event:', fullEventName, error);
    }
  }

  /**
   * Track toolbar initialization
   */
  trackInitialization(): void {
    this.track(EVENTS.INITIALIZED, {});
  }

  /**
   * Track toolbar position changes
   */
  trackPositionChange(oldPosition: string, newPosition: string, source: 'drag' | 'settings'): void {
    this.track(EVENTS.POSITION_CHANGED, {
      oldPosition,
      newPosition,
      source,
    });
  }

  /**
   * Track toolbar auto-collapse toggle
   */
  trackAutoCollapseToggle(action: 'enable' | 'disable'): void {
    this.track(EVENTS.AUTO_COLLAPSE_TOGGLED, {
      action,
    });
  }

  /**
   * Track toolbar tab navigation
   */
  trackTabChange(fromTab: string | null, toTab: string): void {
    this.track(EVENTS.TAB_CHANGED, {
      fromTab,
      toTab,
    });
  }

  /**
   * Track toolbar subtab navigation
   */
  trackSubtabChange(fromSubtab: string | null, toSubtab: string): void {
    this.track(EVENTS.SUBTAB_CHANGED, {
      fromSubtab,
      toSubtab,
    });
  }

  /**
   * Track search usage
   */
  trackSearch(query: string): void {
    // Debounce search tracking so rapid consecutive searches are coalesced.
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    this.searchDebounceTimer = setTimeout(() => {
      if (!query) return;
      this.track(EVENTS.SEARCH, { query });
      this.searchDebounceTimer = null;
    }, 1000);
  }

  /**
   * Track toolbar expand/collapse events
   */
  trackToolbarToggle(
    action: 'expand' | 'collapse',
    trigger: 'close_button' | 'click_outside' | 'tab_toggle' | 'focus_lost',
  ): void {
    this.track(EVENTS.TOGGLE, {
      action,
      trigger,
    });
  }
  /**
   * Track flag override events
   */
  trackFlagOverride(flagKey: string, value: unknown, action: 'set' | 'remove' | 'clear_all'): void {
    this.track(EVENTS.TOGGLE_FLAG, {
      flagKey,
      value: action === 'remove' ? null : value,
      action,
    });
  }

  /**
   * Track starred flag events
   */
  trackStarredFlag(flagKey: string, action: 'star' | 'unstar' | 'clear_all'): void {
    this.track(EVENTS.STAR_FLAG, {
      flagKey,
      action,
    });
  }

  /**
   * Track filter changes
   */
  trackFilterChange(filter: 'all' | 'overrides' | 'starred', action: 'selected' | 'deselected'): void {
    this.track(EVENTS.FILTER_CHANGED, {
      filter,
      action,
    });
  }

  /**
   * Track opening a flag deeplink
   */
  trackOpenFlagDeeplink(flagKey: string, baseUrl: string): void {
    this.track(EVENTS.OPEN_FLAG_DEEPLINK, {
      flagKey,
      baseUrl,
    });
  }

  /**
   * Track clearing events
   */
  trackClearEvents(): void {
    this.track(EVENTS.CLEAR_EVENTS, {});
  }

  /**
   * Track Event clicks
   */
  trackEventClick(eventName: string): void {
    this.track(EVENTS.EVENT_CLICK, {
      eventName,
    });
  }

  /**
   * Track Reload on Flag Change toggles
   */
  trackReloadOnFlagChangeToggle(enabled: boolean): void {
    this.track(EVENTS.RELOAD_ON_FLAG_CHANGE_TOGGLE, {
      enabled,
    });
  }

  /**
   * Track successful login
   */
  trackLoginSuccess(): void {
    this.track(EVENTS.LOGIN_SUCCESS, {});
  }

  /**
   * Track when user closes the login screen without logging in
   */
  trackLoginCancelled(): void {
    this.track(EVENTS.LOGIN_CANCELLED, {});
  }

  /**
   * Track when user logs out
   */
  trackLogout(): void {
    this.track(EVENTS.LOGOUT, {});
  }

  /**
   * Track authentication errors
   */
  trackAuthError(error: unknown): void {
    this.track(EVENTS.AUTH_ERROR, {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  /**
   * Track project switching in dev server mode
   */
  trackProjectSwitch(fromProject: string, toProject: string): void {
    this.track(EVENTS.PROJECT_SWITCHED, {
      fromProject,
      toProject,
    });
  }

  /**
   * Track API errors
   */
  trackApiError(error: unknown): void {
    this.track(EVENTS.API_ERROR, {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  /**
   * Track refresh button clicks in dev server mode
   */
  trackRefresh(): void {
    this.track(EVENTS.REFRESH, {});
  }

  /**
   * Track user feedback
   */
  trackFeedback(feedback: string, sentiment: FeedbackSentiment): void {
    this.track(EVENTS.FEEDBACK_SUBMITTED, {
      sentiment,
      comment: feedback,
    });
  }

  /**
   * Track flag key copy
   */
  trackFlagKeyCopy(flagKey: string): void {
    this.track(EVENTS.COPY_FLAG_KEY, {
      flagKey,
    });
  }

  /**
   * Track context added
   */
  trackContextAdded(contextKind: string, contextKey: string, isMultiKind: boolean): void {
    this.track(EVENTS.CONTEXT_ADDED, {
      contextKind,
      contextKey,
      isMultiKind,
    });
  }

  /**
   * Track context removed
   */
  trackContextRemoved(contextKind: string, contextKey: string): void {
    this.track(EVENTS.CONTEXT_REMOVED, {
      contextKind,
      contextKey,
    });
  }

  /**
   * Track context updated
   */
  trackContextUpdated(oldKind: string, oldKey: string, newKind: string, newKey: string): void {
    this.track(EVENTS.CONTEXT_UPDATED, {
      oldKind,
      oldKey,
      newKind,
      newKey,
    });
  }

  /**
   * Track context selected/activated
   */
  trackContextSelected(contextKind: string, contextKey: string): void {
    this.track(EVENTS.CONTEXT_SELECTED, {
      contextKind,
      contextKey,
    });
  }

  /**
   * Track context edit started
   */
  trackContextEditStarted(contextKind: string, contextKey: string): void {
    this.track(EVENTS.CONTEXT_EDIT_STARTED, {
      contextKind,
      contextKey,
    });
  }

  /**
   * Track context edit cancelled
   */
  trackContextEditCancelled(contextKind: string, contextKey: string): void {
    this.track(EVENTS.CONTEXT_EDIT_CANCELLED, {
      contextKind,
      contextKey,
    });
  }

  /**
   * Track context key copy
   */
  trackContextKeyCopy(contextKey: string): void {
    this.track(EVENTS.CONTEXT_KEY_COPIED, {
      contextKey,
    });
  }
}
