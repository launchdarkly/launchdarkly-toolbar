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

  // Make sure host applications don't mount the toolbar multiple times
  if (document.getElementById(TOOLBAR_DOM_ID) != null) {
    return () => {
      cleanup.forEach((fn) => fn());
    };
  }

  const { host, reactMount, cleanupInterceptor } = buildDom();
  cleanup.push(cleanupInterceptor);

  const reactRoot = createRoot(reactMount);

  // Dynamically import toolbar to capture style injection timing
  // The style interceptor set up in buildDom() will redirect any injected styles
  import('./ui/Toolbar/LaunchDarklyToolbar').then((module) => {
    const { LaunchDarklyToolbar } = module;
    import('./context/ReactMountContext').then((contextModule) => {
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

  // Inject any existing LaunchPad styles that the toolbar might need
  // (e.g., if the host app also uses LaunchPad and has already loaded tokens)
  injectExistingLaunchPadStyles(shadowRoot);

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

  return { host, reactMount, cleanupInterceptor };
}

/**
 * Copies existing LaunchPad styles from document.head to the Shadow DOM.
 * This handles cases where the host app uses LaunchPad and has already loaded
 * design tokens that the toolbar components depend on.
 */
function injectExistingLaunchPadStyles(shadowRoot: ShadowRoot): void {
  if (!document.head) return;

  const existingStyles = Array.from(document.head.querySelectorAll('style'))
    .filter((styleEl) => {
      const content = styleEl.textContent || '';
      // Only copy LaunchPad token styles (CSS custom properties)
      // Don't copy component styles that might conflict
      return content.includes('--lp-') && !content.includes('ldtb_');
    })
    .map((styleEl) => styleEl.textContent || '')
    .join('\n');

  if (existingStyles) {
    injectStylesIntoShadowRoot(shadowRoot, existingStyles);
  }
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

          // Check if this is a toolbar style that slipped through
          if (isToolbarStyleContent(content)) {
            // Cache for HMR support
            cacheToolbarStyle(content);

            // Move to shadow root
            injectStylesIntoShadowRoot(shadowRoot, content);

            // Remove from document.head
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
