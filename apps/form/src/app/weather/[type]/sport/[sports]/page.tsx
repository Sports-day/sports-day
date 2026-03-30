"use client";

import MakingTeams from "@/features/MakingTeams";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Header from "@/components/header/Header";
import SubFooter from "@/components/footers/SubFooter";
import { gql, useQuery } from "@apollo/client";
import CircularUnderLoad from "@/features/Loading";

const SPORTDATA_GET = gql`
  query GetSport($sportId: ID!, $sceneId: ID!) {
    sport(id: $sportId) {
      name
    }
    scene(id: $sceneId) {
      name
    }
  }
`;

export default function TeamEdit() {
  const { type, sports } = useParams() as { type: string; sports: string };

  const { data, loading, error } = useQuery(SPORTDATA_GET, {
    variables: { sportId: sports, sceneId: type },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });
  if (loading) {
    return <CircularUnderLoad />;
  }
  if (error) {
    throw error;
  }
  const sportname = data?.sport.name;
  const weather = data?.scene.name;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box
        sx={{
          px: "50px",

          pt: "16px",
          width: "100%",
          flex: 1,
        }}
      >
        <MakingTeams
          sports={sports as string}
          type={type as string}
          weather={weather}
          sportname={sportname}
        />
      </Box>

      <SubFooter />
    </Box>
  );
}
