// src/auth.ts
import { UserManager, WebStorageStateStore, InMemoryWebStorage } from 'oidc-client-ts';

export const userManager = new UserManager({
  authority: 'http://localhost:8888/realms/sportsday',
  client_id: 'sportsday',
  redirect_uri: 'http://localhost:5173/callback',
  silent_redirect_uri: 'http://localhost:5173/silent-renew.html',
  post_logout_redirect_uri: 'http://localhost:5173',
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: 60,
  userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
});