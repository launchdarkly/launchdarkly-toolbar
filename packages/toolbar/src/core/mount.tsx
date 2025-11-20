import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InitializationConfig } from '../types';
import { TOOLBAR_DOM_ID } from '../types/constants';

export default function mount(rootNode: HTMLElement, config: InitializationConfig) {
  const cleanup: (() => void)[] = [];

  // Make sure host applications don't mount the toolbar multiple
  if (document.getElementById(TOOLBAR_DOM_ID) != null) {
    return () => {
      cleanup.forEach((fn) => fn());
    };
  }

  const { host, reactMount, observer } = buildDom();

  const reactRoot = createRoot(reactMount);

  // Dynamically import toolbar to capture style injection timing
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
            />
          </ReactMountContext.Provider>
        </StrictMode>,
      );
    });
  });

  cleanup.push(() => {
    observer.disconnect();
    // `setTimeout` helps to avoid "Attempted to synchronously unmount a root while React was already rendering."
    setTimeout(() => reactRoot.unmount(), 0);
  });

  rootNode.appendChild(host);
  cleanup.push(() => host.remove());

  return () => {
    cleanup.forEach((fn) => fn());
  };
}

function buildDom() {
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

  const reactMount = document.createElement('div');

  // Snapshot existing styles BEFORE the toolbar component loads
  const existingStylesSnapshot = document.head
    ? new Set(Array.from(document.head.querySelectorAll('style')).map((el) => el.textContent || ''))
    : new Set();

  // Copy existing LaunchPad styles (including Gonfalon's) to shadow root
  // so toolbar has the base styles it needs
  if (document.head) {
    const existingStyles = Array.from(document.head.querySelectorAll('style'))
      .filter((styleEl) => styleEl.textContent?.includes('--lp-') || styleEl.textContent?.includes('_'))
      .map((styleEl) => styleEl.textContent || '')
      .join('\n');

    if (existingStyles) {
      const style = document.createElement('style');
      style.textContent = existingStyles;
      shadowRoot.appendChild(style);
    }
  }

  reactMount.dataset.name = 'react-mount';
  reactMount.id = 'ld-toolbar-react-mount';
  shadowRoot.appendChild(reactMount);

  // Watch for NEW styles injected by the toolbar and redirect them to shadow root
  // This prevents toolbar's LaunchPad styles from overriding host app custom styles
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'STYLE') {
          const styleEl = node as HTMLStyleElement;
          const content = styleEl.textContent || '';

          // Check if this is a NEW LaunchPad/toolbar style (not from host app)
          const isNewToolbarStyle =
            !existingStylesSnapshot.has(content) && (content.includes('--lp-') || content.includes('_'));

          if (isNewToolbarStyle) {
            // Copy to shadow root so toolbar still works
            const shadowStyleEl = document.createElement('style');
            shadowStyleEl.textContent = content;
            shadowRoot.insertBefore(shadowStyleEl, reactMount);

            // Remove from document.head to prevent overriding host app styles
            // We can remove immediately since we've already copied to shadow root
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

  // Only observe document.head if it exists
  if (document.head) {
    observer.observe(document.head, { childList: true });
  }

  // Stop observing after 500ms (toolbar should be fully loaded by then)
  setTimeout(() => observer.disconnect(), 500);

  return { host, reactMount, observer };
}
