import { Injectable, OnDestroy } from '@angular/core';

import lazyLoadToolbar from '../react/lazyLoadToolbar';
import type { InitializationConfig } from '../types';
import packageJson from '../../package.json';

/**
 * Configuration options for the LaunchDarkly Toolbar service.
 * Extends the base InitializationConfig with Angular-specific options.
 */
export interface LaunchDarklyToolbarConfig extends InitializationConfig {
  /**
   * URL to load the toolbar bundle from.
   * Use this when developing the toolbar itself locally.
   *
   * Example: `'http://localhost:5764/toolbar.min.js'`
   *
   * Default: CDN URL based on package version
   */
  toolbarBundleUrl?: string;

  /**
   * Whether the toolbar should be loaded and displayed.
   *
   * Default: `true`
   */
  enabled?: boolean;
}

/**
 * Injectable service for managing the LaunchDarkly Developer Toolbar in Angular applications.
 *
 * This service handles the lifecycle of the toolbar, including initialization,
 * lazy loading, and cleanup. It can be injected into any Angular component or service.
 *
 * @example
 * ```typescript
 * import { Component, OnInit } from '@angular/core';
 * import { LaunchDarklyToolbarService } from '@launchdarkly/toolbar/angular';
 * import { FlagOverridePlugin } from '@launchdarkly/toolbar/plugins';
 *
 * @Component({
 *   selector: 'app-root',
 *   template: '<router-outlet />'
 * })
 * export class AppComponent implements OnInit {
 *   private flagOverridePlugin = new FlagOverridePlugin();
 *
 *   constructor(private toolbarService: LaunchDarklyToolbarService) {}
 *
 *   ngOnInit() {
 *     this.toolbarService.initialize({
 *       flagOverridePlugin: this.flagOverridePlugin,
 *       enabled: true,
 *       position: 'bottom-right'
 *     });
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root', // Singleton service across the application
})
export default class LaunchDarklyToolbarService implements OnDestroy {
  private cleanup?: () => void;
  private abortController?: AbortController;
  private initialized = false;

  /**
   * Initializes the LaunchDarkly Toolbar with the provided configuration.
   *
   * This method lazy-loads the toolbar bundle from either a custom URL or the CDN,
   * then initializes it with the provided configuration.
   *
   * @param config - Configuration options for the toolbar
   * @returns Promise that resolves when initialization is complete
   *
   * @throws {Error} If initialization fails or toolbar bundle cannot be loaded
   */
  async initialize(config: LaunchDarklyToolbarConfig): Promise<void> {
    if (this.initialized) {
      console.warn('[LaunchDarkly Toolbar] Already initialized. Call destroy() first to reinitialize.');
      return;
    }

    const { toolbarBundleUrl, enabled, ...initConfig } = config;

    if (enabled === false) {
      return;
    }

    this.initialized = true;
    this.abortController = new AbortController();
    const url = toolbarBundleUrl ?? this.versionToCdn(packageJson.version);

    try {
      const toolbar = await lazyLoadToolbar(this.abortController.signal, url);
      this.cleanup = toolbar.init(initConfig);
    } catch (err) {
      console.error('[LaunchDarkly Toolbar] Failed to initialize:', err);
      this.initialized = false;
      throw err;
    }
  }

  /**
   * Angular lifecycle hook called when the service is destroyed.
   * Automatically cleans up the toolbar.
   */
  ngOnDestroy(): void {
    this.destroy();
  }

  /**
   * Manually destroys the toolbar and cleans up resources.
   *
   * This method:
   * - Aborts any pending lazy-load requests
   * - Calls the toolbar's cleanup function
   * - Resets the initialized state
   *
   * After calling destroy(), you can call initialize() again to reinitialize.
   */
  destroy(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = undefined;
    }
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = undefined;
    }
    this.initialized = false;
  }

  /**
   * Checks if the toolbar has been initialized.
   *
   * @returns true if the toolbar is currently initialized, false otherwise
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Generates the CDN URL for a specific toolbar version.
   *
   * @param version - Toolbar version (defaults to 'latest')
   * @returns CDN URL for the toolbar bundle
   */
  private versionToCdn(version = 'latest'): string {
    return `https://unpkg.com/@launchdarkly/toolbar@${version}/cdn/toolbar.min.js`;
  }
}
