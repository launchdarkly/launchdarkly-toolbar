import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InitializationConfig } from '../types';
import { LaunchDarklyToolbar } from './ui/Toolbar/LaunchDarklyToolbar';

const TOOLBAR_DOM_ID = 'ld-toolbar';

export default function mount(rootNode: HTMLElement, config: InitializationConfig) {
  const cleanup: (() => void)[] = [];

  // Make sure host applications don't mount the toolbar multiple
  if (document.getElementById(TOOLBAR_DOM_ID) != null) {
    return () => {
      cleanup.forEach((fn) => fn());
    };
  }

  const { host, reactMount } = buildDom();

  const reactRoot = createRoot(reactMount);
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
  cleanup.push(() =>
    // `setTimeout` helps to avoid "Attempted to synchronously unmount a root while React was already rendering."
    setTimeout(() => reactRoot.unmount(), 0),
  );

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

  // rslib injects styles into <style> tags in the document head.
  // For shadow DOM compatibility, we need to copy these styles into the shadow root.
  const style = document.createElement('style');
  const reactMount = document.createElement('div');

  // Collect all toolbar-related styles from injected <style> elements
  const toolbarStyles = Array.from(document.head.querySelectorAll('style'))
    .filter((styleEl) => styleEl.textContent?.includes('--lp-') || styleEl.textContent?.includes('_'))
    .map((styleEl) => styleEl.textContent || '')
    .join('\n');

  if (toolbarStyles) {
    style.textContent = toolbarStyles;
    shadowRoot.appendChild(style);
  }

  reactMount.dataset.name = 'react-mount';
  reactMount.id = 'ld-toolbar-react-mount';
  shadowRoot.appendChild(reactMount);

  return { host, reactMount };
}
