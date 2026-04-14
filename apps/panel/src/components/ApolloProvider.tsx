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

const errorLink = onError(({ graphQLErrors, networkError }) => {
    // エラーはApolloのキャッシュ・hookレベルで処理されるため、
    // コンソールへの出力は開発時のみに限定する
    if (import.meta.env.DEV) {
        if (graphQLErrors) {
            graphQLErrors
                .filter(({ message }) => !message.includes('LEAGUE_NOT_FOUND'))
                .forEach(({ message, path }) =>
                    console.warn(`[GraphQL error]: ${message}, Path: ${path}`)
                );
        }
        if (networkError) {
            console.warn(`[Network error]: ${networkError}`);
        }
    }
});

const authLink = setContext(async (_, { headers }) => {
    let user = await userManager.getUser()

    // トークンが期限切れの場合、サイレントリニューを試みる
    if (user?.expired) {
        try {
            user = await userManager.signinSilent()
        } catch {
            user = null
        }
    }

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
