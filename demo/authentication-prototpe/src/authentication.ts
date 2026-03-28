// src/auth.ts
import { UserManager, WebStorageStateStore, InMemoryWebStorage } from 'oidc-client-ts';

export const userManager = new UserManager({
  authority: 'https://dev-idp.sports-day.net/realms/sportsday',
  client_id: 'sportsday',
  redirect_uri: 'http://localhost:3000/api/auth/callback',
  silent_redirect_uri: 'http://localhost:3000/api/auth/silent-callback',
  post_logout_redirect_uri: 'http://localhost:3000/api/auth/callback',
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: 60,
  userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
});