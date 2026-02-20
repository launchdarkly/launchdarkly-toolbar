import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InitializationConfig } from '../types';
import { TOOLBAR_DOM_ID } from '../types/constants';
import {
  createStyleInterceptor,
  injectStylesIntoShadowRoot,
  getCachedToolbarStyles,
  cacheToolbarStyle,
  isToolbarStyleContent,
} from './styles';

export default function mount(rootNode: HTMLElement, config: InitializationConfig) {
  const cleanup: (() => void)[] = [];
  let isMounted = true;

  // Make sure host applications don't mount the toolbar multiple times
  if (document.getElementById(TOOLBAR_DOM_ID) != null) {
    return () => {
      cleanup.forEach((fn) => fn());
    };
  }

  const { host, shadowRoot, reactMount, cleanupInterceptor } = buildDom();
  cleanup.push(cleanupInterceptor);

  const reactRoot = createRoot(reactMount);

  // Snapshot styles currently in document.head so we can identify everything the
  // toolbar's import chain adds. The interceptor is active, so styles matching
  // isToolbarStyleContent (ldtb_ prefix) are already redirected. Everything else
  // (LaunchPad tokens, LP component styles) passes through to document.head and
  // we relocate it in a single sweep after all imports resolve.
  const stylesBefore = new Set(document.head ? document.head.querySelectorAll('style') : []);

  // Load globals.css first (tokens must be available before component styles),
  // then toolbar + context in parallel.
  import('./globals.css')
    .then(() => {
      if (!isMounted) return;
      return Promise.all([import('./ui/Toolbar/LaunchDarklyToolbar'), import('./context/ReactMountContext')]);
    })
    .then((modules) => {
      if (!isMounted || !modules) return;

      // Sweep: find all styles added to document.head during the import chain
      // (LaunchPad tokens from globals.css + LP component styles from @launchpad-ui/components)
      const newStyles = document.head
        ? Array.from(document.head.querySelectorAll('style')).filter((s) => !stylesBefore.has(s))
        : [];

      for (const styleEl of newStyles) {
        const content = (styleEl.textContent || '').replace(/:root/g, ':host').replace(/#ld-toolbar/g, ':host');
        injectStylesIntoShadowRoot(shadowRoot, content);
        styleEl.remove();
      }

      const [toolbarModule, contextModule] = modules;
      const { LaunchDarklyToolbar } = toolbarModule;
      const ReactMountContext = contextModule.default;
      reactRoot.render(
        <StrictMode>
          <ReactMountContext.Provider value={reactMount}>
            <LaunchDarklyToolbar
              domId={TOOLBAR_DOM_ID}
              baseUrl={config.baseUrl}
              authUrl={config.authUrl}
              devServerUrl={config.devServerUrl}
              projectKey={config.projectKey}
              flagOverridePlugin={config.flagOverridePlugin}
              eventInterceptionPlugin={config.eventInterceptionPlugin}
              pollIntervalInMs={config.pollIntervalInMs}
              position={config.position}
              clientSideId={config.clientSideId}
            />
          </ReactMountContext.Provider>
        </StrictMode>,
      );
    });

  cleanup.push(() => {
    // `setTimeout` helps to avoid "Attempted to synchronously unmount a root while React was already rendering."
    setTimeout(() => reactRoot.unmount(), 0);
  });

  rootNode.appendChild(host);
  cleanup.push(() => host.remove());

  return () => {
    cleanup.forEach((fn) => fn());
  };
}

interface DomElements {
  host: HTMLDivElement;
  shadowRoot: ShadowRoot;
  reactMount: HTMLDivElement;
  cleanupInterceptor: () => void;
}

function buildDom(): DomElements {
  const host = document.createElement('div');
  host.id = TOOLBAR_DOM_ID;
  host.style.inset = '0';
  host.style.width = '0px';
  host.style.height = '0px';
  host.style.position = 'absolute';
  host.style.zIndex = '2147400100';

  const shadowRoot = host.attachShadow({ mode: 'open' });
  if (!shadowRoot) {
    throw new Error('[LaunchDarkly Toolbar] Failed to create shadow root');
  }

  // Set up synchronous style interception BEFORE any toolbar imports
  // This prevents toolbar styles from ever appearing in document.head
  const cleanupInterceptor = createStyleInterceptor(shadowRoot);

  // Restore cached toolbar styles from previous mounts (HMR support)
  const cachedStyles = getCachedToolbarStyles();
  if (cachedStyles.length > 0) {
    const combinedCached = cachedStyles.join('\n');
    injectStylesIntoShadowRoot(shadowRoot, combinedCached);
  }

  const reactMount = document.createElement('div');
  reactMount.dataset.name = 'react-mount';
  reactMount.id = 'ld-toolbar-react-mount';
  shadowRoot.appendChild(reactMount);

  // Set up a backup MutationObserver for edge cases where interception might miss styles
  // (e.g., styles injected via mechanisms other than appendChild/insertBefore)
  setupBackupObserver(shadowRoot);

  return { host, shadowRoot, reactMount, cleanupInterceptor };
}

/**
 * Sets up a backup MutationObserver to catch any styles that slip through
 * the synchronous interception (edge cases like innerHTML assignment).
 */
function setupBackupObserver(shadowRoot: ShadowRoot): void {
  if (!document.head) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'STYLE') {
          const styleEl = node as HTMLStyleElement;
          const content = styleEl.textContent || '';

          if (isToolbarStyleContent(content)) {
            cacheToolbarStyle(content);
            injectStylesIntoShadowRoot(shadowRoot, content);

            try {
              styleEl.remove();
            } catch (error) {
              console.warn('[LaunchDarkly Toolbar] Failed to remove style element from document.head:', error);
            }
          }
        }
      });
    });
  });

  observer.observe(document.head, { childList: true });

  // Keep observer running for HMR scenarios, but disconnect after a reasonable time
  // to avoid memory leaks in production
  setTimeout(() => observer.disconnect(), 10000);
}
