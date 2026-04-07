import {Stack} from "@mui/material";
import * as React from "react";
import {GamePointBar} from "./GamePointBar";
import type { GetPanelCompetitionsQuery, GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import {useContext} from "react";
import {MatchesContext} from "../../context";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

type PanelCompetition = GetPanelCompetitionsQuery["competitions"][number];

export type GameListContentProps = {
    game: PanelCompetition
    myTeamId?: string
}

export const GameListContent = (props: GameListContentProps) => {
    const { data: matches } = useContext(MatchesContext)
    const filteredMatches = (matches as PanelMatch[]).filter(match => match.competition.id === props.game.id)
    const allScores = filteredMatches.flatMap(match => match.entries.map(e => e.score))
    const maxScore = allScores.length > 0 ? Math.max(...allScores) : 0
    const barOffset = (maxScore == 0) ? 1 : (95 / maxScore)

    return (
        <Stack spacing={1}>
            {filteredMatches
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((match) => {
                return (
                    <>
                            <GamePointBar
                                key={match.id}
                                match={match}
                                barOffset={barOffset}
                                myTeamId={props.myTeamId}
                                otherUser={false}
                            />
                    </>
                )
            })}
        </Stack>
    )
}
