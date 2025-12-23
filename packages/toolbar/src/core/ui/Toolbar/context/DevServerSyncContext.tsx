import { createContext, useContext, useState, useCallback } from 'react';
import type { LDContext } from 'launchdarkly-js-client-sdk';

interface DevServerSyncContextValue {
  onContextChange: ((context: LDContext) => Promise<void>) | null;
  setOnContextChange: (callback: ((context: LDContext) => Promise<void>) | null) => void;
  onDevServerContextChange: ((context: LDContext) => Promise<void>) | null;
  setOnDevServerContextChange: (callback: ((context: LDContext) => Promise<void>) | null) => void;
}

const DevServerSyncContext = createContext<DevServerSyncContextValue | null>(null);

export function DevServerSyncProvider({ children }: { children: React.ReactNode }) {
  const [onContextChange, setOnContextChangeState] = useState<((context: LDContext) => Promise<void>) | null>(null);
  const [onDevServerContextChange, setOnDevServerContextChangeState] = useState<
    ((context: LDContext) => Promise<void>) | null
  >(null);

  const setOnContextChange = useCallback((cb: ((context: LDContext) => Promise<void>) | null) => {
    // When storing a function in state, we need to wrap it to prevent React
    // from treating it as a functional updater
    if (cb === null) {
      setOnContextChangeState(null);
    } else {
      setOnContextChangeState(() => cb);
    }
  }, []);

  const setOnDevServerContextChange = useCallback((cb: ((context: LDContext) => Promise<void>) | null) => {
    // When storing a function in state, we need to wrap it to prevent React
    // from treating it as a functional updater
    if (cb === null) {
      setOnDevServerContextChangeState(null);
    } else {
      setOnDevServerContextChangeState(() => cb);
    }
  }, []);

  return (
    <DevServerSyncContext.Provider
      value={{
        onContextChange,
        setOnContextChange,
        onDevServerContextChange,
        setOnDevServerContextChange,
      }}
    >
      {children}
    </DevServerSyncContext.Provider>
  );
}

export function useDevServerSync() {
  const context = useContext(DevServerSyncContext);
  if (!context) {
    throw new Error('useDevServerSync must be used within DevServerSyncProvider');
  }
  return context;
}
