import type { LDClient } from 'launchdarkly-js-client-sdk';
import type { IFlagOverridePlugin } from '../types/plugin';

/**
 * Analytics utility for tracking toolbar usage events
 */
export class ToolbarAnalytics {
  private ldClient: LDClient | null = null;

  constructor(flagOverridePlugin?: IFlagOverridePlugin) {
    this.ldClient = flagOverridePlugin?.getClient() || null;
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
    this.track('ld.toolbar.initialized', {});
  }

  /**
   * Track toolbar position changes
   */
  trackPositionChange(oldPosition: string, newPosition: string): void {
    this.track('ld.toolbar.position.changed', {
      oldPosition,
      newPosition,
    });
  }

  /**
   * Track toolbar pin/unpin actions
   */
  trackPinToggle(action: 'pin' | 'unpin'): void {
    this.track('ld.toolbar.pin.toggled', {
      action,
    });
  }

  /**
   * Track toolbar tab navigation
   */
  trackTabChange(fromTab: string | null, toTab: string): void {
    this.track('ld.toolbar.tab.changed', {
      fromTab,
      toTab,
    });
  }

  /**
   * Track search usage
   */
  trackSearch(query: string, resultsCount: number): void {
    this.track('ld.toolbar.search', {
      query,
      resultsCount,
    });
  }

  /**
   * Track toolbar expand/collapse events
   */
  trackToolbarToggle(action: 'expand' | 'collapse', trigger: 'close_button' | 'click_outside' | 'tab_toggle'): void {
    this.track('ld.toolbar.toggle', {
      action,
      trigger,
    });
  }
  /**
   * Track flag override events
   */
  trackFlagOverride(flagKey: string, value: unknown, action: 'set' | 'remove' | 'clear_all'): void {
    this.track('ld.toolbar.toggle.flag', {
      flagKey,
      value: action === 'remove' ? null : value,
      action,
    });
  }

  /**
   * Track deeplink creation for missing flags
   */
  trackDeeplinkCreation(flagKey: string, baseUrl: string): void {
    this.track('ld.toolbar.deeplink.create_flag', {
      flagKey,
      baseUrl,
    });
  }
  
  /**
   * Track 'Show overrides only' clicks
   */
  trackShowOverridesOnlyClick(enabled: boolean): void {
    this.track('ld.toolbar.show_overrides_only', {
      enabled,
    });
  }

  /**
   * Track Event clicks
   */
  trackEventClick(eventName: string): void {
    this.track('ld.toolbar.event.click', {
      eventName,
    });
  }
}
