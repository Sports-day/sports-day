import {Box, Card, CardContent, Grid, LinearProgress, Stack, Typography} from "@mui/material";
import LeftCircleContainer from "@/components/information/layout/leftCircleContainer";
import MatchList from "@/components/information/match/matchList"
import {InfoGameProgressChart} from "@/components/information/infoGameProgressChart";
import * as React from "react";
import LeagueCardList from "@/components/information/league/leagueCardList";
import Top3LeagueCards from "@/components/information/league/top3LeagueCards";
import AutoRefresh from "@/components/AutoRefresh";
import {useFetchSport, useFetchSportProgress} from "@/src/features/sports/hook";
import {useFetchGames, useFetchGameMatches} from "@/src/features/games/hook";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Match} from "@/src/models/MatchModel";

function MatchListLoader({ gameIds }: { gameIds: number[] }) {
    const [matchList, setMatchList] = useState<Match[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (gameIds.length === 0) {
            setLoading(false)
            return
        }

        Promise.all(
            gameIds.map(async (gameId) => {
                const { useFetchGameMatches: _ } = await import("@/src/features/games/hook")
                return gameId
            })
        ).then(() => {
            setLoading(false)
        })
    }, [gameIds])

    return <MatchList matches={matchList} />
}

export default function Page() {
    const {id} = useParams<{id: string}>()
    const sportId = parseInt(id ?? '0', 10)

    const {sport, isFetching: isSportFetching} = useFetchSport(sportId)
    const {games, isFetching: isGamesFetching} = useFetchGames()
    const {progress, isFetching: isProgressFetching} = useFetchSportProgress(sportId)

    const filteredGames = games.filter((game) => game.sportId == sport?.id)
    const formattedProgress = Math.trunc((progress ?? 0) * 100)
    const chartSeries = [formattedProgress, 100 - formattedProgress]

    const isFetching = isSportFetching || isGamesFetching || isProgressFetching

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
                                        <InProgressMatches filteredGames={filteredGames}/>
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

function InProgressMatches({filteredGames}: {filteredGames: {id: number}[]}) {
    const [matchList, setMatchList] = useState<Match[]>([])

    useEffect(() => {
        if (filteredGames.length === 0) return

        Promise.all(
            filteredGames.map(game =>
                import("@/src/models/GameModel").then(({gameFactory}) =>
                    gameFactory().getGameMatches(game.id)
                )
            )
        ).then(allMatches => {
            const inProgress = allMatches.flat()
                .filter(m => m.status === "standby" || m.status === "in_progress")
                .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())

            // 各ゲームから1試合ずつ抽出
            const seen = new Set<number>()
            const result: Match[] = []
            for (const match of inProgress) {
                if (!seen.has(match.gameId)) {
                    seen.add(match.gameId)
                    result.push(match)
                }
            }
            setMatchList(result)
        })
    }, [filteredGames])

    return <MatchList matches={matchList}/>
}
