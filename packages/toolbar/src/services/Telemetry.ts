export type TelemetryMode = 'sdk' | 'dev-server';

// Build-time opt-out flag injected via rslib define. May be undefined.
// When set to '0', telemetry will be disabled; when '1', enabled (unless other safeties disable it).
declare const __LD_TOOLBAR_TELEMETRY__: string | undefined;

import { isDoNotTrackEnabled } from '../utils/browser';

export interface TelemetryIdentity {
  clientSideId?: string;
  projectKey?: string;
  environmentKey?: string;
}

export interface TelemetryContext {
  toolbarVersion?: string;
  mode?: TelemetryMode;
  position?: 'left' | 'right';
  installId?: string;
  sessionId?: string;
}

export interface TelemetryEvent {
  name: string;
  timestamp: number;
  properties?: Record<string, unknown>;
}

interface InitializeOptions {
  enabled?: boolean;
  identity?: TelemetryIdentity;
  context?: TelemetryContext;
  samplingRate?: number; // 0..1
}

class TelemetryService {
  private static instance: TelemetryService | null = null;

  private enabled: boolean = true;
  private samplingRate: number = 1;
  private identity: TelemetryIdentity = {};
  private context: TelemetryContext = {};
  private buffer: TelemetryEvent[] = [];
  private sessionIdMemo: string | undefined;
  private listenersAttached = false;
  private flushIntervalId: number | undefined;

  private static readonly INSTALL_ID_STORAGE_KEY = 'ld-toolbar:installId';
  private static readonly SESSION_ID_STORAGE_KEY = 'ld-toolbar:sessionId';

  static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  initialize(options: InitializeOptions = {}): void {
    // Compute default enabled with DNT/opt-out safeguards. The caller can still override via options.enabled.
    const defaultEnabled = this.computeDefaultEnabled();
    this.enabled = options.enabled ?? defaultEnabled;
    this.samplingRate = this.normalizeRate(options.samplingRate ?? this.samplingRate);
    if (options.identity) {
      this.identity = { ...this.identity, ...options.identity };
    }

    // Ensure installId and sessionId are present in context
    const resolvedInstallId = options.context?.installId ?? this.getOrCreateInstallId();
    const resolvedSessionId = options.context?.sessionId ?? this.getOrCreateSessionId();

    if (options.context) {
      this.context = {
        ...this.context,
        ...options.context,
        installId: resolvedInstallId ?? this.context.installId,
        sessionId: resolvedSessionId ?? this.context.sessionId,
      };
    } else {
      this.context = {
        ...this.context,
        installId: resolvedInstallId ?? this.context.installId,
        sessionId: resolvedSessionId ?? this.context.sessionId,
      };
    }

    // Placeholder behavior
    // eslint-disable-next-line no-console
    console.log('[telemetry:init]', {
      enabled: this.enabled,
      samplingRate: this.samplingRate,
      identity: this.identity,
      context: this.context,
    });

    // Attach lifecycle hooks to flush buffers
    this.attachLifecycleListeners();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    // eslint-disable-next-line no-console
    console.log('[telemetry:enabled]', enabled);
  }

  setSamplingRate(rate: number): void {
    this.samplingRate = this.normalizeRate(rate);
    // eslint-disable-next-line no-console
    console.log('[telemetry:samplingRate]', this.samplingRate);
  }

  setIdentity(identity: TelemetryIdentity): void {
    this.identity = { ...this.identity, ...identity };
    // eslint-disable-next-line no-console
    console.log('[telemetry:identity]', this.identity);
  }

  setContext(context: TelemetryContext): void {
    this.context = { ...this.context, ...context };
    // eslint-disable-next-line no-console
    console.log('[telemetry:context]', this.context);
  }

  track(name: string, properties?: Record<string, unknown>): void {
    if (!this.enabled) return;
    if (this.samplingRate < 1 && Math.random() > this.samplingRate) return;

    const event: TelemetryEvent = {
      name,
      timestamp: Date.now(),
      properties,
    };

    this.buffer.push(event);

    // Placeholder behavior
    // eslint-disable-next-line no-console
    console.log('[telemetry:event]', {
      identity: this.identity,
      context: this.context,
      event,
    });
  }

  flush(): void {
    if (!this.enabled) return;
    if (this.buffer.length === 0) return;

    // Placeholder behavior
    // eslint-disable-next-line no-console
    console.log('[telemetry:flush]', {
      identity: this.identity,
      context: this.context,
      events: this.buffer.slice(),
    });

    this.buffer = [];
  }

