"use client";

import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import SeeButton from "@/components/buttons/weather/SeeButton";
import CircularUnderLoad from "./Loading";
import { gql, useQuery } from "@apollo/client";

type weatherProps = {
  id: string;
};

type SceneNode = {
  id: string;
  name: string;
};

type GetWeatherData = {
  scenes: SceneNode[];
};

export const GET_WEATHER = gql`
  query GetWeather {
    scenes {
      id
      name
    }
  }
`;

export default function WeatherCards({ id }: weatherProps) {
  const { data, loading, error } = useQuery<GetWeatherData>(GET_WEATHER);
  if (loading) return <CircularUnderLoad />;
  if (error) return <div>error</div>;
  const weather = data?.scenes.map((d) => ({
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
