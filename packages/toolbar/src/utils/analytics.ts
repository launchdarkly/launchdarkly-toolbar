import type { LDClient } from 'launchdarkly-js-client-sdk';

export const ANALYTICS_EVENT_PREFIX = 'ld.toolbar';

const EVENTS = {
  INITIALIZED: `${ANALYTICS_EVENT_PREFIX}.initialized`,
  POSITION_CHANGED: `${ANALYTICS_EVENT_PREFIX}.position.changed`,
  PIN_TOGGLED: `${ANALYTICS_EVENT_PREFIX}.pin.toggled`,
  TAB_CHANGED: `${ANALYTICS_EVENT_PREFIX}.tab.changed`,
  SEARCH: `${ANALYTICS_EVENT_PREFIX}.search`,
  TOGGLE: `${ANALYTICS_EVENT_PREFIX}.toggle`,
  TOGGLE_FLAG: `${ANALYTICS_EVENT_PREFIX}.toggle.flag`,
  DEEPLINK_CREATE_FLAG: `${ANALYTICS_EVENT_PREFIX}.deeplink.create_flag`,
  SHOW_OVERRIDES_ONLY: `${ANALYTICS_EVENT_PREFIX}.show_overrides_only`,
  EVENT_CLICK: `${ANALYTICS_EVENT_PREFIX}.event.click`,
} as const;

/**
 * Analytics utility for tracking toolbar usage events
 */
export class ToolbarAnalytics {
  private ldClient: LDClient | null = null;
  // Timer id for debouncing search tracking
  private searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(ldClient?: LDClient | null) {
    this.ldClient = ldClient || null;
  }

  /**
   * Internal method to send tracking events
   */
  private track(eventName: string, properties: Record<string, unknown>): void {
    if (!this.ldClient) {
      console.debug('ToolbarAnalytics: LDClient not available, skipping track event:', eventName);
      return;
    }

    try {
      this.ldClient.track(eventName, properties);
    } catch (error) {
      console.error('ToolbarAnalytics: Failed to track event:', eventName, error);
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
   * Track toolbar pin/unpin actions
   */
  trackPinToggle(action: 'pin' | 'unpin'): void {
    this.track(EVENTS.PIN_TOGGLED, {
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
  trackToolbarToggle(action: 'expand' | 'collapse', trigger: 'close_button' | 'click_outside' | 'tab_toggle'): void {
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
   * Track opening a flag deeplink
   */
  trackOpenFlagDeeplink(flagKey: string, baseUrl: string): void {
    this.track(EVENTS.DEEPLINK_CREATE_FLAG, {
      flagKey,
      baseUrl,
    });
  }

  /**
   * Track 'Show overrides only' clicks
   */
  trackShowOverridesOnlyClick(enabled: boolean): void {
    this.track(EVENTS.SHOW_OVERRIDES_ONLY, {
      enabled,
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
}
