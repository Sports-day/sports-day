import { RainyCardInformation } from "@/Data/RainyData";
import { SunnyCardInformation } from "@/Data/SunnyData";
import Warning from "@/components/other/warningcomment";
import SportCards from "@/features/sportCards";
import WeatherCards from "@/features/weathercards";
import Grid from "@mui/material/Grid";

type Props = {
  params: {
    type: string;
  };
};

export default async function SportChoise({ params }: Props) {
  const { type } = params;
  if (type === "sunny") {
    return (
      <Grid container spacing={3} direction="column">
        <Grid container spacing={10} direction="row">
          <WeatherCards />
          <Warning warncomment="晴天時です.間違えがないように確認してください" />
        </Grid>
        <SportCards weatherdata={SunnyCardInformation} type={type} />
      </Grid>
    );
  } else if (type === "rainy") {
    return (
      <Grid container spacing={3} direction="column">
        <Grid container spacing={10} direction="row">
          <WeatherCards />
          <Warning warncomment="雨天時です.間違えがないように確認してください" />
        </Grid>
        <SportCards weatherdata={RainyCardInformation} type={type} />
      </Grid>
    );
  } else {
    return <div>該当する天気はありません</div>;
  }
}
