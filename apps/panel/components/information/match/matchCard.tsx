import {Box, Card, Stack, SvgIcon, Typography} from "@mui/material";
import * as React from "react";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import {HiClock, HiMapPin} from "react-icons/hi2";
import { Grid as Grid2 } from "@mui/material";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

type MatchCardProps = {
    match: PanelMatch
}

export default function MatchCard(props: MatchCardProps) {
    const leftEntry = props.match.entries[0];
    const rightEntry = props.match.entries[1];
    const leftTeamName = leftEntry?.team?.name ?? "未登録";
    const rightTeamName = rightEntry?.team?.name ?? "未登録";

    const formattedTime = new Date(props.match.time).toLocaleTimeString("ja-JP", {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <>
            <Box sx={{width: 'auto', maxWidth: 600, mb: 5}}>
                <Box sx={{position: 'relative', width: '100%', maxWidth: 600}}>
                    {/* 後ろのカード */}
                    <Card variant="outlined" sx={{
                        height: 120,
                        width: '100%',
                        position: 'absolute',
                        top: 6,
                        right: -6,
                        zIndex: 1 // メインカードの下に置く
                    }}/>
                </Box>

                {/* メインカード */}
                <Box sx={{width: '100%', maxWidth: 600}}>
                    <Card
                        variant="outlined"
                        sx={{
                            height: 120,
                            width: '100%',
                            position: 'relative',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 0,
                            zIndex: 2,
                        }}
                    >

                        <Grid2 container spacing={2.5} width="100%" height="100%" alignItems="center"
                               justifyContent="center" margin="0">
                            <Grid2 size={{ xs: 2.5 }} display="flex" justifyContent="center">
                                <Typography variant="subtitle1" component="div" textAlign="center">
                                    {props.match.competition.name}
                                </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 2.5 }} display="flex" justifyContent="center">
                                <Typography variant="h4" component="div" textAlign="center">
                                    {leftTeamName}
                                </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 1 }} display="flex" justifyContent="center">
                                <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                                    vs
                                </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 2.5 }} display="flex" justifyContent="center">
                                <Typography variant="h4" component="div" textAlign="center">
                                    {rightTeamName}
                                </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 3 }} display="flex" flexDirection="column" alignItems="left"
                                   justifyContent="center" margin="0">
                                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                    <SvgIcon fontSize={"small"}>
                                        <HiMapPin/>
                                    </SvgIcon>
                                    <Typography variant="subtitle1" component="div" textAlign="left" sx={{flexGrow: 1}}>
                                        {props.match.location == null ? "未登録" : (props.match.location.name ?? "未登録")}
                                    </Typography>
                                </Stack>

                                <Stack direction={"row"} alignItems={"center"} justifyContent={"flex-start"}
                                       spacing={0.5}>
                                    <SvgIcon fontSize={"small"}>
                                        <HiClock/>
                                    </SvgIcon>
                                    <Typography variant="subtitle1" component="div" textAlign="left" sx={{flexGrow: 1}}>
                                        {formattedTime}
                                    </Typography>
                                </Stack>

                            </Grid2>
                        </Grid2>
                    </Card>
                </Box>

            </Box>
        </>
    );
}
