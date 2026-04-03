import {Avatar, Box, Button, Stack, Typography, useTheme} from "@mui/material";
import type { Sport } from "@/src/gql/__generated__/graphql";
import { Link } from "react-router-dom";
import {HiOutlineExclamationTriangle} from "react-icons/hi2";
import * as React from "react";


export type SportsListElementProps = {
    sport: Sport;
}

export const SportsListElement = (props: SportsListElementProps) => {
    const theme = useTheme();

    return (
        <Button
            variant={"contained"}
            color={"secondary"}
            component={Link}
            to={`/sports/${props.sport.id}`}
            sx={{
                width:"100%",
                border: `1px solid ${theme.palette.secondary.dark}66`,
            }}
        >
            <Box sx={{width:"100%"}} py={1}>
                <Stack
                    direction={"row"}
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    spacing={2}
                >
                    <Avatar
                        alt={props.sport.name}
                        sx={{height: "2em", width: "2em",
                            backgroundColor: theme.palette.text.secondary,
                        }}
                        src={`${import.meta.env.VITE_API_URL}/images/${props.sport.iconId}/file`}
                    >
                        {!props.sport.iconId && <HiOutlineExclamationTriangle fontSize={"20px"}/>}
                    </Avatar>
                    <Typography color={theme.palette.text.primary}>
                        {props.sport.name}
                    </Typography>
                </Stack>
            </Box>
        </Button>
    )
}
