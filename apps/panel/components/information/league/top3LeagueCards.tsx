import { Grid as Grid2 } from "@mui/material";
import {Card, Stack, SvgIcon, Typography} from "@mui/material";
import {HiChartBar} from "react-icons/hi2";
import * as React from "react";
import {useState, useEffect} from "react";
import type { GetPanelCompetitionsQuery } from "@/src/gql/__generated__/graphql";
import {
    CompetitionType,
    GetPanelLeagueStandingsDocument,
    type GetPanelLeagueStandingsQuery,
} from "@/src/gql/__generated__/graphql";
import { useApolloClient } from "@apollo/client";
import {useFetchTeams} from "@/src/features/teams/hook";

type PanelCompetition = GetPanelCompetitionsQuery["competitions"][number];

export type Top3LeagueCardsProps = {
    games: PanelCompetition[]
}

type ExtendedStandingResult = {
    game: PanelCompetition,
    teamName: string,
    score: number,
    rank: number,
}

export default function Top3LeagueCards(props: Top3LeagueCardsProps) {
    const [results, setResults] = useState<ExtendedStandingResult[]>([])
    const client = useApolloClient();
    const { teams } = useFetchTeams();

    useEffect(() => {
        const leagueGames = props.games.filter(g => g.type === CompetitionType.League && g.league?.id);
        if (leagueGames.length === 0) return;

        Promise.all(
            leagueGames.map(async (game) => {
                const leagueId = game.league!.id;
                try {
                    const { data } = await client.query<GetPanelLeagueStandingsQuery>({
                        query: GetPanelLeagueStandingsDocument,
                        variables: { leagueId },
                    });
                    return { game, standings: data?.leagueStandings ?? [] };
                } catch {
                    return { game, standings: [] };
                }
            })
        ).then((allResults) => {
            const extended: ExtendedStandingResult[] = [];
            for (const { game, standings } of allResults) {
                for (const standing of standings) {
                    const team = teams.find(t => t.id === standing.team.id);
                    const totalMatches = standing.win + standing.draw + standing.lose;
                    const winRate = totalMatches > 0 ? standing.points / (totalMatches * 3) : 0;
                    extended.push({
                        game,
                        teamName: team?.name ?? "不明",
                        score: winRate,
                        rank: standing.rank,
                    });
                }
            }
            extended.sort((a, b) => b.score - a.score);
            setResults(extended.slice(0, 3));
        });
    }, [props.games, teams, client]);


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
                            {results[1]?.teamName ?? "なし"}
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
                            {results[0]?.teamName ?? "なし"}
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
                            {results[2]?.teamName ?? "なし"}
                        </Typography>

                    </Stack>
                </Card>
            </Grid2>
        </>
    )
}
