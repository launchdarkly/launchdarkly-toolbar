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
  SEARCH: 'search',
  TOGGLE: 'toggle',
  TOGGLE_FLAG: 'toggle.flag',
  OPEN_FLAG_DEEPLINK: 'open.flag.deeplink',
  EVENT_CLICK: 'event.click',
  RELOAD_ON_FLAG_CHANGE_TOGGLE: 'reload.on.flag.change.toggle',
  STAR_FLAG: 'star.flag',
  FILTER_CHANGED: 'filter.changed',
  PROJECT_SWITCHED: 'project.switched',
  REFRESH: 'refresh',
  FEEDBACK_SUBMITTED: 'feedback.submitted',
} as const;

/**
 * Analytics utility for tracking toolbar usage events
 */
export class ToolbarAnalytics {
  private ldClient: LDClient | null = null;
  private mode: ToolbarMode | null = null;
  // Timer id for debouncing search tracking
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(ldClient?: LDClient | null, mode?: ToolbarMode) {
    this.ldClient = ldClient || null;
    this.mode = mode || null;
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

    if (isDoNotTrackEnabled()) {
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
   * Track project switching in dev server mode
   */
  trackProjectSwitch(fromProject: string, toProject: string): void {
    this.track(EVENTS.PROJECT_SWITCHED, {
      fromProject,
      toProject,
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
}
