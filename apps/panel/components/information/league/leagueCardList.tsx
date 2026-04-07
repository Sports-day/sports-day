import React, {useState, useEffect} from 'react';
import { Grid as Grid2 } from "@mui/material";
import type { GetPanelCompetitionsQuery } from "@/src/gql/__generated__/graphql";
import {
    CompetitionType,
    GetPanelLeagueStandingsDocument,
    type GetPanelLeagueStandingsQuery,
} from "@/src/gql/__generated__/graphql";
import { useApolloClient } from "@apollo/client";
import LeagueCard from "@/components/information/league/leagueCard";
import {useFetchTeams} from "@/src/features/teams/hook";

type PanelCompetition = GetPanelCompetitionsQuery["competitions"][number];

export type LeagueCardListProps = {
    games: PanelCompetition[]
}

type ExtendedStandingResult = {
    game: PanelCompetition,
    teamName: string,
    score: number,
    rank: number,
}

export default function LeagueCardList(props: LeagueCardListProps) {
    const [results, setResults] = useState<ExtendedStandingResult[]>([])
    const client = useApolloClient();
    const { teams } = useFetchTeams();

    useEffect(() => {
        const leagueGames = props.games.filter(g => g.type === CompetitionType.League && g.league?.id);
        if (leagueGames.length === 0) return;

        Promise.all(
            leagueGames.map(async (game) => {
                const leagueId = game.league!.id;
                const { data } = await client.query<GetPanelLeagueStandingsQuery>({
                    query: GetPanelLeagueStandingsDocument,
                    variables: { leagueId },
                });
                return { game, standings: data?.leagueStandings ?? [] };
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
            setResults(extended.slice(3, 10));
        });
    }, [props.games, teams, client]);


    return (
        <Grid2 container spacing={2} columns={12} margin={2}>
            {results.map((value, index) => (
                <Grid2 size={{ xs: 6 }} key={index} direction="row">
                    <LeagueCard
                        league={value.game.name}
                        team={value.teamName}
                        rank={index + 4}
                    />
                </Grid2>
            ))}
        </Grid2>
    );
};
