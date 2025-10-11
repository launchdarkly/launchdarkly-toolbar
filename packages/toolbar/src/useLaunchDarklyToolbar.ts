import { useEffect, useRef } from 'react';

import lazyLoadToolbar from './lazyLoadToolbar';
import type { InitializationConfig } from '@launchdarkly/toolbar-types';
import packageJson from '../package.json';

interface UseLaunchDarklyToolbarConfig extends InitializationConfig {
  /**
   * URL to load the toolbar bundle from.
   * Use this when developing the toolbar itself locally.
   *
   * Example: `'http://localhost:8080/toolbar.min.js'`
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
  const configRef = useRef<InitializationConfig | null>(null);
  const url = toolbarBundleUrl ?? versionToCdn(packageJson.version);

  useEffect(() => {
    if (enabled === false) {
      return;
    }

    if (configRef.current === null) {
      configRef.current = initConfig;
    }
  }, [enabled, initConfig]);

  useEffect(() => {
    if (enabled === false || configRef.current === null) {
      return;
    }

    const controller = new AbortController();

    let cleanup: () => void = () => {};
    lazyLoadToolbar(controller.signal, url).then((importedToolbar) => {
      if (configRef.current === null) {
        return;
      }

      cleanup = importedToolbar.init(configRef.current);
    });

    return () => {
      controller.abort();
      cleanup();
    };
  }, [enabled, url]);
}

function versionToCdn(_version = 'latest'): string {
  throw new Error('Add CDN url when we know what it is!');
}
