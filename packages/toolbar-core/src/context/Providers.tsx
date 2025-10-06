import { ReactNode } from "react";
import ReactMountContext from "./ReactMountContext";

interface Props {
  children: ReactNode;
  portalMount: HTMLElement;
  reactMount: HTMLElement;
  shadowRoot: ShadowRoot;
}

export default function Providers(props: Props) {
  const { children, reactMount } = props;

  return (
    <ReactMountContext.Provider value={reactMount}>
      {children}
    </ReactMountContext.Provider>
  )
}