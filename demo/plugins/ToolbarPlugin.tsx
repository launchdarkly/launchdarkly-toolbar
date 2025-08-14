import type { LDClient } from 'launchdarkly-js-client-sdk';

type ChangeEvent = {
  key: string;
  value: unknown;
  source: 'sdk' | 'override';
};

type Scope = {
  project: string;
  env: string;
  contextHash: string; // hash of LD context you choose (non-PII)
};

export type ToolbarPluginConfig = {
  persistAcrossContext?: boolean; // default: false
  persistAcrossTabs?: boolean; // default: false  (true => localStorage, else sessionStorage)
  storageNamespace?: string; // default: 'ld-toolbar'
};

export class ToolbarPlugin {
  private ldClient?: LDClient;
  private originalVariation?: LDClient['variation'];
  private originalAllFlags?: () => Record<string, unknown>;
  private config: Required<ToolbarPluginConfig>;
  private scope: Scope = { project: 'unknown', env: 'unknown', contextHash: 'default' };

  // local overrides + base snapshot
  private overrideStore = new Map<string, unknown>();
  private baseFlags: Record<string, unknown> = {};

  // listeners
  private listeners = new Set<(e: ChangeEvent) => void>();

  constructor(config: ToolbarPluginConfig = {}) {
    this.config = {
      persistAcrossContext: config.persistAcrossContext ?? false,
      persistAcrossTabs: config.persistAcrossTabs ?? false,
      storageNamespace: config.storageNamespace ?? 'ld-toolbar',
    };
    this.initializeScope();
  }

  /** SDK calls thisg (via plugins array) */
  load(ldClient: LDClient) {
    this.ldClient = ldClient;

    // take snapshot (supports both getAllFlags() and allFlags() across SDK versions)
    this.baseFlags = this.readAllFlags(ldClient);

    // patch variation for local overrides
    this.originalVariation = ldClient.variation.bind(ldClient);
    ldClient.variation = (key: string, defaultValue: unknown) => {
      const k = this.keyFor(flagKey(key));
      if (this.overrideStore.has(k)) return this.overrideStore.get(k);
      return this.originalVariation!(key, defaultValue);
    };

    // patch allFlags to include overrides - this is what the React SDK uses
    this.originalAllFlags = (ldClient as any).allFlags?.bind(ldClient);
    if (this.originalAllFlags) {
      (ldClient as any).allFlags = () => {
        const baseFlags = this.originalAllFlags!();
        const overrides = this.currentOverridesForScope();
        return { ...baseFlags, ...overrides };
      };
    }

    // hydrate persisted overrides for current scope
    this.loadPersistedOverrides();

    // wire SDK events
    ldClient.on('ready', () => {
      this.baseFlags = this.readAllFlags(ldClient);
      this.emitInitial();
    });

    // change payload is Record<string, { current, previous }>
    ldClient.on('change', (changes: Record<string, { current: unknown; previous: unknown }>) =>
      this.handleSdkChange(changes),
    );
  }

  /** Optional alias if you prefer `register` naming */
  register(ldClient: LDClient) {
    this.load(ldClient);
  }

  /** Detach and restore SDK */
  unload() {
    if (!this.ldClient) return;
    if (this.originalVariation) {
      this.ldClient.variation = this.originalVariation;
      this.originalVariation = undefined;
    }
    if (this.originalAllFlags) {
      (this.ldClient as any).allFlags = this.originalAllFlags;
      this.originalAllFlags = undefined;
    }
    this.listeners.clear();
  }

  /** Public API for the Toolbar UI */
  async listFlags(): Promise<Record<string, unknown>> {
    // refresh snapshot from SDK (cheap) then overlay overrides
    if (this.ldClient) this.baseFlags = this.readAllFlags(this.ldClient);
    return { ...this.baseFlags, ...this.currentOverridesForScope() };
  }

