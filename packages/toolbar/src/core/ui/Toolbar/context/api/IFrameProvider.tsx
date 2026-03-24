import { createContext, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export const IFRAME_COMMANDS = {
  LOGOUT: 'logout',
  GET_PROJECTS: 'get-projects',
  GET_FLAGS: 'get-flags',
  GET_FLAG: 'get-flag',
};

export const getResponseTopic = (command: string) => `${command}-response`;
export const getErrorTopic = (command: string) => `${command}-error`;

export const IFRAME_EVENTS = {
  AUTHENTICATED: 'toolbar-authenticated',
  AUTH_REQUIRED: 'toolbar-authentication-required',
  AUTH_ERROR: 'toolbar-authentication-error',
  API_READY: 'api-ready',
};

export const MAX_IFRAME_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 1000;
export const IFRAME_READY_TIMEOUT_MS = 10_000;

interface IFrameProviderProps {
  children: React.ReactNode;
  authUrl: string;
}

type IFrameProviderType = {
  ref: RefObject<HTMLIFrameElement | null>;
  iframeSrc: string;
  iframeKey: number;
  iframeErrorCount: number;
  hasExhaustedRetries: boolean;
  onIFrameError: () => void;
  signalIFrameReady: () => void;
};

const IFrameContext = createContext<IFrameProviderType | null>(null);

export function IFrameProvider({ children, authUrl }: IFrameProviderProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);
  const iframeSrc = useMemo(() => authUrl, [authUrl]);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeErrorCount, setIframeErrorCount] = useState(0);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const iframeReadyRef = useRef(false);

  const hasExhaustedRetries = iframeErrorCount >= MAX_IFRAME_RETRIES;

  const onIFrameError = useCallback(() => {
    if (readyTimeoutRef.current) {
      clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }

    setIframeErrorCount((prev) => {
      const nextCount = prev + 1;

      if (nextCount >= MAX_IFRAME_RETRIES) {
        console.error(
          `[LaunchDarkly Toolbar] Auth iframe failed to load after ${MAX_IFRAME_RETRIES} attempts. Giving up.`,
        );
        return nextCount;
      }

      const delay = BASE_RETRY_DELAY_MS * Math.pow(2, prev);
      console.warn(
        `[LaunchDarkly Toolbar] Auth iframe failed to load (attempt ${nextCount}/${MAX_IFRAME_RETRIES}), retrying in ${delay}ms...`,
      );

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      retryTimeoutRef.current = setTimeout(() => {
        setIframeKey((k) => k + 1);
      }, delay);

      return nextCount;
    });
  }, []);

  const signalIFrameReady = useCallback(() => {
    iframeReadyRef.current = true;
    if (readyTimeoutRef.current) {
      clearTimeout(readyTimeoutRef.current);
      readyTimeoutRef.current = null;
    }
  }, []);

  // Start a communication timeout each time a new iframe attempt is mounted.
  // If we don't receive any postMessage from the iframe within the timeout window,
  // the iframe's internal page likely failed (e.g. auth server errors) even though
  // the <iframe> element itself loaded successfully.
  useEffect(() => {
    if (hasExhaustedRetries) {
      return;
    }

    iframeReadyRef.current = false;

    readyTimeoutRef.current = setTimeout(() => {
      if (!iframeReadyRef.current) {
        console.warn(
          `[LaunchDarkly Toolbar] Auth iframe did not respond within ${IFRAME_READY_TIMEOUT_MS / 1000}s, treating as error.`,
        );
        onIFrameError();
      }
    }, IFRAME_READY_TIMEOUT_MS);

    return () => {
      if (readyTimeoutRef.current) {
        clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = null;
      }
    };
  }, [iframeKey, hasExhaustedRetries, onIFrameError]);

  return (
    <IFrameContext.Provider
      value={{ ref, iframeSrc, iframeKey, iframeErrorCount, hasExhaustedRetries, onIFrameError, signalIFrameReady }}
    >
      {children}
    </IFrameContext.Provider>
  );
}

export function useIFrameContext() {
  const context = useContext(IFrameContext);
  if (!context) {
    throw new Error('useIFrameContext must be used within an IFrameProvider');
  }
  return context;
}
