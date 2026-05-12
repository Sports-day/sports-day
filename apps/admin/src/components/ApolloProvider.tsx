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
import { showErrorToast, showWarningToast, suppressNextError } from "@/lib/toast";

// 複数クエリが同時にexpiredを検知してsigninSilent()を並行実行するのを防ぐ
let renewingPromise: Promise<import('oidc-client-ts').User | null> | null = null

// 認証エラートーストの重複表示を防ぐ（複数クエリが同時に401を受けたとき）
let _authWarningShownAt = 0
const AUTH_WARNING_COOLDOWN_MS = 5000

function showAuthWarningOnce(message: string) {
    const now = Date.now()
    if (now - _authWarningShownAt < AUTH_WARNING_COOLDOWN_MS) return
    _authWarningShownAt = now
    showWarningToast(message)
}

const authLink = setContext(async (_, { headers }) => {
    let user = await userManager.getUser()

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
            if (msg.includes("UNAUTHORIZED") || msg.includes("TOKEN_EXPIRED") || msg.includes("TOKEN_MISSING") || msg.includes("TOKEN_INVALID") || msg.includes("TOKEN_CLAIMS_INVALID")) {
                showAuthWarningOnce("ログインセッションが切れました。再度ログインしてください。")
                return
            }
        }
    }
    if (networkError) {
        // HTTP 401 は認証エラー（ネットワーク障害ではない）
        if ('statusCode' in networkError && networkError.statusCode === 401) {
            showAuthWarningOnce("ログインセッションが切れました。再度ログインしてください。")
            return
        }
        showErrorToast("サーバーに接続できません。ネットワーク接続を確認してください。")
        suppressNextError()
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
