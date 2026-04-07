import type { GetPanelSportsQuery } from "@/src/gql/__generated__/graphql";
import {SportCard} from "@/components/sports/sportsCard"
import {Stack} from "@mui/material";

type PanelSport = GetPanelSportsQuery["sports"][number];

export type SportsListProps = {
    sports: PanelSport[]
}

export default function SportsList(props: SportsListProps) {
    const sorted = [...props.sports].sort((a, b) => b.weight - a.weight);
    return (
        <>
            <Stack direction="row" spacing={10} padding={2} alignItems="center" justifyContent="center">


                {sorted.map((sport) => (
                    <SportCard
                        key={sport.id}
                        img={sport.image?.url ?? ""}
                        link={`/information/${sport.id}`}
                    >
                        {sport.name}
                    </SportCard>
                ))}
            </Stack>
        </>
    )
}
