import { weathers } from "@/Data/WeatherData";
import CustomButtom from "@/components/buttons/weatherbutton";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function WeatherCards() {
  return (
    <Box sx={{ ml: "6vh" }}>
      <Grid container spacing={2} direction="row">
        {weathers.map((item, index) => (
          <CustomButtom
            key={index}
            weathericon={item.weathericon}
            weatherinformation={item.weatherinformation}
            Color={item.Color}
            type={item.type}
          />
        ))}
      </Grid>
    </Box>
  );
}
