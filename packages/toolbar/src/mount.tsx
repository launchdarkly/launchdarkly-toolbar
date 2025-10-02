import { StrictMode } from "react";
import { LaunchDarklyToolbar, LaunchDarklyToolbarProps } from "./ui/Toolbar/LaunchDarklyToolbar";
import { createRoot } from 'react-dom/client'
import './globals.css';

function mount(rootNode: HTMLElement, config: LaunchDarklyToolbarProps) {
  const cleanup: (() => void)[] = [];
  const {host, reactMount} = buildDom();

  const reactRoot = createRoot(reactMount);
  reactRoot.render(
    <StrictMode>
      <LaunchDarklyToolbar {...config} />
    </StrictMode>
  );
  cleanup.push(() =>
    setTimeout(() => reactRoot.unmount(), 0)
  );

  rootNode.appendChild(host);
  cleanup.push(() => host.remove());

  return () => {
    cleanup.forEach(fn => fn());
  };
}

function buildDom() {
  const DOCUMENT = document;

  const host = DOCUMENT.createElement('div');
  host.id = 'ld-toolbar-id';
  host.style.inset = '0';
  host.style.pointerEvents = 'none';
  host.style.position = 'absolute';
  host.style.zIndex = String(Number.MAX_SAFE_INTEGER);

  const shadowRoot = host.attachShadow({mode: 'open'});

  const style = DOCUMENT.createElement('style');
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

export default mount;