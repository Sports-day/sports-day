import type { ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider as Provider,
} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  }),
});

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return <Provider client={client}>{children}</Provider>;
};
