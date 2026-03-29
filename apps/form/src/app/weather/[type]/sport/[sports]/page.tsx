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
    <Box sx={{ width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        sx={{
          px: { xs: "16px", sm: "32px", md: "50px" },
          pb: { xs: "32px", md: "50px" },
          pt: "8px",
          maxWidth: 1440,
          mx: "auto",
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
