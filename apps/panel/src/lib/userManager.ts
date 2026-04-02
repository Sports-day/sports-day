import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

export const userManager = new UserManager({
  authority: import.meta.env.VITE_AUTHORITY,
  client_id: import.meta.env.VITE_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  silent_redirect_uri: import.meta.env.VITE_SILENT_REDIRECT_URI,
  response_type: 'code',
  scope: import.meta.env.VITE_SCOPE ?? 'openid profile email',
  client_secret: import.meta.env.VITE_CLIENT_SECRET,
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: 60,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
})
