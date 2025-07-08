import Grid from "@mui/material/Grid";
import Warning from "@/components/other/warningcomment";
import SportCards from "@/features/sportCards";
import WeatherCards from "@/features/weathercards";
import { SunnyCardInformation } from "@/Data/SunnyData";
import Header from "@/components/other/header";

export default function Home() {
  return (
    <Grid container spacing={3} direction="column">
      <Grid container spacing={10} direction="row">
        <Header />
        <WeatherCards />
        <Warning warncomment="これは晴れの画面です." />
      </Grid>
      <SportCards weatherdata={SunnyCardInformation} />
    </Grid>
  );
}
