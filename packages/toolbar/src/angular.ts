/**
 * Angular-specific exports for the LaunchDarkly Toolbar
 *
 * This entry point provides an Angular service for integrating
 * the toolbar with Angular applications (14+).
 *
 * @example
 * ```typescript
 * // Standalone Component (Angular 14+)
 * import { Component, OnInit } from '@angular/core';
 * import { LaunchDarklyToolbarService } from '@launchdarkly/toolbar/angular';
 * import { FlagOverridePlugin, EventInterceptionPlugin } from '@launchdarkly/toolbar/plugins';
 *
 * @Component({
 *   selector: 'app-root',
 *   standalone: true,
 *   providers: [LaunchDarklyToolbarService],
 *   template: '<router-outlet />'
 * })
 * export class AppComponent implements OnInit {
 *   private flagOverridePlugin = new FlagOverridePlugin();
 *   private eventInterceptionPlugin = new EventInterceptionPlugin();
 *
 *   constructor(private toolbarService: LaunchDarklyToolbarService) {}
 *
 *   ngOnInit() {
 *     this.toolbarService.initialize({
 *       flagOverridePlugin: this.flagOverridePlugin,
 *       eventInterceptionPlugin: this.eventInterceptionPlugin,
 *       enabled: true,
 *       position: 'bottom-right'
 *     });
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Module-based Component (Traditional)
 * import { NgModule } from '@angular/core';
 * import { LaunchDarklyToolbarService } from '@launchdarkly/toolbar/angular';
 *
 * @NgModule({
 *   providers: [LaunchDarklyToolbarService],
 *   // ... other module config
 * })
 * export class AppModule {}
 * ```
 */

export { default as LaunchDarklyToolbarService } from './angular/launchdarkly-toolbar.service';
export type { LaunchDarklyToolbarConfig } from './angular/launchdarkly-toolbar.service';
