import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { InitializationConfig } from '@launchdarkly/toolbar-types'
import { LaunchDarklyToolbar } from './ui/Toolbar/LaunchDarklyToolbar';

export default function mount(rootNode: HTMLElement, config: InitializationConfig) {
  const cleanup: (() => void)[] = [];

  // Make sure host applications don't mount the toolbar multiple
  if (document.getElementById(config.domId ?? 'ld-toolbar') != null) {
    return () => {
      cleanup.forEach(fn => fn());
    };
  }

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
  const host = document.createElement('div');
  host.id = config.domId ?? 'ld-toolbar';
  host.style.inset = '0';
  host.style.position = 'absolute';
  host.style.zIndex = '2147400100';

  const shadowRoot = host.attachShadow({ mode: 'open', delegatesFocus: true });
  shadowRoot.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    console.log('Clicked inside the Shadow DOM!');
  });

  // the minified toolbar code, thanks to the 'vite-plugin-css-injected-by-js' vite plugin
  // will inject toolbar styles into the DOM. Sadly, we cannot specify where this should be done
  // but we can give it an identified. This allows us to do a workaround where we grab those styles
  // and place them in the shadow DOM.
  const style = document.createElement('style');
  const loadedStyles = document.getElementById('ld-toolbar-styles');
  const reactMount = document.createElement('div');
  if (loadedStyles) {
    style.innerHTML = loadedStyles.innerHTML;
    shadowRoot.appendChild(style);
  }

  reactMount.dataset.name = 'react-mount';
  reactMount.id = 'ld-toolbar-react-mount'
  reactMount.style.width = '100%';
  reactMount.style.height = '100%';
  shadowRoot.appendChild(reactMount);

  return { host, reactMount };
}
