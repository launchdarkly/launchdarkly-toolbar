import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InitializationConfig } from '../types';

const TOOLBAR_DOM_ID = 'ld-toolbar';

export default function mount(rootNode: HTMLElement, config: InitializationConfig) {
  const cleanup: (() => void)[] = [];

  // Make sure host applications don't mount the toolbar multiple
  if (document.getElementById(TOOLBAR_DOM_ID) != null) {
    return () => {
      cleanup.forEach((fn) => fn());
    };
  }

  const { host, reactMount, observer, cleanupSnapshot } = buildDom();

  const reactRoot = createRoot(reactMount);

  // Dynamically import toolbar to capture style injection timing
  import('./ui/Toolbar/LaunchDarklyToolbar')
    .then((module) => {
      const { LaunchDarklyToolbar } = module;
      reactRoot.render(
        <StrictMode>
          <LaunchDarklyToolbar
            domId={TOOLBAR_DOM_ID}
            baseUrl={config.baseUrl}
            devServerUrl={config.devServerUrl}
            projectKey={config.projectKey}
            flagOverridePlugin={config.flagOverridePlugin}
            eventInterceptionPlugin={config.eventInterceptionPlugin}
            pollIntervalInMs={config.pollIntervalInMs}
            position={config.position}
          />
        </StrictMode>,
      );
      // Disconnect observer after toolbar is loaded to prevent unnecessary monitoring
      observer.disconnect();
      // Clean up snapshot to free memory
      cleanupSnapshot();
    })
    .catch((error) => {
      console.error('[LaunchDarkly Toolbar] Failed to load toolbar:', error);
      observer.disconnect();
      // Clean up snapshot even on error
      cleanupSnapshot();
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
  let existingStylesSnapshot: Set<string> | null = new Set();
  if (document.head) {
    const headStyles = document.head.querySelectorAll('style');
    existingStylesSnapshot = new Set(Array.from(headStyles).map((el) => el.textContent || ''));
  }

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

  // Cleanup function to free memory
  const cleanupSnapshot = () => {
    if (existingStylesSnapshot) {
      existingStylesSnapshot.clear();
      existingStylesSnapshot = null;
    }
  };

  // Watch for NEW styles injected by the toolbar and redirect them to shadow root
  // This prevents toolbar's LaunchPad styles from overriding host app custom styles
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'STYLE') {
          const styleEl = node as HTMLStyleElement;
          const content = styleEl.textContent || '';

          // Check if this is a NEW LaunchPad/toolbar style (not from host app)
          const isNewStyle = existingStylesSnapshot ? !existingStylesSnapshot.has(content) : true;
          const isToolbarStyle = content.includes('--lp-') || content.includes('_');
          const isNewToolbarStyle = isNewStyle && isToolbarStyle;

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

  return { host, reactMount, observer, cleanupSnapshot };
}
