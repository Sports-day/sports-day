import { TeamData } from "@/Data/TeamManagedata";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

export default function ConfirmCard({ teamname, teammember }: TeamData) {
  return (
    <Card
      variant="outlined"
      sx={{
        background: "none",
        borderColor: "#5B6DC6",
        borderRadius: "10px",
        p: "3%",
        m: "3%",
      }}
    >
      <Box sx={{ borderColor: "#5B6DC6", p: "1%" }}>
        <Typography sx={{ color: "#5B6DC6" }}>{teamname}</Typography>
        <Grid container spacing={2}>
          {teammember.map((member, index) => (
            <Grid item xs={12} md={6} lg={6} xl={4} key={member}>
              <Card
                sx={{
                  background: "#5F6DC2",
                  borderRadius: "30px",
                  p: "3%",
                }}
              >
                <Stack
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ color: "white" }}>{member}</Typography>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
}
