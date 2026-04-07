import {Box, Card, CardContent, Grid, LinearProgress, Stack, Typography} from "@mui/material";
import LeftCircleContainer from "@/components/information/layout/leftCircleContainer";
import MatchList from "@/components/information/match/matchList"
import {InfoGameProgressChart} from "@/components/information/infoGameProgressChart";
import * as React from "react";
import LeagueCardList from "@/components/information/league/leagueCardList";
import Top3LeagueCards from "@/components/information/league/top3LeagueCards";
import AutoRefresh from "@/components/AutoRefresh";
import {useFetchSport, useFetchSportProgress} from "@/src/features/sports/hook";
import {useFetchGames} from "@/src/features/games/hook";
import {useFetchMatches} from "@/src/features/matches/hook";
import {useParams} from "react-router-dom";
import {useMemo} from "react";
import { MatchStatus } from "@/src/gql/__generated__/graphql";

export default function Page() {
    const {id} = useParams<{id: string}>()
    const sportId = id ?? '0'

    const {sport, isFetching: isSportFetching} = useFetchSport(sportId)
    const {games, isFetching: isGamesFetching} = useFetchGames()
    const {matches, isFetching: isMatchesFetching} = useFetchMatches()
    const {progress, isFetching: isProgressFetching} = useFetchSportProgress(sportId)

    // sport.scene のシーンIDに一致するgamesをフィルタ
    const filteredGames = useMemo(() => {
        const sceneIds = new Set((sport?.scene ?? []).map(ss => ss.scene.id))
        return games.filter((game) => sceneIds.has(game.scene.id))
    }, [games, sport])

    const formattedProgress = Math.trunc((progress ?? 0) * 100)
    const chartSeries = [formattedProgress, 100 - formattedProgress]

    // filteredGames に属する試合で進行中のものを取得
    const inProgressMatches = useMemo(() => {
        const gameIds = new Set(filteredGames.map(g => g.id))
        return matches
            .filter(m => gameIds.has(m.competition.id) && (m.status === MatchStatus.Standby || m.status === MatchStatus.Ongoing))
            .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    }, [matches, filteredGames])

    const isFetching = isSportFetching || isGamesFetching || isProgressFetching || isMatchesFetching

    if (isFetching) {
        return <LinearProgress />
    }

    return (
        <div style={{position: 'relative'}}>
            <AutoRefresh/>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0
                }}
            >
                <LeftCircleContainer/>
            </Box>
            <Box sx={{position: 'relative', zIndex: 1, padding: 0}}>
                <Stack
                    direction="row"
                    spacing={4}
                    sx={{
                        justifyContent: "center",
                        margin: 0,
                        marginTop: 12,
                        width: '100%'
                    }}>
                    {/* 左側のエリア */}
                    <Stack spacing={5} sx={{flex: 1}} paddingLeft={3}>
                        <Typography variant="h5" fontWeight={"600"} align={"center"}>
                            全体の順位
                        </Typography>
                        <Box sx={{flexGrow: 1}} width="100%">
                            <Grid container alignItems="flex-end" justifyContent="center" columnSpacing={3}
                                   columns={12}
                                   margin={0}>
                                <Top3LeagueCards games={filteredGames}/>
                            </Grid>

                        </Box>
                        <Box sx={{flexGrow: 1}}>
                            <Grid container alignItems="flex-end" justifyContent="center" spacing={3} columns={12}>
                                <LeagueCardList games={filteredGames}/>
                            </Grid>
                        </Box>


                    </Stack>


                    {/* Second Component */}
                    <Grid
                        size={{ xs: 6 }}
                        justifyContent="center"
                        alignItems="center"
                        flex={1}
                        sx={{
                            padding: 0
                        }}
                    >
                        <Stack
                            direction="column"
                            width={"100%"}
                            flex={1}
                        >

                            {/* Second Component */}
                            <Box flex={1} sx={{width: '100%'}}>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    height="100%"
                                    width="100%"
                                    position="relative"
                                >
                                    {/* 進行状況カード */}
                                    <Box sx={{width: '100%', maxWidth: 600, mb: 10}}>
                                        <Card sx={{width: '100%', height: 90}}>
                                            <CardContent>
                                                <InfoGameProgressChart chartSeries={chartSeries}/>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                    <Box alignItems="left" sx={{width: '100%', maxWidth: 600}}>
                                        <Typography variant="h5" fontWeight={"600"} align={"left"} paddingBottom={5}>
                                            現在進行中の試合
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <MatchList matches={inProgressMatches}/>
                                    </Box>


                                </Box>
                            </Box>
                        </Stack>
                    </Grid>
                </Stack>
            </Box>
        </div>
    );
}
