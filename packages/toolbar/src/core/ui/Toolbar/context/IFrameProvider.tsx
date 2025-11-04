import { createContext, RefObject, useContext, useRef } from "react";

type IFrameProviderType = {
  ref: RefObject<HTMLIFrameElement | null>;
}

const IFrameContext = createContext<IFrameProviderType | null>(null);

export function IFrameProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLIFrameElement | null>(null);

  return <IFrameContext.Provider value={{ ref }}>{children}</IFrameContext.Provider>;
}

export function useIFrameContext() {
  const context = useContext(IFrameContext);
  if (!context) {
    throw new Error('useIFrameContext must be used within an IFrameProvider');
  }
  return context;
}