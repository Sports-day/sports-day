import {Button, Stack, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import MSLogo from "@/src/assets/ms.svg?react";
import * as React from "react";
import {useTheme} from "@mui/material/styles";

export default function LoginButton() {
    const theme = useTheme();
    const [authorizationUrl, setAuthorizationUrl] = useState<string>('')

    useEffect(() => {
        const authorizationBaseUrl = import.meta.env.VITE_OIDC_AUTHORIZE_URL
        const clientId = import.meta.env.VITE_OIDC_CLIENT_ID
        const redirectUri = import.meta.env.VITE_OIDC_REDIRECT_URL
        const scope = import.meta.env.VITE_OIDC_SCOPE ?? "openid profile email"

        // Web Crypto API でランダムなnonceを生成
        const nonceArray = new Uint8Array(16)
        window.crypto.getRandomValues(nonceArray)
        const nonce = Array.from(nonceArray).map(b => b.toString(16).padStart(2, '0')).join('')

        const queryData: Record<string, string> = {
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            response_mode: "query",
            scope: scope,
            nonce: nonce,
        }

        const searchParams = new URLSearchParams(queryData).toString()
        setAuthorizationUrl(`${authorizationBaseUrl}?${searchParams}`)
    }, [])

    const buttonDisplayName = import.meta.env.VITE_OIDC_DISPLAY_NAME ?? "ログインできません"

    return (
        <Button
            variant="contained"
            color={"secondary"}
            href={authorizationUrl}
            sx={{px:3, py:2,mb:1, width:"100%", backgroundColor:`${theme.palette.text.primary}`}}
            disableElevation
        >
            <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={2}
            >
                <MSLogo width={16} height={16}/>
                <Typography fontSize={"14px"} color={theme.palette.background.paper}>
                    {buttonDisplayName}
                </Typography>
            </Stack>
        </Button>
    );
}
