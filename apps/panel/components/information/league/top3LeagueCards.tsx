import { Grid as Grid2 } from "@mui/material";
import {Card, Stack, SvgIcon, Typography} from "@mui/material";
import {HiChartBar} from "react-icons/hi2";
import * as React from "react";
import {useState} from "react";
import type { Competition as Game, Team } from "@/src/gql/__generated__/graphql";

// 【未確定】REST → GraphQL 移行中
type LeagueTeamResult = { teamId: string; score: number; rank: number }
type LeagueResult = { gameId: string; finished: boolean; teams: LeagueTeamResult[]; createdAt: string }
import {useAsync} from "react-use";

export type Top3LeagueCardsProps = {
    games: Game[]
}

type ExtendedLeagueTeamResult = {
    game: Game,
    team: Team
    teamResult: LeagueTeamResult
}

export default function Top3LeagueCards(props: Top3LeagueCardsProps) {
    const [results, setResults] = useState<ExtendedLeagueTeamResult[]>([])

    useAsync(async () => {
        // 【未確定】leagueStandings GraphQL クエリへの移行は後続タスクで対応
        const teams: Team[] = await (async () => [])()

        const leagueResults: LeagueResult[] = []
        for (const game of props.games) {
            const leagueResult: LeagueResult = await (async () => ({teams: [], createdAt: "", finished: false, gameId: game.id}))()
            leagueResults.push(leagueResult)
        }

        const extendedLeagueResults: ExtendedLeagueTeamResult[] = []
        for (const leagueResult of leagueResults) {
            leagueResult.teams.forEach((value) => {
                const team = teams.find(v => v.id == value.teamId)
                const game = props.games.find(v => v.id == leagueResult.gameId)

                if (!team || !game) {
                    return
                }

                extendedLeagueResults.push({
                    game: game,
                    team: team,
                    teamResult: value
                })
            })
        }

        //  sort
        extendedLeagueResults.sort((a, b) =>
            b.teamResult.score - a.teamResult.score
        )

        setResults(extendedLeagueResults.slice(0, 3))
    })


    return (
        <>
            <Grid2 size={{ xs: 3.8 }}>
                <Card
                    variant="outlined"
                    sx={{
                        height: 300,
                        width: '100%', // 幅を100%に設定
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0,
                        padding: 1,
                        zIndex: 2,
                    }}
                >
                    <Stack spacing={2} direction="column" alignItems={"center"}
                           justifyContent="center">
                        <Stack direction="row" alignItems="flex-end" justifyContent="center"
                               spacing={0.4} paddingTop={2}>
                            <Typography variant="h4" component="div" textAlign="center">
                                2
                            </Typography>
                            <Typography variant="subtitle1" component="div" textAlign="center">
                                位
                            </Typography>

                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="center"
                               spacing={0.4}>
                            <SvgIcon>
                                <HiChartBar color="#99a5d6"/>
                            </SvgIcon>
                            <Typography variant="subtitle1" component="div">
                                {results[1]?.game.name ?? "なし"}
                            </Typography>

                        </Stack>
                        <Typography variant="h3" component="div" textAlign="center">
                            {results[1]?.team.name ?? "なし"}
                        </Typography>

                    </Stack>
                </Card>
            </Grid2>
            <Grid2 size={{ xs: 3.8 }}>
                <Card
                    variant="outlined"
                    sx={{
                        height: 350,
                        width: '100%', // 幅を100%に設定
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0,
                        padding: 1,
                        zIndex: 2,
                    }}
                >
                    <Stack spacing={2} direction="column" alignItems={"center"}
                           justifyContent="center">
                        <Stack direction="row" alignItems="flex-end" justifyContent="center"
                               spacing={0} paddingTop={2}>
                            <Typography variant="h4" component="div" textAlign="center">
                                1
                            </Typography>
                            <Typography variant="subtitle1" component="div" textAlign="center">
                                位
                            </Typography>

                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="center"
                               spacing={0.4}>
                            <SvgIcon>
                                <HiChartBar color="#99a5d6"/>
                            </SvgIcon>
                            <Typography variant="subtitle1" component="div" textAlign="center">
                                {results[0]?.game.name ?? "なし"}
                            </Typography>

                        </Stack>
                        <Typography variant="h3" component="div" textAlign="center">
                            {results[0]?.team.name ?? "なし"}
                        </Typography>

                    </Stack>
                </Card>
            </Grid2>
            <Grid2 size={{ xs: 3.8 }}>
                <Card
                    variant="outlined"
                    sx={{
                        height: 250,
                        width: '100%', // 幅を100%に設定
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0,
                        padding: 1,
                        zIndex: 2,
                    }}
                >
                    <Stack spacing={2} direction="column" alignItems={"center"}
                           justifyContent="center">
                        <Stack direction="row" alignItems="flex-end" justifyContent="center"
                               spacing={0.4} paddingTop={2}>
                            <Typography variant="h4" component="div" textAlign="center">
                                3
                            </Typography>
                            <Typography variant="subtitle1" component="div" textAlign="center">
                                位
                            </Typography>

                        </Stack>

                        <Stack direction="row" alignItems="center" justifyContent="center"
                               spacing={0.4}>
                            <SvgIcon>
                                <HiChartBar color="#99a5d6"/>
                            </SvgIcon>
                            <Typography variant="subtitle1" component="div" textAlign="center">
                                {results[2]?.game.name ?? "なし"}
                            </Typography>

                        </Stack>
                        <Typography variant="h3" component="div" textAlign="center">
                            {results[2]?.team.name ?? "なし"}
                        </Typography>

                    </Stack>
                </Card>
            </Grid2>
        </>
    )
}