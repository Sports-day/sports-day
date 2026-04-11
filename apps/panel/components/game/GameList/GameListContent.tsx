import {Stack, Typography, useTheme} from "@mui/material";
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
    const theme = useTheme()
    const { data: matches } = useContext(MatchesContext)
    const filteredMatches = (matches as PanelMatch[]).filter(match => match.competition.id === props.game.id)
    const allScores = filteredMatches.flatMap(match => match.entries.map(e => e.score))
    const maxScore = allScores.length > 0 ? Math.max(...allScores) : 0
    const barOffset = (maxScore == 0) ? 1 : (95 / maxScore)

    if (filteredMatches.length === 0) {
        return (
            <Typography pl={2} py={2} fontSize={"14px"} color={theme.palette.text.secondary}>
                試合データがありません
            </Typography>
        )
    }

    return (
        <Stack spacing={1}>
            {filteredMatches
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((match) => {
                return (
                    <React.Fragment key={match.id}>
                        <GamePointBar
                            match={match}
                            barOffset={barOffset}
                            myTeamId={props.myTeamId}
                            otherUser={false}
                        />
                    </React.Fragment>
                )
            })}
        </Stack>
    )
}
