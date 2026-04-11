import { Grid } from "@mui/material";
import type { GetPanelMatchesQuery } from "@/src/gql/__generated__/graphql";
import MatchCard from "@/components/information/match/matchCard";

type PanelMatch = GetPanelMatchesQuery["matches"][number];

export type MatchListProps = {
    matches: PanelMatch[]
}

export default function MatchList(props: MatchListProps) {
    const components = props.matches
        //  sort by date in ascending order
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        .map((match) =>
            <MatchCard
                match={match}
                key={match.id}
            />
        )
    return (
        <Grid
            container
            spacing={1}
            justifyContent="center"
            alignItems="center"
        >
            {components}
        </Grid>
    )
}
