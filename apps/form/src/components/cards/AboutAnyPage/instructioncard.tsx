import { Box, Typography, Stack } from "@mui/material";

type InstructionProps = {
  weather: string;
  sportname: string;
};

export default function Instruction({ weather, sportname }: InstructionProps) {
  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Typography sx={{ fontSize: "30px", color: "#2F3C8C" }}>
          {weather}
        </Typography>
        <Typography sx={{ fontSize: "30px", color: "#2F3C8C" }}>
          {sportname}
        </Typography>
      </Stack>
    </Box>
  );
}
