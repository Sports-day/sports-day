"use client";

import TeamEdit from "@/features/teamEdit";
import SubFooter from "@/components/footers/subfooter";
import Header from "@/components/header/header";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import Instruction from "@/components/cards/AboutAnyPage/instructioncard";
import CircularUnderLoad from "@/features/loading";
import Error from "@/features/error";

const SPORTDATA_GET = gql`
  query SportDataGet($sport_Id: ID!, $scene_Id: ID!) {
    sport(id: $sport_Id) {
      name
    }
    scene(id: $scene_Id) {
      name
    }
  }
`;

export default function MemberEdit() {
  const { type, sports } = useParams() as { type: string; sports: string };
  const { data, loading, error } = useQuery(SPORTDATA_GET, {
    variables: { sport_Id: sports, scene_Id: type },
  });

  if (loading) return <CircularUnderLoad />;
  if (error) return <Error />;

  const weatherName = data?.scene?.name;
  const sportName = data?.sport?.name;

  console.log(weatherName);
  console.log(sportName);
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Header />
      <Stack
        direction="row"
        display="flex"
        justifyContent="center"
        sx={{ m: "1%" }}
      >
        <Instruction weather={weatherName} sportname={sportName} />
      </Stack>
      <TeamEdit />;
      <SubFooter />
    </Box>
  );
}
