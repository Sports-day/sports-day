import type { ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider as Provider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { userManager } from "@/lib/userManager";

// 複数クエリが同時にexpiredを検知してsigninSilent()を並行実行するのを防ぐ
let renewingPromise: Promise<import('oidc-client-ts').User | null> | null = null

const authLink = setContext(async (_, { headers }) => {
  let user = await userManager.getUser();

  if (user?.expired) {
    if (!renewingPromise) {
      renewingPromise = userManager.signinSilent()
        .catch(() => null)
        .finally(() => { renewingPromise = null })
    }
    user = await renewingPromise
  }

  return {
    headers: {
      ...headers,
      ...(user?.id_token ? { Authorization: `Bearer ${user.id_token}` } : {}),
    },
  };
});

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return <Provider client={client}>{children}</Provider>;
};
