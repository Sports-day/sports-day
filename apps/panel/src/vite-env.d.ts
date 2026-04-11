/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_OIDC_AUTHORIZE_URL: string
  readonly VITE_OIDC_CLIENT_ID: string
  readonly VITE_OIDC_REDIRECT_URL: string
  readonly VITE_OIDC_SCOPE: string
  readonly VITE_OIDC_DISPLAY_NAME: string
  readonly VITE_GA_ID: string
  readonly VITE_BASE_PATH: string
  readonly VITE_GRAPHQL_ENDPOINT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
