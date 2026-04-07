import {
    Stack,
} from "@mui/material";
import * as React from "react";
import {ScheduleContent} from "./ScheduleContent";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

export type ScheduleProps = {
    matches: PanelMatch[]
    myTeamId: string
}

export const Schedule = (props: ScheduleProps) => {

    return (
                <Stack
                    spacing={1}
                >

                        {props.matches
                            .sort((a, b) => a.time.localeCompare(b.time))
                            .map((match) => {
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

export default Schedule;
