"use client";

import { Box, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import SportCard from "@/components/cards/AboutSportPage/SportCard";
import { motion } from "framer-motion";
import { useGetTeamDataQuery } from "@/gql/__generated__/graphql";

type WeatherData = { name: string; id: string };

type Props = {
  weather: WeatherData[];
  type: string;
};

export default function SportCards({ weather, type }: Props) {
  const theme = useTheme();

  const { data } = useGetTeamDataQuery();

  const hasTeamMap = new Map<string, boolean>();

  weather.forEach((item) => {
    const entry = data?.scenes
      ?.filter((s) => !s.isDeleted)
      ?.flatMap((d) => d.sportScenes)
      ?.find((d) => d.sport?.id === item.id && d.scene?.id === type);
    const users =
      entry?.entries?.flatMap((s) => s.team?.users ?? []) ?? [];
    hasTeamMap.set(item.id, users.length > 0);
  });

  return (
    <Box
      sx={{
        minHeight: { xs: 320, md: 420 },
        maxHeight: { xs: "none", md: "calc(100dvh - 320px)" },
        background: theme.palette.card.light,
        borderRadius: "10px",

        p: "32px",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      <Grid container spacing={"16px"}>
        {weather.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }} key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              style={{ height: "100%", width: "100%" }}
            >
              <SportCard
                name={item.name}
                sportId={item.id}
                type={type}
                hasTeam={hasTeamMap.get(item.id) ?? false}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
