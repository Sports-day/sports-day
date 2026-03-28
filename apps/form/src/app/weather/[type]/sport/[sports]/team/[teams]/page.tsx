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

  if (loading) {
    return <CircularUnderLoad />;
  }
  if (error) {
    throw error;
  }

  const weatherName = data?.scene?.name;
  const sportName = data?.sport?.name;

  return (
    <Box
      sx={{ width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <Box
        sx={{
          height: {
            xs: "calc(100dvh - 64px - 72px)",
            md: "calc(100dvh - 72px - 72px)",
          },
          px: { xs: 2, sm: 3, md: 6 },
          pt: 1,
          maxWidth: 1440,
          mx: "auto",
          width: "100%",
          minHeight: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Stack
          direction="row"
          display="flex"
          justifyContent="left"
          sx={{ my: 1, flexShrink: 0 }}
        >
          <Instruction weather={weatherName} sportname={sportName} />
        </Stack>
        <Box sx={{ flex: 1, minHeight: 0 }}>
          <TeamEdit />
        </Box>
      </Box>
      <SubFooter />
    </Box>
  );
}
