import {
    Stack,
} from "@mui/material";
import * as React from "react";
import {ScheduleContent} from "./judgeScheduleContent";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

export type JudgeScheduleProps = {
    matches: PanelMatch[]
}

export const JudgeSchedule = (props: JudgeScheduleProps) => {

    return (
        <Stack
            spacing={1}
        >

            {props.matches
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((match) => (
                            <ScheduleContent
                                key={match.id}
                                match={match}
                            />
                ))}
        </Stack>
    );
};

export default JudgeSchedule;
