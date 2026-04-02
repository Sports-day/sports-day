import {
    Stack,
} from "@mui/material";
import * as React from "react";
import {ScheduleContent} from "./judgeScheduleContent";
import type { Match } from "@/src/gql/__generated__/graphql";

export type JudgeScheduleProps = {
    sportId: number
    gameId: number
    matches: Match[]
    myTeamId: number
}

export const JudgeSchedule = (props: JudgeScheduleProps) => {

    return (
        <Stack
            spacing={1}
        >

            {props.matches
                .sort((a, b) => a.startAt.localeCompare(b.startAt))
                .map((match: Match) => {
                    return (
                        <>
                            <ScheduleContent
                                key={match.id}
                                match={match}
                                myTeamId={props.myTeamId}
                            />

                        </>
                    );
                })}
        </Stack>
    );
};

export default JudgeSchedule;