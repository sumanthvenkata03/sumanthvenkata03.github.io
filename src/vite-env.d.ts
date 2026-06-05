/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Formspree form id — when set, the contact form POSTs to Formspree instead of opening mailto. */
  readonly VITE_FORMSPREE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
