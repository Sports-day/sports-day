import {useContext, useMemo} from "react";
import {MatchesContext, TeamsContext} from "../context";
import {GamePointBar} from "@/components/game/GameList/GamePointBar";
import {Stack} from "@mui/material";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

export type UserMatchListProps = {
    userId: string
}

export const UserMatchList = (props: UserMatchListProps) => {
    const { data: matches } = useContext(MatchesContext)
    const { data: teams } = useContext(TeamsContext)
    const userTeam = useMemo(
        () => teams.find(team => team.users.some(u => u.id === props.userId)),
        [teams, props.userId]
    )
    const filteredMatches = useMemo(
        () => (matches as PanelMatch[]).filter(match => {
            const teamIds = match.entries.map(e => e.team?.id)
            const judgeTeamId = match.judgment?.team?.id
            return teamIds.includes(userTeam?.id) || judgeTeamId === userTeam?.id
        }),
        [matches, userTeam?.id]
    )
    const barOffset = useMemo(() => {
        const allScores = filteredMatches.flatMap(match => match.entries.map(e => e.score))
        const maxScore = allScores.length > 0 ? Math.max(...allScores) : 0
        return (maxScore == 0) ? 1 : (95 / maxScore)
    }, [filteredMatches])

    return (
        <Stack spacing={1}>
            {filteredMatches
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((match) => {
                    return (
                            <GamePointBar
                                key={match.id}
                                match={match}
                                barOffset={barOffset}
                                myTeamId={userTeam?.id}
                                otherUser={true}
                            />
                    )
                }
            )}
        </Stack>
    )
}
