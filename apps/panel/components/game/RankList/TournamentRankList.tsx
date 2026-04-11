import {useTheme, Box, Card, Stack, Typography} from "@mui/material";
import type { GetPanelTeamsQuery } from "@/src/gql/__generated__/graphql";
import * as React from "react";
import {useContext} from "react";
import {TeamsContext} from "../../context";
import {
    useGetPanelTournamentRankingQuery,
} from "@/src/gql/__generated__/graphql";
import {LeagueRankListCard} from "./LeagueRankListCard";

type PanelTeam = GetPanelTeamsQuery["teams"][number];

export type TournamentRankListProps = {
    dashboard?: boolean,
    myTeamRank?: number,
    myTeam?: PanelTeam,
    competitionId?: string,
}

export const TournamentRankList = (props: TournamentRankListProps) => {
    const theme = useTheme();

    const {data: teams} = useContext(TeamsContext);

    const { data: rankingData, error: rankingError } = useGetPanelTournamentRankingQuery({
        variables: { competitionId: props.competitionId ?? "" },
        skip: !props.competitionId,
        errorPolicy: 'all',
    });


    const rankings = (rankingData?.tournamentRanking ?? []).filter(
        (r, i, arr) => arr.findIndex(x => x.team.id === r.team.id) === i
    );

    return (
        <>
            {props.dashboard &&
                <Stack width={"100%"}>
                    <Card
                        sx={{
                            background: `${theme.palette.secondary.dark}80`,
                        }}
                    >
                        <Stack
                            direction={"row"}
                            spacing={3}
                            width={"100%"}
                            alignItems={"center"}
                            justifyContent={"start"}
                            m={2}
                        >
                            <Typography
                                fontSize={"30px"}
                                color={theme.palette.text.secondary}
                            >
                                #{props.myTeamRank}
                            </Typography>
                            <Typography
                                fontSize={"20px"}
                                color={theme.palette.text.primary}
                            >
                                {props.myTeam?.name}
                            </Typography>
                        </Stack>
                    </Card>
                </Stack>
            }

            {rankings.length === 0 ? (
                <Typography pl={2} py={2} fontSize={"14px"} color={theme.palette.text.secondary}>
                    ランキングデータがありません
                </Typography>
            ) : (
                <Box
                    width={"100%"}
                    sx={{
                        overflow: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": {
                            display: "none"
                        }
                    }}
                >
                    <Stack sx={{width: "100%"}} direction={"row"} spacing={0.5}>
                        {rankings.map((ranking) => {
                            const team = teams.find(value => value.id === ranking.team.id)
                            return (
                                <LeagueRankListCard
                                    key={ranking.team.id}
                                    rank={ranking.rank}
                                    teamName={team?.name ?? "不明"}
                                    teamId={ranking.team.id}
                                    winRate={-1}
                                />
                            )
                        })}
                    </Stack>
                </Box>
            )}
        </>
    )
}
