import React, {useState} from 'react';
import { Grid as Grid2 } from "@mui/material";
import type { Competition as Game, Team } from "@/src/gql/__generated__/graphql";
import {useAsync} from "react-use";
import LeagueCard from "@/components/information/league/leagueCard";

// 【未確定】REST → GraphQL 移行中
type LeagueTeamResult = { teamId: string; score: number; rank: number }
type LeagueResult = { gameId: string; finished: boolean; teams: LeagueTeamResult[]; createdAt: string }

export type LeagueCardListProps = {
    games: Game[]
}

type ExtendedLeagueTeamResult = {
    game: Game,
    team: Team
    teamResult: LeagueTeamResult
}

export default function LeagueCardList(props: LeagueCardListProps) {
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

        setResults(extendedLeagueResults.slice(3, 10))
    })


    return (
        <Grid2 container spacing={2} columns={12} margin={2}>
            {results.map((value, index) => (
                <Grid2 size={{ xs: 6 }} key={index} direction="row">
                    <LeagueCard
                        league={value.game.name}
                        team={value.team.name}
                        rank={index + 4}
                    />
                </Grid2>
            ))}
        </Grid2>
    );
};

