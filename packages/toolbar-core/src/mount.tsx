import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InitializationConfig } from '@launchdarkly/toolbar-types'
import Providers from './context/Providers';
import { LaunchDarklyToolbar } from './ui/Toolbar/LaunchDarklyToolbar';
import styles from './globals.css?inline';

export default function mount(rootNode: HTMLElement, config: InitializationConfig) {
  const cleanup: (() => void)[] = [];
  const {host, reactMount, portalMount, shadowRoot} = buildDom(config);

  const reactRoot = createRoot(reactMount);
  console.log(config);
  reactRoot.render(
    <StrictMode>
      <Providers portalMount={portalMount} reactMount={reactMount} shadowRoot={shadowRoot}>
        <LaunchDarklyToolbar
          baseUrl={config.baseUrl}
          devServerUrl={config.devServerUrl}
          projectKey={config.projectKey}
          flagOverridePlugin={config.flagOverridePlugin}
          eventInterceptionPlugin={config.eventInterceptionPlugin}
          pollIntervalInMs={config.pollIntervalInMs}
          position={config.position}
        />
      </Providers>
    </StrictMode>
  );
  cleanup.push(() =>
    // `setTimeout` helps to avoid "Attempted to synchronously unmount a root while React was already rendering."
    setTimeout(() => reactRoot.unmount(), 0)
  );

  rootNode.appendChild(host);
  cleanup.push(() => host.remove());

  return () => {
    cleanup.forEach(fn => fn());
  };
}

function buildDom(config: InitializationConfig) {
  const DOCUMENT = document;

  const host = DOCUMENT.createElement('div');
  host.id = config.domId ?? 'ld-toolbar';
  host.style.inset = '0';
  host.style.pointerEvents = 'none';
  host.style.position = 'absolute';
  // Typescript assumes all css style values are string, z-index should be a
  // CSS `<integer>` type. However the max int value is implementation-defined
  // See: https://drafts.csswg.org/css-values/#numeric-types
  host.style.zIndex = String(Number.MAX_SAFE_INTEGER);

  const shadowRoot = host.attachShadow({mode: 'open'});

  const style = DOCUMENT.createElement('style');
  style.innerHTML = styles;
  shadowRoot.appendChild(style);

  const reactMount = DOCUMENT.createElement('div');
  reactMount.dataset.name = 'react-mount';
  shadowRoot.appendChild(reactMount);

  const portalMount = DOCUMENT.createElement('div');
  portalMount.dataset.name = 'portal-mount';
  // We can use tailwind classes because tailwind will read all `src/**/*/.tsx` files
  portalMount.className = 'relative z-portal pointer-events-auto';
  shadowRoot.appendChild(portalMount);

  return {host, reactMount, portalMount, shadowRoot};
}
