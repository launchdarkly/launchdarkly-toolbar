import { ReactNode } from "react";
import ReactMountContext from "./ReactMountContext";
import ShadowRootContext from "./ShadowRootContext";

interface Props {
  children: ReactNode;
  portalMount: HTMLElement;
  reactMount: HTMLElement;
  shadowRoot: ShadowRoot;
}

export default function Providers(props: Props) {
  const { children, reactMount, shadowRoot } = props;

  return (
    <ShadowRootContext value={shadowRoot}>
      <ReactMountContext.Provider value={reactMount}>
        {children}
      </ReactMountContext.Provider>
    </ShadowRootContext>
  )
}