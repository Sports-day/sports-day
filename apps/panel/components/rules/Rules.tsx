import React from 'react';
import {Stack, DialogContentText, Typography, useTheme} from "@mui/material";
import ReactMarkdown from "react-markdown";

export type RuleProps = {
    rules: Array<{ id?: string | null; rule: string }>;
}

export const Rules = (props: RuleProps) => {
    const theme = useTheme();

    if (props.rules.length === 0) {
        return (
            <Typography color={theme.palette.text.secondary}>
                ルールが登録されていません。
            </Typography>
        );
    }

    return (
        <Stack
            direction={"column"}
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={2}
            py={2}
            sx={{width: "100%"}}
        >
            {props.rules.map((rule, index) => (
                <DialogContentText
                    key={rule.id ?? index}
                    id="scroll-dialog-description"
                    tabIndex={-1}
                    color={theme.palette.text.primary}
                    lineHeight={"27px"}
                    sx={{width: "100%"}}
                >
                    <ReactMarkdown>{rule.rule}</ReactMarkdown>
                </DialogContentText>
            ))}
        </Stack>
    );
}
