import type { ReactNode } from "react";
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloProvider as Provider,
    from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { userManager } from "@/src/lib/userManager";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
        graphQLErrors
            .filter(({ message }) => !message.includes('LEAGUE_NOT_FOUND'))
            .forEach(({ message, path }) =>
                console.error(`[GraphQL error]: Message: ${message}, Path: ${path}, Operation: ${operation.operationName}`)
            );
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}, Operation: ${operation.operationName}`);
    }
});

const authLink = setContext(async (_, { headers }) => {
    const user = await userManager.getUser()
    return {
        headers: {
            ...headers,
            ...(user?.id_token ? { Authorization: `Bearer ${user.id_token}` } : {}),
        },
    }
})

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, authLink, httpLink]),
});

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
    return <Provider client={client}>{children}</Provider>;
};
