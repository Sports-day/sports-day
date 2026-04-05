import { Box, Stack } from "@mui/material";
import Warning from "@/components/cards/AboutAnyPage/WarningCard";
import SportCards from "@/features/SportCards";
import WeatherCards from "@/features/WeatherCards";
import MainFooter from "@/components/footers/MainFooter";
import Header from "@/components/header/Header";
import { useParams } from "react-router-dom";
import CircularUnderLoad from "@/features/Loading";
import { motion } from "framer-motion";
import { useGetSportQuery } from "@/gql/__generated__/graphql";

export default function SportChoice() {
  const { type } = useParams() as { type: string };
  const { data, loading, error } = useGetSportQuery({
    variables: { sceneId: type },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <CircularUnderLoad />;
  }
  if (error) {
    throw error;
  }
  const weatherType = data?.scene?.name ?? "不明な種別";
  const sportData = data?.scene?.sportScenes?.map((ss) => ss.sport) ?? [];

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
          width: "100%",
          flex: 1,
          px: "50px",

          pt: "16px",
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

        <Stack
          spacing={"16px"}
          sx={{ height: "100%", width: "100%", minHeight: 0 }}
        >
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
