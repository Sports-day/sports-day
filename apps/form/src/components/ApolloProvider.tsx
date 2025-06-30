"use client";

import type { ReactNode } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloNextAppProvider as Provider,
} from "@apollo/client-integration-nextjs";
import { HttpLink } from "@apollo/client";

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
  return <Provider makeClient={makeClient}>{children}</Provider>;
};

const makeClient = () => {
  const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`,
    fetchOptions: {
      cache: "no-store",
    },
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only",
      },
    },
    link: httpLink,
  });
};
