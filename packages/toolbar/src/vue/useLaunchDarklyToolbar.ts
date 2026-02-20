import { onMounted, onUnmounted, ref } from 'vue';

import lazyLoadToolbar from '../react/lazyLoadToolbar';
import type { InitializationConfig } from '../types';
import packageJson from '../../package.json';

interface UseLaunchDarklyToolbarConfig extends InitializationConfig {
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

export default function useLaunchDarklyToolbar(args: UseLaunchDarklyToolbarConfig) {
  const { toolbarBundleUrl, enabled, ...initConfig } = args;
  const configRef = ref<InitializationConfig | null>(null);
  const cleanupRef = ref<(() => void) | null>(null);
  const controllerRef = ref<AbortController | null>(null);
  const url = toolbarBundleUrl ?? versionToCdn(packageJson.version);

  onMounted(() => {
    if (enabled === false) {
      return;
    }

    if (configRef.value === null || initConfig == null) {
      configRef.value = initConfig;
    }

    const controller = new AbortController();
    controllerRef.value = controller;

    let cleanup: () => void = () => {};
    lazyLoadToolbar(controller.signal, url)
      .then((importedToolbar) => {
        if (configRef.value === null) {
          return;
        }

        cleanup = importedToolbar.init(configRef.value);
        cleanupRef.value = cleanup;
      })
      .catch((error) => {
        console.error('[LaunchDarkly Toolbar] Failed to initialize:', error);
      });
  });

  onUnmounted(() => {
    if (controllerRef.value) {
      controllerRef.value.abort();
    }
    if (cleanupRef.value) {
      cleanupRef.value();
    }
  });
}

function versionToCdn(version = 'latest'): string {
  return `https://unpkg.com/@launchdarkly/toolbar@${version}/cdn/toolbar.min.js`;
}
