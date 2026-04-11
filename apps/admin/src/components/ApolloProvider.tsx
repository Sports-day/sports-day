import type { ReactNode } from "react";
import {
    ApolloClient,
    InMemoryCache,
    HttpLink,
    ApolloProvider as Provider,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { userManager } from "@/lib/userManager";
import { showErrorToast, showWarningToast } from "@/lib/toast";

const authLink = setContext(async (_, { headers }) => {
    const user = await userManager.getUser()
    return {
        headers: {
            ...headers,
            ...(user?.id_token ? { Authorization: `Bearer ${user.id_token}` } : {}),
        },
    }
})

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
        for (const err of graphQLErrors) {
            const msg = err.message ?? ""
            if (msg.includes("FORBIDDEN") || msg.includes("INSUFFICIENT_ROLE")) {
                showWarningToast("この操作を行う権限がありません。")
                return
            }
            if (msg.includes("UNAUTHORIZED") || msg.includes("TOKEN_EXPIRED") || msg.includes("TOKEN_MISSING")) {
                showWarningToast("ログインセッションが切れました。再度ログインしてください。")
                return
            }
            console.warn(
                `[GraphQL error] operation=${operation.operationName} message=${msg} path=${err.path}`,
            )
        }
    }
    if (networkError) {
        console.warn(`[Network error] operation=${operation.operationName}`)
    }
})

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: errorLink.concat(authLink.concat(httpLink)),
});

export const ApolloProvider = ({ children }: { children: ReactNode }) => {
    return <Provider client={client}>{children}</Provider>;
};
