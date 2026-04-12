/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_ENDPOINT: string
  readonly VITE_AUTHORITY: string
  readonly VITE_CLIENT_ID: string
  readonly VITE_CLIENT_SECRET: string
  readonly VITE_REDIRECT_URI: string
  readonly VITE_SILENT_REDIRECT_URI: string
  readonly VITE_SCOPE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
