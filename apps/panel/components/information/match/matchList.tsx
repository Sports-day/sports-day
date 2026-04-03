import { Grid } from "@mui/material";
import type { Match } from "@/src/gql/__generated__/graphql";
import MatchCard from "@/components/information/match/matchCard";

export type MatchListProps = {
    matches: Match[]
}

export default function MatchList(props: MatchListProps) {
    const components = props.matches
        //  sort by date in ascending order
        .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
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
