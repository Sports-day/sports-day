"use client";

import { Box, Stack } from "@mui/material";
import Warning from "@/components/cards/AboutAnyPage/warningCard";
import SportCards from "@/features/sportCards";
import WeatherCards from "@/features/weathercards";
import MainFooter from "@/components/footers/mainfooter";
import Header from "@/components/header/header";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import CircularUnderLoad from "@/features/loading";
import { motion } from "framer-motion";
import Error from "@/features/error";

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

export default function SportChoise() {
  const { type } = useParams() as { type: string };
  const { data, loading, error } = useQuery(GET_SPORTS, {
    variables: { sceneId: type },
  });

  if (loading) return <CircularUnderLoad />;
  if (error) return <Error />;

  const weatherType = data?.scene.name;
  const sportData = data?.scene.sports;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Header />
      <Box sx={{ width: "100%", height: "100%", p: "1%" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          <Warning
            warncomment={`${weatherType}です.間違えがないように確認してください`}
          />
        </motion.div>

        <Stack sx={{ height: "100%", width: "100%" }}>
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
