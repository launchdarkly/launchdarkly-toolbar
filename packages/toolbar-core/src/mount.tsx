import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InitializationConfig } from '@launchdarkly/toolbar-types'
import Providers from './context/Providers';
import { LaunchDarklyToolbar } from './ui/Toolbar/LaunchDarklyToolbar';
import styles from '../dist/style.css?inline';
import globalStyles from './globals.css?inline';

export default function mount(rootNode: HTMLElement, config: InitializationConfig) {
  const cleanup: (() => void)[] = [];
  const { host, reactMount } = buildDom(config);

  const reactRoot = createRoot(reactMount);
  console.log(config);
  reactRoot.render(
    <StrictMode>
      <LaunchDarklyToolbar
        baseUrl={config.baseUrl}
        devServerUrl={config.devServerUrl}
        projectKey={config.projectKey}
        flagOverridePlugin={config.flagOverridePlugin}
        eventInterceptionPlugin={config.eventInterceptionPlugin}
        pollIntervalInMs={config.pollIntervalInMs}
        position={config.position}
      />
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
  host.style.position = 'absolute';
  host.style.zIndex = String(Number.MAX_SAFE_INTEGER);

  const shadowRoot = host.attachShadow({mode: 'closed', delegatesFocus: true, slotAssignment: 'named'});
  shadowRoot.addEventListener('click', (event) => {
    console.log('Clicked inside the Shadow DOM!');
  });

  const style = DOCUMENT.createElement('style');
  style.innerHTML = globalStyles + styles;
  shadowRoot.appendChild(style);

  const reactMount = DOCUMENT.createElement('div');
  reactMount.dataset.name = 'react-mount';
  shadowRoot.appendChild(reactMount);

  return { host, reactMount };
}
