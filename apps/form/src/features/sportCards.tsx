import { information } from "@/Data/SunnyData";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import SportCard from "@/components/cards/sportcard";
import GoFinal from "@/components/buttons/gofinalbutton";

export type weatherProps = {
  weatherdata: information[];
  type: string;
};

export default function SportCards({ weatherdata, type }: weatherProps) {
  return (
    <Box
      sx={{ background: "#f5f5f5", borderRadius: "10px", mx: "3vh", p: "3vh" }}
    >
      <Grid container spacing={2}>
        {weatherdata.map((item, index) => (
          <Grid xs={6} md={4} lg={4} xl={3} key={index}>
            <SportCard
              icon={item.icon}
              name={item.name}
              sportid={item.sportid}
              type={type as string}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
