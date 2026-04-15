import {Avatar, Box, Button, Stack, Typography, useTheme} from "@mui/material";
import type { GetPanelSportsQuery } from "@/src/gql/__generated__/graphql";
type PanelSport = GetPanelSportsQuery["sports"][number];
import { Link } from "react-router-dom";
import {HiOutlineExclamationTriangle} from "react-icons/hi2";
import * as React from "react";


export type SportsListElementProps = {
    sport: PanelSport;
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
                    sx={{ minWidth: 0, overflow: 'hidden' }}
                >
                    <Avatar
                        alt={props.sport.name}
                        sx={{height: "2em", width: "2em",
                            backgroundColor: theme.palette.text.secondary,
                            flexShrink: 0,
                        }}
                        src={props.sport.image?.url ?? undefined}
                    >
                        {!props.sport.image && <HiOutlineExclamationTriangle fontSize={"20px"}/>}
                    </Avatar>
                    <Typography noWrap color={theme.palette.text.primary} sx={{ minWidth: 0 }}>
                        {props.sport.name}
                    </Typography>
                </Stack>
            </Box>
        </Button>
    )
}
