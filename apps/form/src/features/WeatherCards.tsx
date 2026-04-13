"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import SeeButton from "@/components/buttons/weather/SeeButton";
import CircularUnderLoad from "./Loading";
import { useGetWeatherQuery } from "@/gql/__generated__/graphql";

type weatherProps = {
  id: string;
};

export default function WeatherCards({ id }: weatherProps) {
  const { data, loading, error } = useGetWeatherQuery();
  if (loading) return <CircularUnderLoad />;
  if (error) throw error;
  const weather = data?.scenes
    ?.filter((d) => !d.isDeleted)
    ?.map((d) => ({
      id: d.id,
      name: d.name,
    })) ?? [];

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container direction="row" spacing={"8px"}>
        {weather.map((item) => (
          <Grid size={{ xs: 12, sm: 4, md: 2, lg: 1 }} key={item.id}>
            <SeeButton type={item.id} name={item.name} id={id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
