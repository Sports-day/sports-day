import {Box, Card, Stack, SvgIcon, Typography} from "@mui/material";
import * as React from "react";
import {Match} from "@/src/models/MatchModel";
import {HiClock, HiMapPin} from "react-icons/hi2";
import { Grid as Grid2 } from "@mui/material";
import {useFetchGame} from "@/src/features/games/hook";
import {useFetchLocation} from "@/src/features/locations/hook";
import {useFetchTeam} from "@/src/features/teams/hook";

type MatchCardProps = {
    match: Match
}

export default function MatchCard(props: MatchCardProps) {
    const {game} = useFetchGame(props.match.gameId)
    const {location} = useFetchLocation(props.match.locationId ?? 0)
    const {team: leftTeam} = useFetchTeam(props.match.leftTeamId ?? 0)
    const {team: rightTeam} = useFetchTeam(props.match.rightTeamId ?? 0)

    const formattedTime = new Date(props.match.startAt).toLocaleTimeString("ja-JP", {
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
                            width: '100%', // 幅を100%に設定
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
                                    {game?.name}
                                </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 2.5 }} display="flex" justifyContent="center">
                                <Typography variant="h4" component="div" textAlign="center">
                                    {leftTeam?.name ?? "未登録"}
                                </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 1 }} display="flex" justifyContent="center">
                                <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                                    vs
                                </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 2.5 }} display="flex" justifyContent="center">
                                <Typography variant="h4" component="div" textAlign="center">
                                    {rightTeam?.name ?? "未登録"}
                                </Typography>
                            </Grid2>
                            <Grid2 size={{ xs: 3 }} display="flex" flexDirection="column" alignItems="left"
                                   justifyContent="center" margin="0">
                                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                                    <SvgIcon fontSize={"small"}>
                                        <HiMapPin/>
                                    </SvgIcon>
                                    <Typography variant="subtitle1" component="div" textAlign="left" sx={{flexGrow: 1}}>
                                        {props.match.locationId == null ? "未登録" : (location?.name ?? "未登録")}
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