  private normalizeRate(rate: number): number {
    if (Number.isNaN(rate)) return 1;
    if (rate < 0) return 0;
    if (rate > 1) return 1;
    return rate;
  }

  /**
   * Determine whether telemetry should be enabled by default.
   * Safeguards:
   * - Honors browser Do-Not-Track
   * - Honors runtime kill switch: window.__LD_TOOLBAR_TELEMETRY_DISABLED__
   * - Auto-disables in Storybook and during unit tests (jsdom)
   * - Honors build-time env override __LD_TOOLBAR_TELEMETRY__ ('0' to disable, '1' to enable)
   *
   * Note: For now, we allow telemetry in development. In production we may choose
   * to gate differently (e.g., enable only in production) — see product decision.
   */
  private computeDefaultEnabled(): boolean {
    // SSR: disable by default server-side
    if (typeof window === 'undefined') return false;

    // Build-time env override
    if (typeof __LD_TOOLBAR_TELEMETRY__ === 'string') {
      if (__LD_TOOLBAR_TELEMETRY__ === '0') return false;
      if (__LD_TOOLBAR_TELEMETRY__ === '1') {
        // Continue to check runtime safeties (DNT/kill switch/tests)
      }
    }

    // Runtime kill switch
    try {
      if ((window as any).__LD_TOOLBAR_TELEMETRY_DISABLED__ === true) return false;
    } catch {}

    // Do-Not-Track
    try {
      if (isDoNotTrackEnabled()) return false;
    } catch {}

    // TODO Auto-disable in Storybook
    // TODO Auto-disable in tests (E2E and Vitest)

    // Default enabled (development allowed). In production, consider gating here.
    return true;
  }

  private getOrCreateInstallId(): string | undefined {
    // SSR-safe guards
    if (typeof window === 'undefined') return undefined;

    // Try localStorage first
    try {
      const existing = window.localStorage.getItem(TelemetryService.INSTALL_ID_STORAGE_KEY);
      if (existing) return existing;
      const id = this.generateUuid();
      window.localStorage.setItem(TelemetryService.INSTALL_ID_STORAGE_KEY, id);
      return id;
    } catch {
      // Fallback to sessionStorage
      try {
        const existing = window.sessionStorage.getItem(TelemetryService.INSTALL_ID_STORAGE_KEY);
        if (existing) return existing;
        const id = this.generateUuid();
        window.sessionStorage.setItem(TelemetryService.INSTALL_ID_STORAGE_KEY, id);
        return id;
      } catch {
        return undefined;
      }
    }
  }

  private getOrCreateSessionId(): string | undefined {
    if (this.sessionIdMemo) return this.sessionIdMemo;
    if (typeof window === 'undefined') return undefined;

    // Prefer sessionStorage so it survives SPA navigations within the tab
    try {
      const existing = window.sessionStorage.getItem(TelemetryService.SESSION_ID_STORAGE_KEY);
      if (existing) {
        this.sessionIdMemo = existing;
        return existing;
      }
      const id = this.generateUuid();
      window.sessionStorage.setItem(TelemetryService.SESSION_ID_STORAGE_KEY, id);
      this.sessionIdMemo = id;
      return id;
    } catch {
      // Fallback to in-memory only
      const id = this.generateUuid();
      this.sessionIdMemo = id;
      return id;
    }
  }

  private generateUuid(): string {
    try {
      if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
        return (crypto as any).randomUUID();
      }
    } catch {}
    // Basic fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private attachLifecycleListeners(): void {
    if (this.listenersAttached) return;
    if (typeof window === 'undefined') return;

    const onPageHide = () => {
      try {
        this.flush();
        if (this.flushIntervalId) {
          clearInterval(this.flushIntervalId);
          this.flushIntervalId = undefined;
        }
      } catch {}
    };
    const onVisibilityChange = () => {
      try {
        if (document.visibilityState === 'hidden') this.flush();
      } catch {}
    };

    try {
      window.addEventListener('pagehide', onPageHide);
      document.addEventListener('visibilitychange', onVisibilityChange);
      this.listenersAttached = true;
    } catch {}

    // Optional periodic flush while active
    try {
      this.flushIntervalId = window.setInterval(() => {
        try {
          this.flush();
        } catch {}
      }, 30000);
    } catch {}
  }
}

export const telemetry = TelemetryService.getInstance();
export type { TelemetryService };
