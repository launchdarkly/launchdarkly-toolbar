/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TOOLBAR_INTERNAL_CLIENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