  onChange(cb: (e: ChangeEvent) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  getOverride(key: string): unknown | undefined {
    return this.overrideStore.get(this.keyFor(flagKey(key)));
  }

  setOverride(key: string, value: unknown): void {
    const k = this.keyFor(flagKey(key));
    const previousValue = this.baseFlags[flagKey(key)];

    this.overrideStore.set(k, value);
    this.persistOverride(k, value);
    this.emitChange({ key, value, source: 'override' });

    // Use the new emitFlagChange method for immediate React component updates
    this.ldClient?.emitFlagChange(key, value, previousValue);
  }

  unsetOverride(key: string): void {
    const k = this.keyFor(flagKey(key));
    const previousValue = this.overrideStore.get(k);
    const had = this.overrideStore.delete(k);
    this.unpersistOverride(k);
    if (had) {
      // fall back to SDK value
      const value = this.baseFlags[flagKey(key)];
      this.emitChange({ key, value, source: 'sdk' });

      // Use the new emitFlagChange method for immediate React component updates
      this.ldClient?.emitFlagChange(key, value, previousValue);
    }
  }

  resetAll(): void {
    // clear only entries for current scope
    const prefix = this.scopePrefix();
    Array.from(this.overrideStore.keys())
      .filter((k) => k.startsWith(prefix))
      .forEach((k) => {
        this.overrideStore.delete(k);
        this.unpersistOverride(k);
      });

    // emit updates for every flag currently known
    Object.keys(this.baseFlags).forEach((key) => {
      this.emitChange({ key, value: this.baseFlags[key], source: 'sdk' });
    });
  }

  /** Scope determines persistence keyspace */
  setContextScope(opts: { project: string; env: string; contextHash: string }) {
    const prev = this.scope;
    this.scope = { project: opts.project, env: opts.env, contextHash: opts.contextHash };

    if (!this.config.persistAcrossContext && prev.contextHash !== this.scope.contextHash) {
      // drop old-scope overrides from memory (and leave persisted ones under old namespace)
      Array.from(this.overrideStore.keys())
        .filter((k) => k.startsWith(this.scopePrefix(prev)))
        .forEach((k) => this.overrideStore.delete(k));
    }

    // load overrides for new scope from storage
    this.loadPersistedOverrides();

    // notify UI with a fresh merged view
    this.emitInitial();
  }

  /** ====================== internal helpers ====================== */

  // Initialize scope by detecting from existing storage first
  private initializeScope(): void {
    if (this.scope.project === 'unknown' && this.scope.env === 'unknown') {
      const detectedScope = this.detectScopeFromStorage();
      if (detectedScope) {
        this.scope = detectedScope;
      } else {
        this.scope = { project: 'default', env: 'default', contextHash: 'default' };
      }
    }
  }

  private detectScopeFromStorage(): Scope | null {
    const storage = this.storage();
    if (!storage) return null;

    // Look for any stored key with our namespace
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(`${this.config.storageNamespace}:`)) {
        // Parse key format: ld-toolbar:project:env:contextHash/flagKey
        const match = key.match(/^[^:]+:([^:]+):([^:]+):([^/]+)/);
        if (match) {
          const [, project, env, contextHash] = match;
          console.log(`ToolbarPlugin: Found existing storage key: ${key}, parsed scope:`, {
            project,
            env,
            contextHash,
          });
          return { project, env, contextHash };
        }
      }
    }
    return null;
  }

  private handleSdkChange(changes: Record<string, { current: unknown; previous: unknown }>) {
    for (const [key, { current }] of Object.entries(changes)) {
      const k = this.keyFor(flagKey(key));
      const hasOverride = this.overrideStore.has(k);

      // keep base snapshot up to date when there's no override
      if (!hasOverride) this.baseFlags[flagKey(key)] = current;

      this.emitChange({
        key: flagKey(key),
        value: hasOverride ? this.overrideStore.get(k) : current,
        source: hasOverride ? 'override' : 'sdk',
      });
    }
  }

  private emitChange(e: ChangeEvent) {
    this.listeners.forEach((cb) => {
      try {
        cb(e);
      } catch {
        /* swallow to avoid breaking others */
      }
    });
  }

  private emitInitial() {
    const merged = { ...this.baseFlags, ...this.currentOverridesForScope() };
    Object.entries(merged).forEach(([key, value]) => {
      const k = this.keyFor(flagKey(key));
      const source: ChangeEvent['source'] = this.overrideStore.has(k) ? 'override' : 'sdk';
      this.emitChange({ key, value, source });
    });
  }

  private readAllFlags(client: LDClient): Record<string, unknown> {
    return client?.allFlags?.() ?? {};
  }

  private storage(): Storage | null {
    if (typeof window === 'undefined') return null;
    return this.config.persistAcrossTabs ? window.localStorage : window.sessionStorage;
  }

  private keyFor(flagKeyOnly: string): string {
    return `${this.scopePrefix()}/${flagKeyOnly}`;
  }

  private scopePrefix(s: Scope = this.scope): string {
    const { project, env, contextHash } = s;
    return `${this.config.storageNamespace}:${project}:${env}:${contextHash}`;
  }

  private currentOverridesForScope(): Record<string, unknown> {
    const prefix = this.scopePrefix();
    const out: Record<string, unknown> = {};
    for (const [k, v] of Array.from(this.overrideStore.entries())) {
      if (k.startsWith(prefix)) {
        const keyOnly = k.slice(prefix.length + 1); // remove prefix + '/'
        out[keyOnly] = v;
      }
    }
    return out;
  }

  private persistOverride(scopedKey: string, value: unknown) {
    const s = this.storage();
    if (!s) return;
    try {
      s.setItem(scopedKey, JSON.stringify(value));
    } catch {
      console.error('Failed to persist override', scopedKey, value);
    }
  }

  private unpersistOverride(scopedKey: string) {
    const s = this.storage();
    if (!s) return;
    try {
      s.removeItem(scopedKey);
    } catch {
      console.error('Failed to unpersist override', scopedKey);
    }
  }

  private loadPersistedOverrides() {
    const s = this.storage();
    if (!s) return;
    const prefix = this.scopePrefix();
    // scan storage keyspace (small; dev-only)
    for (let i = 0; i < s.length; i++) {
      const key = s.key(i)!;
      if (key && key.startsWith(prefix + '/')) {
        try {
          const parsed = JSON.parse(s.getItem(key)!);
          this.overrideStore.set(key, parsed);
        } catch {
          // ignore corrupt entries
        }
      }
    }
  }

  /** Nice-to-have metadata (optional) */
  getMetadata() {
    return {
      name: 'ToolbarPlugin',
      description: 'Local, session-scoped overrides for LaunchDarkly flags (dev toolbar).',
      version: '1.0.0',
    };
  }
}

/** Small helper to normalize keys if you ever allow aliases */
function flagKey(k: string): string {
  return k;
}
