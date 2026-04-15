import {LeagueRankListCard} from "@/components/game/RankList/LeagueRankListCard";
import {useTheme, Box, Card, Stack, Typography} from "@mui/material";
import type { GetPanelTeamsQuery } from "@/src/gql/__generated__/graphql";
import * as React from "react";
import {useContext} from "react";
import {TeamsContext} from "../../context";
import {
    useGetPanelLeagueStandingsQuery,
} from "@/src/gql/__generated__/graphql";

type PanelTeam = GetPanelTeamsQuery["teams"][number];

export type LeagueRankListProps = {
    dashboard?: boolean,
    myTeamRank?: number,
    myTeam?: PanelTeam,
    leagueId?: string,
}

export const LeagueRankList = (props: LeagueRankListProps) => {
    const theme = useTheme();

    const {data: teams} = useContext(TeamsContext);

    const { data: standingsData } = useGetPanelLeagueStandingsQuery({
        variables: { leagueId: props.leagueId ?? "" },
        skip: !props.leagueId,
    });

    const standings = (standingsData?.leagueStandings ?? []).filter(
        (s, i, arr) => arr.findIndex(x => x.team.id === s.team.id) === i
    );

    // 勝ち点率の計算: points / (試合数 * 3)
    const computeWinRate = (s: typeof standings[number]) => {
        const totalMatches = s.win + s.draw + s.lose;
        if (totalMatches === 0) return 0;
        return s.points / (totalMatches * 3);
    };

    const myStanding = standings.find(s => s.team.id === props.myTeam?.id);

    return (
        <>
            {/*Show myTeam Rank if "dashboard" is true*/}
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
                            sx={{ minWidth: 0, overflow: 'hidden' }}
                        >
                            <Typography
                                fontSize={"30px"}
                                color={theme.palette.text.secondary}
                                sx={{ flexShrink: 0 }}
                            >
                                #{props.myTeamRank}
                            </Typography>
                            <Typography
                                fontSize={"20px"}
                                color={theme.palette.text.primary}
                                noWrap
                                sx={{ minWidth: 0, flexGrow: 1 }}
                            >
                                {props.myTeam?.name}
                            </Typography>
                            <Stack
                                direction={"column"}
                                pl={2}
                            >
                                <Stack
                                    direction={"row"}
                                    spacing={1}
                                    alignItems={"center"}
                                >
                                    <Box
                                        sx={{
                                            px: 0.8,
                                            height:"16px",
                                            borderRadius: "5px",
                                            backgroundColor: theme.palette.text.secondary,
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Typography color={theme.palette.background.default} fontSize={"10px"} fontWeight={"600"}>
                                            勝ち点率
                                        </Typography>
                                    </Box>
                                    <Typography fontSize={"14px"} color={theme.palette.text.primary}>
                                        {myStanding ? computeWinRate(myStanding).toFixed(3) : "---.---"}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Card>
                </Stack>
            }

            {standings.length === 0 ? (
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
                        {standings.map((standing, index) => {
                            const team = teams.find(value => value.id === standing.team.id)
                            return (
                                <LeagueRankListCard
                                    key={`${standing.id}-${index}`}
                                    rank={standing.rank}
                                    teamName={team?.name ?? "不明"}
                                    teamId={standing.team.id}
                                    winRate={computeWinRate(standing)}
                                />
                            )
                        })}
                    </Stack>
                </Box>
            )}
        </>

    )

}
