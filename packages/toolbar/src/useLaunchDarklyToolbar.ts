import { useEffect, useRef, useState } from 'react';

import lazyLoadToolbar from './lazyLoadToolbar';
import type { LaunchDarklyToolbar } from './types';

type InitArgs = Parameters<LaunchDarklyToolbar['init']>[0];

type InitProps = InitArgs | ((toolbar: LaunchDarklyToolbar) => InitArgs);
type Args =
  | {
      cdn?: never;
      enabled?: boolean | undefined;
      initProps: InitProps;
      version: string;
    }
  | {
      cdn: string;
      enabled?: boolean | undefined;
      initProps: InitProps;
      version?: never;
    }
  | {
      cdn?: never;
      enabled?: boolean | undefined;
      initProps: InitProps;
      version?: never;
    };

export default function useLaunchDarklyToolbar({ cdn, enabled, initProps, version }: Args) {
  const [initialized, setInitialized] = useState(false);
  const initPropsRef = useRef<null | InitProps>(null);
  const url = cdn ?? versionToCdn(version);

  useEffect(() => {
    if (enabled === false || initialized === true) {
      return;
    }

    if (initPropsRef.current === null) {
      initPropsRef.current = initProps;
    }
  }, [enabled, initProps]);

  useEffect(() => {
    if (enabled === false || initPropsRef.current === null || initialized === true) {
      return;
    }

    const controller = new AbortController();

    let cleanup: () => void = () => {};
    lazyLoadToolbar(controller.signal, url).then((importedToolbar) => {
      if (initPropsRef.current === null) {
        return;
      }

      cleanup = importedToolbar.init(
        typeof initPropsRef.current === 'function' ? initPropsRef.current(importedToolbar) : initPropsRef.current,
      );
    });

    setInitialized(true);

    return () => {
      controller.abort();
      cleanup();
    };
  }, [enabled, url]);
}

function versionToCdn(version = 'latest'): string {
  throw new Error('Add CDN url when we know what it is!');
}
