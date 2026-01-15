/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TOOLBAR_INTERNAL_CLIENT_ID?: string;
  readonly TOOLBAR_INTERNAL_BASE_URL?: string;
  readonly TOOLBAR_INTERNAL_STREAM_URL?: string;
  readonly TOOLBAR_INTERNAL_EVENTS_URL?: string;
  readonly TOOLBAR_INTERNAL_BACKEND_URL?: string;
  readonly TOOLBAR_INTERNAL_OBSERVABILITY_OTLP_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
