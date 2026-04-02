import {Button, Stack, Typography} from "@mui/material";
import MSLogo from "@/src/assets/ms.svg?react";
import * as React from "react";
import {useTheme} from "@mui/material/styles";
import {userManager} from "@/src/lib/userManager";

export default function LoginButton() {
    const theme = useTheme();

    const handleLogin = () => {
        userManager.signinRedirect()
    }

    const buttonDisplayName = import.meta.env.VITE_OIDC_DISPLAY_NAME ?? "ログインできません"

    return (
        <Button
            variant="contained"
            color={"secondary"}
            onClick={handleLogin}
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
