"use client";

import { Grid, Box } from "@mui/material";
import SeeButton from "@/components/buttons/weather/seebutton";
import CircularUnderLoad from "./loading";
import { gql, useQuery } from "@apollo/client";

type weatherProps = {
  id: string;
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
  const { data, loading, error } = useQuery(GET_WEATHER);
  if (loading) return <CircularUnderLoad />;
  if (error) return <div>error</div>;
  console.log(data);
  const weather = data?.scenes.map((d) => ({
    id: d.id,
    name: d.name,
  }));

  return (
    <Box sx={{ width: "17%" }}>
      <Grid container direction="row">
        {weather.map((item) => (
          <Grid item lg={6} key={item.id}>
            <SeeButton type={item.id} name={item.name} id={id} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
