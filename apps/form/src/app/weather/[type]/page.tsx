"use client";

import { Box, Stack } from "@mui/material";
import Warning from "@/components/cards/AboutAnyPage/WarningCard";
import SportCards from "@/features/SportCards";
import WeatherCards from "@/features/WeatherCards";
import MainFooter from "@/components/footers/MainFooter";
import Header from "@/components/header/Header";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import CircularUnderLoad from "@/features/Loading";
import { motion } from "framer-motion";

const GET_SPORTS = gql`
  query GetSport($sceneId: ID!) {
    scene(id: $sceneId) {
      name
      sports {
        id
        name
      }
    }
  }
`;

export default function SportChoice() {
  const { type } = useParams() as { type: string };
  const { data, loading, error } = useQuery(GET_SPORTS, {
    variables: { sceneId: type },
  });

  if (loading) {
    return <CircularUnderLoad />;
  }
  if (error) {
    throw error;
  }
  const weatherType = data?.scene.name;
  const sportData = data?.scene.sports;

  return (
    <Box sx={{ width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Box
        sx={{
          width: "100%",
          flex: 1,
          px: { xs: "16px", sm: "32px", md: "50px" },
          pb: { xs: "32px", md: "50px" },
          pt: "8px",
          maxWidth: 1440,
          mx: "auto",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <Warning
            warncomment={`${weatherType}です.間違えがないように確認してください`}
          />
        </motion.div>

        <Stack spacing={"16px"} sx={{ height: "100%", width: "100%", minHeight: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <WeatherCards id={type as string} />
          </motion.div>

          <SportCards weather={sportData} type={type as string} />
        </Stack>
      </Box>
      <MainFooter />
    </Box>
  );
}
