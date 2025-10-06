import { InitializationConfig } from "@launchdarkly/toolbar-types";
import { ReactNode } from "react";
import ShadowRootContext from "./ShadowRootContext";
import ReactMountContext from "./ReactMountContext";
import PortalTargetContext from "./PortalTargetContext";
import { LaunchDarklyToolbar } from "../ui/Toolbar/LaunchDarklyToolbar";

interface Props {
  children: ReactNode;
  portalMount: HTMLElement;
  reactMount: HTMLElement;
  shadowRoot: ShadowRoot;
}

export default function Providers(props: Props) {
  const { children, portalMount, reactMount, shadowRoot } = props;

  return (
    <ShadowRootContext.Provider value={shadowRoot}>
      <ReactMountContext.Provider value={reactMount}>
        <PortalTargetContext.Provider value={portalMount}>
          {children}
        </PortalTargetContext.Provider>
      </ReactMountContext.Provider>
    </ShadowRootContext.Provider>
  )
}