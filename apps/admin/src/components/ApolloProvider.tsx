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
    let user = await userManager.getUser()

    // トークンが期限切れの場合、サイレントリニューを試みる
    if (user?.expired) {
        try {
            user = await userManager.signinSilent()
        } catch {
            // サイレントリニュー失敗時はトークンなしで送信（401が返りerrorLinkで処理）
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

const errorLink = onError(({ graphQLErrors, networkError }) => {
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
        }
    }
    if (networkError) {
        // HTTP 401 は認証エラー（ネットワーク障害ではない）
        if ('statusCode' in networkError && networkError.statusCode === 401) {
            showWarningToast("ログインセッションが切れました。再度ログインしてください。")
            return
        }
        showErrorToast("サーバーに接続できません。ネットワーク接続を確認してください。")
        return
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
