import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Weather } from "@/Data/WeatherData";
import Link from "next/link";

export default function CustomButtom({
  weathericon,
  weatherinformation,
  type,
  Color,
}: Weather) {
  return (
    <Link href={`/weather/${type}/sport`} passHref>
      <Button
        variant="contained"
        component="span"
        sx={{
          borderRadius: "30px",
          mt: "3vh",
          background: `${Color}`,
        }}
      >
        <Grid container spacing={2} display="flex">
          <Typography>{weathericon}</Typography>
          <Typography>{weatherinformation}</Typography>
        </Grid>
      </Button>
    </Link>
  );
}
