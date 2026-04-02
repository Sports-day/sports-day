import type { ReactNode } from "react";
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloProvider as Provider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { userManager } from "@/lib/userManager";

const authLink = setContext(async (_, { headers }) => {
    const user = await userManager.getUser()
    return {
        headers: {
            ...headers,
            ...(user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}),
        },
    }
})

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
    return <Provider client={client}>{children}</Provider>;
};
